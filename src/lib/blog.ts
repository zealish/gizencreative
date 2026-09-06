import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { BlogCategoryInfo, LocalizedBlogPost } from "@/lib/blog-shared";
import { db } from "@/lib/db";
import { blogCategory, blogComment, blogPost } from "@/lib/db/schema";

export type { BlogCategoryInfo, LocalizedBlogPost } from "@/lib/blog-shared";

export type BlogPostRecord = typeof blogPost.$inferSelect;
export type BlogCategoryRecord = typeof blogCategory.$inferSelect;
export type BlogCommentRecord = typeof blogComment.$inferSelect;

const gradients = [
  "from-emerald-200 via-teal-100 to-sky-200",
  "from-amber-200 via-orange-100 to-rose-200",
  "from-lime-200 via-emerald-100 to-teal-200",
  "from-indigo-200 via-purple-100 to-fuchsia-200",
  "from-rose-200 via-pink-100 to-amber-100",
  "from-sky-200 via-cyan-100 to-emerald-200",
] as const;

function gradientForSlug(slug: string): string {
  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }
  return gradients[hash % gradients.length];
}

function isHtmlContent(content: string): boolean {
  return /^\s*</.test(content);
}

export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function localizeBlogCategory(
  category: BlogCategoryRecord,
  locale: string,
): BlogCategoryInfo {
  const isEnglish = locale.startsWith("en");
  return {
    slug: category.slug,
    name: isEnglish ? category.nameEn : category.nameId,
  };
}

export function localizeBlogPost(
  post: BlogPostRecord,
  locale: string,
  categories: BlogCategoryRecord[],
): LocalizedBlogPost {
  const isEnglish = locale.startsWith("en");
  const category = categories.find((entry) => entry.slug === post.category);
  const content = isEnglish ? post.contentEn : post.contentId;
  const isHtml = isHtmlContent(content);
  return {
    slug: post.slug,
    category: category
      ? localizeBlogCategory(category, locale)
      : { slug: post.category, name: post.category },
    tags: post.tags,
    coverImage: post.coverImage,
    readMinutes: post.readMinutes,
    date: post.publishedAt.toISOString(),
    title: isEnglish ? post.titleEn : post.titleId,
    excerpt: isEnglish ? post.excerptEn : post.excerptId,
    paragraphs: isHtml ? [] : splitParagraphs(content),
    contentHtml: isHtml ? content : null,
    gradient: gradientForSlug(post.slug),
  };
}

function reviveDates(post: BlogPostRecord): BlogPostRecord {
  return {
    ...post,
    publishedAt: new Date(post.publishedAt),
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  };
}

const getCachedPublishedPosts = unstable_cache(
  async (): Promise<BlogPostRecord[]> => {
    return db
      .select()
      .from(blogPost)
      .where(eq(blogPost.published, true))
      .orderBy(desc(blogPost.publishedAt));
  },
  ["published-blog-posts"],
  { tags: ["blog-posts"] },
);

export async function getPublishedPosts(): Promise<BlogPostRecord[]> {
  const posts = await getCachedPublishedPosts();
  return posts.map(reviveDates);
}

const getCachedPublishedPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPostRecord | null> => {
    const rows = await db
      .select()
      .from(blogPost)
      .where(and(eq(blogPost.slug, slug), eq(blogPost.published, true)))
      .limit(1);
    return rows[0] ?? null;
  },
  ["published-blog-post"],
  { tags: ["blog-posts"] },
);

export async function getPublishedPostBySlug(
  slug: string,
): Promise<BlogPostRecord | null> {
  const post = await getCachedPublishedPostBySlug(slug);
  return post ? reviveDates(post) : null;
}

export async function getPublishedTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const unique = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      unique.add(tag);
    }
  }
  return [...unique].sort();
}

const getCachedCategories = unstable_cache(
  async (): Promise<BlogCategoryRecord[]> => {
    return db.select().from(blogCategory).orderBy(asc(blogCategory.nameId));
  },
  ["blog-categories"],
  { tags: ["blog-categories"] },
);

export async function getBlogCategories(): Promise<BlogCategoryRecord[]> {
  const categories = await getCachedCategories();
  return categories.map((category) => ({
    ...category,
    createdAt: new Date(category.createdAt),
  }));
}

export async function getAllTagsForAdmin(): Promise<string[]> {
  const rows = await db.select({ tags: blogPost.tags }).from(blogPost);
  const unique = new Set<string>();
  for (const row of rows) {
    for (const tag of row.tags) {
      unique.add(tag);
    }
  }
  return [...unique].sort();
}

export async function getAllPostsForAdmin(): Promise<BlogPostRecord[]> {
  return db.select().from(blogPost).orderBy(desc(blogPost.publishedAt));
}

export async function getPostByIdForAdmin(
  id: string,
): Promise<BlogPostRecord | null> {
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getApprovedCommentsByPostId(
  postId: string,
): Promise<BlogCommentRecord[]> {
  return db
    .select()
    .from(blogComment)
    .where(and(eq(blogComment.postId, postId), eq(blogComment.approved, true)))
    .orderBy(desc(blogComment.createdAt));
}

export async function getAllCommentsForAdmin() {
  return db
    .select({
      id: blogComment.id,
      postId: blogComment.postId,
      name: blogComment.name,
      message: blogComment.message,
      approved: blogComment.approved,
      createdAt: blogComment.createdAt,
      postTitle: blogPost.titleId,
      postSlug: blogPost.slug,
    })
    .from(blogComment)
    .innerJoin(blogPost, eq(blogComment.postId, blogPost.id))
    .orderBy(desc(blogComment.createdAt));
}
