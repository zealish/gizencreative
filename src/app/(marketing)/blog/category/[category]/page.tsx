import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  blogCategories,
  blogPosts,
  isBlogCategory,
} from "../../_components/blog-data";
import { BlogPostList } from "../../_components/blog-post-list";

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isBlogCategory(category)) return {};

  const t = await getTranslations("blog");
  const categoryName = t(`categories.${category}`);

  return {
    title: t("categoryPage.metaTitle", { category: categoryName }),
    description: t("categoryPage.metaDescription", { category: categoryName }),
    alternates: { canonical: `/blog/category/${category}` },
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!isBlogCategory(category)) notFound();

  const t = await getTranslations("blog");
  const categoryName = t(`categories.${category}`);
  const posts = blogPosts.filter((post) => post.category === category);

  return (
    <BlogPostList
      eyebrow={t("categoryPage.eyebrow")}
      title={categoryName}
      subtitle={t("categoryPage.subtitle", { category: categoryName })}
      posts={posts}
    />
  );
}
