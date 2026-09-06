import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageSeo } from "@/lib/settings";

import { BlogGrid } from "./_components/blog-grid";
import { BlogHero } from "./_components/blog-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog.meta");
  const seo = await getPageSeo("/blog");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: "/blog" },
  };
}

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogGrid />
    </>
  );
}
