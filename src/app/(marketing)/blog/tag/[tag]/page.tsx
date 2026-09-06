import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getBlogCategories,
  getPublishedPosts,
  getPublishedTags,
  localizeBlogPost,
} from "@/lib/blog";
import { BlogPostList } from "../../_components/blog-post-list";

type PageProps = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  try {
    const tags = await getPublishedTags();
    return tags.map((tag) => ({ tag }));
  } catch {
    // DB unavailable at build time (e.g., Docker build); render on demand.
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const t = await getTranslations("blog");

  return {
    title: t("tagPage.metaTitle", { tag }),
    description: t("tagPage.metaDescription", { tag }),
    alternates: { canonical: `/blog/tag/${tag}` },
  };
}

export default async function BlogTagPage({ params }: PageProps) {
  const { tag } = await params;
  const locale = await getLocale();
  const categories = await getBlogCategories();
  const posts = (await getPublishedPosts())
    .filter((post) => post.tags.includes(tag))
    .map((post) => localizeBlogPost(post, locale, categories));
  if (posts.length === 0) notFound();

  const t = await getTranslations("blog");

  return (
    <BlogPostList
      eyebrow={t("tagPage.eyebrow")}
      title={`#${tag}`}
      subtitle={t("tagPage.subtitle", { tag })}
      posts={posts}
    />
  );
}
