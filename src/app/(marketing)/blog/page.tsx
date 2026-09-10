import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getBlogCategories,
  getPublishedPosts,
  localizeBlogPost,
} from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

import { BlogGrid } from "./_components/blog-grid";
import { BlogHero } from "./_components/blog-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog.meta");

  return buildPageMetadata({
    page: "/blog",
    title: t("title"),
    description: t("description"),
  });
}

export default async function BlogPage() {
  const locale = await getLocale();
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getBlogCategories(),
  ]);
  const localizedPosts = posts.map((post) =>
    localizeBlogPost(post, locale, categories),
  );
  const filterCategories = categories.map((category) => ({
    slug: category.slug,
    name: locale.startsWith("en") ? category.nameEn : category.nameId,
  }));

  return (
    <>
      <BlogHero />
      <BlogGrid posts={localizedPosts} categories={filterCategories} />
    </>
  );
}
