"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { blogComment, blogPost } from "@/lib/db/schema";

const commentSchema = z.object({
  postId: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(2000),
});

export type SubmitCommentResult =
  | { ok: true }
  | { ok: false; error: "invalid" };

export async function submitBlogComment(
  input: unknown,
): Promise<SubmitCommentResult> {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const rows = await db
    .select({ id: blogPost.id })
    .from(blogPost)
    .where(eq(blogPost.id, parsed.data.postId))
    .limit(1);
  if (rows.length === 0) {
    return { ok: false, error: "invalid" };
  }

  await db.insert(blogComment).values({
    id: randomUUID(),
    postId: parsed.data.postId,
    name: parsed.data.name,
    message: parsed.data.message,
  });

  return { ok: true };
}
