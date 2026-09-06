import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getAllPostsForAdmin, getBlogCategories } from "@/lib/blog";
import { AdminPageHeader } from "../_components/admin-page-header";
import { BlogPostsTable } from "./_components/blog-posts-table";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const t = await getTranslations("admin.blog");
  const locale = await getLocale();
  const [posts, categories] = await Promise.all([
    getAllPostsForAdmin(),
    getBlogCategories(),
  ]);
  const isEnglish = locale.startsWith("en");

  const categoryOptions = categories.map((category) => ({
    value: category.slug,
    label: isEnglish ? category.nameEn : category.nameId,
  }));

  const rows = posts.map((post) => ({
    id: post.id,
    titleId: post.titleId,
    slug: post.slug,
    category: post.category,
    categoryName:
      categoryOptions.find((option) => option.value === post.category)?.label ??
      post.category,
    published: post.published,
    publishedAt: post.publishedAt.toISOString(),
  }));

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
        >
          {t("newPost")}
        </Link>
      </div>
      <div className="card-elegant mt-8 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-bold tracking-tight">{t("listTitle")}</h2>
          <p className="text-sm text-muted">
            {t("postCount", { count: posts.length })}
          </p>
        </div>
        <div className="mt-6">
          <BlogPostsTable posts={rows} categories={categoryOptions} />
        </div>
      </div>
    </section>
  );
}
