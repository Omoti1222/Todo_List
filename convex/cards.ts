import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("cards").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    hypothesis: v.string(),
    success: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("cards", {
      title: args.title,
      hypothesis: args.hypothesis,
      success: args.success,
      status: "planned",
      result: "",
      learning: "",
      comment: "",
      createdAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("cards"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const editTitle = mutation({
  args: {
    id: v.id("cards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { title: args.title });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("cards"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      completedAt:
        args.status === "done" ? new Date().toISOString() : undefined,
    });
  },
});

export const complete = mutation({
  args: {
    id: v.id("cards"),
    result: v.string(),
    learning: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "done",
      result: args.result,
      learning: args.learning,
      comment: args.comment,
      completedAt: new Date().toISOString(),
    });
  },
});
