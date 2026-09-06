"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogComment, blogPost } from "@/lib/db/schema";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }
}

async function getCommentWithSlug(id: string) {
  const rows = await db
    .select({
      id: blogComment.id,
      approved: blogComment.approved,
      slug: blogPost.slug,
    })
    .from(blogComment)
    .innerJoin(blogPost, eq(blogComment.postId, blogPost.id))
    .where(eq(blogComment.id, id))
    .limit(1);
  return rows[0] ?? null;
}

function revalidateComments(slug: string) {
  revalidatePath("/admin/comments");
  revalidatePath(`/blog/${slug}`);
}

function getId(formData: FormData): string {
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Missing comment id");
  }
  return id;
}

export async function toggleCommentApproved(formData: FormData) {
  await requireSession();
  const id = getId(formData);

  const comment = await getCommentWithSlug(id);
  if (!comment) {
    throw new Error("Comment not found");
  }

  await db
    .update(blogComment)
    .set({ approved: !comment.approved })
    .where(eq(blogComment.id, id));

  revalidateComments(comment.slug);
}

export async function deleteComment(formData: FormData) {
  await requireSession();
  const id = getId(formData);

  const comment = await getCommentWithSlug(id);
  if (!comment) {
    throw new Error("Comment not found");
  }

  await db.delete(blogComment).where(eq(blogComment.id, id));

  revalidateComments(comment.slug);
}
