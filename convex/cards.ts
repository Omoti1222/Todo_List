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
