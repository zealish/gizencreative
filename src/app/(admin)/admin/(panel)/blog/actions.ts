"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blogCategory, blogPost } from "@/lib/db/schema";

const blogPostSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tags: z.string().transform((value) =>
    value
      .split(",")
      .map((tag) =>
        tag
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      )
      .filter((tag) => tag.length > 0)
      .slice(0, 8),
  ),
  coverImage: z
    .string()
    .trim()
    .max(500)
    .transform((value) => (value.length > 0 ? value : null)),
  titleId: z.string().trim().min(3).max(200),
  titleEn: z.string().trim().min(3).max(200),
  excerptId: z.string().trim().min(3).max(500),
  excerptEn: z.string().trim().min(3).max(500),
  contentId: z.string().trim().min(10),
  contentEn: z.string().trim().min(10),
  published: z.coerce.boolean(),
  publishedAt: z.coerce.date(),
});

const WORDS_PER_MINUTE = 200;

function computeReadMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(60, Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)));
}

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }
}

function parsePostForm(formData: FormData) {
  const parsed = blogPostSchema.safeParse({
    slug: formData.get("slug"),
    category: formData.get("category"),
    tags: formData.get("tags") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    titleId: formData.get("titleId"),
    titleEn: formData.get("titleEn"),
    excerptId: formData.get("excerptId"),
    excerptEn: formData.get("excerptEn"),
    contentId: formData.get("contentId"),
    contentEn: formData.get("contentEn"),
    published: formData.get("published") === "on",
    publishedAt: formData.get("publishedAt") || new Date().toISOString(),
  });
  if (!parsed.success) {
    throw new Error(`Invalid blog post data: ${parsed.error.message}`);
  }
  return {
    ...parsed.data,
    readMinutes: computeReadMinutes(parsed.data.contentId),
  };
}

async function assertCategoryExists(slug: string) {
  const rows = await db
    .select({ slug: blogCategory.slug })
    .from(blogCategory)
    .where(eq(blogCategory.slug, slug))
    .limit(1);
  if (rows.length === 0) {
    throw new Error(`Unknown category: ${slug}`);
  }
}

function revalidateBlog(slug: string) {
  revalidateTag("blog-posts", "max");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function createBlogPost(formData: FormData) {
  await requireSession();
  const data = parsePostForm(formData);
  await assertCategoryExists(data.category);

  const existing = await db
    .select({ id: blogPost.id })
    .from(blogPost)
    .where(eq(blogPost.slug, data.slug))
    .limit(1);
  if (existing.length > 0) {
    throw new Error(`Slug already in use: ${data.slug}`);
  }

  await db.insert(blogPost).values({
    id: randomUUID(),
    ...data,
    updatedAt: new Date(),
  });

  revalidateBlog(data.slug);
  redirect("/admin/blog");
}

export async function updateBlogPost(formData: FormData) {
  await requireSession();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Missing post id");
  }
  const data = parsePostForm(formData);
  await assertCategoryExists(data.category);

  const existing = await db
    .select({ id: blogPost.id })
    .from(blogPost)
    .where(eq(blogPost.slug, data.slug))
    .limit(1);
  if (existing.length > 0 && existing[0].id !== id) {
    throw new Error(`Slug already in use: ${data.slug}`);
  }

  await db
    .update(blogPost)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPost.id, id));

  revalidateBlog(data.slug);
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireSession();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Missing post id");
  }

  const rows = await db
    .select({ slug: blogPost.slug })
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  if (rows.length === 0) {
    throw new Error("Post not found");
  }

  await db.delete(blogPost).where(eq(blogPost.id, id));

  revalidateBlog(rows[0].slug);
}

export async function toggleBlogPostPublished(formData: FormData) {
  await requireSession();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Missing post id");
  }

  const rows = await db
    .select({ slug: blogPost.slug, published: blogPost.published })
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  if (rows.length === 0) {
    throw new Error("Post not found");
  }

  await db
    .update(blogPost)
    .set({ published: !rows[0].published, updatedAt: new Date() })
    .where(eq(blogPost.id, id));

  revalidateBlog(rows[0].slug);
}

const blogCategorySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nameId: z.string().trim().min(2).max(100),
  nameEn: z.string().trim().min(2).max(100),
});

export type BlogCategoryMutationResult =
  | { ok: true; category: { slug: string; nameId: string; nameEn: string } }
  | { ok: false; error: "invalid" | "duplicate" | "not_found" | "in_use" };

export type CreateBlogCategoryResult = BlogCategoryMutationResult;
export type UpdateBlogCategoryResult = BlogCategoryMutationResult;

function revalidateCategories() {
  revalidateTag("blog-categories", "max");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
}

export async function createBlogCategory(
  input: unknown,
): Promise<CreateBlogCategoryResult> {
  await requireSession();
  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const existing = await db
    .select({ slug: blogCategory.slug })
    .from(blogCategory)
    .where(eq(blogCategory.slug, parsed.data.slug))
    .limit(1);
  if (existing.length > 0) return { ok: false, error: "duplicate" };
  await db.insert(blogCategory).values(parsed.data);
  revalidateCategories();
  return { ok: true, category: parsed.data };
}

export async function updateBlogCategory(
  input: unknown,
): Promise<UpdateBlogCategoryResult> {
  await requireSession();
  const originalSlug =
    typeof input === "object" &&
    input !== null &&
    "originalSlug" in input &&
    typeof input.originalSlug === "string"
      ? input.originalSlug
      : "";
  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success || !originalSlug) return { ok: false, error: "invalid" };
  const existing = await db
    .select({ slug: blogCategory.slug })
    .from(blogCategory)
    .where(eq(blogCategory.slug, parsed.data.slug))
    .limit(1);
  if (existing.length > 0 && parsed.data.slug !== originalSlug)
    return { ok: false, error: "duplicate" };
  const result = await db
    .update(blogCategory)
    .set(parsed.data)
    .where(eq(blogCategory.slug, originalSlug))
    .returning({ slug: blogCategory.slug });
  if (result.length === 0) return { ok: false, error: "not_found" };
  if (parsed.data.slug !== originalSlug)
    await db
      .update(blogPost)
      .set({ category: parsed.data.slug })
      .where(eq(blogPost.category, originalSlug));
  revalidateCategories();
  return { ok: true, category: parsed.data };
}

export async function deleteBlogCategory(
  slug: unknown,
): Promise<
  { ok: true } | { ok: false; error: "invalid" | "not_found" | "in_use" }
> {
  await requireSession();
  if (
    typeof slug !== "string" ||
    !blogCategorySchema.shape.slug.safeParse(slug).success
  )
    return { ok: false, error: "invalid" };
  const used = await db
    .select({ id: blogPost.id })
    .from(blogPost)
    .where(eq(blogPost.category, slug))
    .limit(1);
  if (used.length > 0) return { ok: false, error: "in_use" };
  const result = await db
    .delete(blogCategory)
    .where(eq(blogCategory.slug, slug))
    .returning({ slug: blogCategory.slug });
  if (result.length === 0) return { ok: false, error: "not_found" };
  revalidateCategories();
  return { ok: true };
}
