import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getBlogCategories,
  getPublishedPosts,
  localizeBlogCategory,
  localizeBlogPost,
} from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { BlogPostList } from "../../_components/blog-post-list";

type PageProps = { params: Promise<{ category: string }> };

// Locale is resolved from cookies/headers per request, so this route
// cannot be statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getBlogCategories();
  const record = categories.find((entry) => entry.slug === category);
  if (!record) return {};

  const t = await getTranslations("blog");
  const locale = await getLocale();
  const categoryName = localizeBlogCategory(record, locale).name;

  return buildPageMetadata({
    canonical: `/blog/category/${category}`,
    title: t("categoryPage.metaTitle", { category: categoryName }),
    description: t("categoryPage.metaDescription", { category: categoryName }),
  });
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categories = await getBlogCategories();
  const record = categories.find((entry) => entry.slug === category);
  if (!record) notFound();

  const t = await getTranslations("blog");
  const locale = await getLocale();
  const categoryName = localizeBlogCategory(record, locale).name;
  const posts = (await getPublishedPosts())
    .filter((post) => post.category === category)
    .map((post) => localizeBlogPost(post, locale, categories));

  return (
    <BlogPostList
      eyebrow={t("categoryPage.eyebrow")}
      title={categoryName}
      subtitle={t("categoryPage.subtitle", { category: categoryName })}
      posts={posts}
    />
  );
}
