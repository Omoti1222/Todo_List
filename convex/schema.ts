import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    title: v.string(),
    hypothesis: v.string(),
    success: v.string(),
    status: v.string(),
    result: v.string(),
    learning: v.string(),
    comment: v.string(),
    createdAt: v.string(),
    completedAt: v.optional(v.string()),
  }),
});
