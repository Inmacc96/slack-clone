import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};

export const getById = query({
  args: { id: v.id("members") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db.get(id);
    if (!member) return null;

    // Check if current user is member
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      );
    if (!currentMember) return null;

    const user = populateUser(ctx, member.userId);
    if (!user) return null;

    return { ...member, user };
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) return [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    const members = await Promise.all(
      data.map(async (member) => {
        const user = await populateUser(ctx, member.userId);
        return user ? { ...member, user } : null;
      })
    );

    return members.filter((member) => member !== null);
  },
});

export const current = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();
  },
});
