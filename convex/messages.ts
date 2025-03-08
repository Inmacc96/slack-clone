import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();
  if (messages.length === 0) {
    return { count: 0, images: undefined, timestamp: 0 };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);
  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
  };
};

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (
    ctx,
    { channelId, conversationId, parentMessageId, paginationOpts }
  ) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    let _conversationId = conversationId;

    // Only possible if we are replying in a thread in 1:1 conversation
    if (!conversationId && !channelId && parentMessageId) {
      const parentMessage = await ctx.db.get(parentMessageId);
      if (!parentMessage) throw new Error("Parent message not fount");

      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", channelId)
          .eq("parentMessageId", parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;
            if (!member || !user) return null;
            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            const reactionsWithCounts = reactions.reduce<
              (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            >((acc, reaction) => {
              const existingReaction = acc.find(
                (r) => r.value === reaction.value
              );
              if (existingReaction) {
                existingReaction.memberIds = Array.from(
                  new Set([...existingReaction.memberIds, reaction.memberId])
                );
                existingReaction.count++;
              } else {
                acc.push({
                  ...reaction,
                  count: 1,
                  memberIds: [reaction.memberId],
                });
              }
              return acc;
            }, []);
            const reactionsWithoutMemberIdProperty = reactionsWithCounts.map(
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionsWithoutMemberIdProperty,
              thread,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (
    ctx,
    { body, image, workspaceId, channelId, conversationId, parentMessageId }
  ) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await getMember(ctx, workspaceId, userId);
    if (!member) throw new Error("Unauthorized");

    let _conversationId = conversationId;

    // Only possible if we are replying in a thread in 1:1 conversation
    if (!conversationId && !channelId && parentMessageId) {
      const parentMessage = await ctx.db.get(parentMessageId);
      if (!parentMessage) throw new Error("Parent message not fount");

      _conversationId = parentMessage.conversationId;
    }

    return await ctx.db.insert("messages", {
      body,
      image,
      memberId: member._id,
      workspaceId,
      channelId,
      conversationId: _conversationId,
      parentMessageId,
    });
  },
});

export const update = mutation({
  args: { id: v.id("messages"), body: v.string() },
  handler: async (ctx, { id, body }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(id);
    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || message.memberId !== member._id)
      throw new Error("Unauthorized");

    await ctx.db.patch(id, { body, updatedAt: Date.now() });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(id);
    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || message.memberId !== member._id)
      throw new Error("Unauthorized");

    await ctx.db.delete(id);

    return id;
  },
});
