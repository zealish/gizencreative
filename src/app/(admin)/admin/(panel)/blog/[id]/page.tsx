import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPostByIdForAdmin } from "@/lib/blog";
import { AdminPageHeader } from "../../_components/admin-page-header";
import { BlogPostForm } from "../_components/blog-post-form";
import { updateBlogPost } from "../actions";

export const metadata: Metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  const t = await getTranslations("admin.blog");

  return (
    <section className="mx-auto max-w-6xl">
      <Link
        href="/admin/blog"
        className="text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> {t("backToList")}
      </Link>
      <div className="mt-6">
        <AdminPageHeader
          eyebrow={t("eyebrow")}
          title={t("editTitle")}
          description={t("editDescription")}
        />
      </div>
      <div className="card-elegant mt-8 rounded-3xl p-6 sm:p-8">
        <BlogPostForm action={updateBlogPost} post={post} />
      </div>
    </section>
  );
}
