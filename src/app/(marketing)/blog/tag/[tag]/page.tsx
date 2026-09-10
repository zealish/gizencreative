import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getBlogCategories,
  getPublishedPosts,
  localizeBlogPost,
} from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { BlogPostList } from "../../_components/blog-post-list";

type PageProps = { params: Promise<{ tag: string }> };

// Locale is resolved from cookies/headers per request, so this route
// cannot be statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const t = await getTranslations("blog");

  return buildPageMetadata({
    canonical: `/blog/tag/${tag}`,
    title: t("tagPage.metaTitle", { tag }),
    description: t("tagPage.metaDescription", { tag }),
  });
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
