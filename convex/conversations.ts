import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGet = mutation({
  args: { memberId: v.id("members"), workspaceId: v.id("workspaces") },
  handler: async (ctx, { memberId, workspaceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();
    const otherMember = await ctx.db.get(memberId);
    if (!currentMember || !otherMember) throw new Error("Member not found");
    if (currentMember.workspaceId !== otherMember.workspaceId)
      throw new Error("Unauthorized");

    let existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_workspace_id_members", (q) =>
        q
          .eq("workspaceId", workspaceId)
          .eq("memberOneId", currentMember._id)
          .eq("memberTwoId", otherMember._id)
      )
      .unique();
    if (!existingConversation) {
      existingConversation = await ctx.db
        .query("conversations")
        .withIndex("by_workspace_id_members", (q) =>
          q
            .eq("workspaceId", workspaceId)
            .eq("memberOneId", otherMember._id)
            .eq("memberTwoId", currentMember._id)
        )
        .unique();
    }
    if (existingConversation) return existingConversation;

    const conversationId = await ctx.db.insert("conversations", {
      workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) throw new Error("Conversation not found");
    return conversation;
  },
});
