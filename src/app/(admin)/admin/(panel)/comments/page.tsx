import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllCommentsForAdmin } from "@/lib/blog";
import { AdminPageHeader } from "../_components/admin-page-header";
import { CommentsTable } from "./_components/comments-table";

export const metadata: Metadata = {
  title: "Comments",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  const t = await getTranslations("admin.comments");
  const comments = await getAllCommentsForAdmin();

  const rows = comments.map((comment) => ({
    id: comment.id,
    name: comment.name,
    message: comment.message,
    approved: comment.approved,
    createdAt: comment.createdAt.toISOString(),
    postTitle: comment.postTitle,
    postSlug: comment.postSlug,
  }));

  const pendingCount = rows.filter((row) => !row.approved).length;

  return (
    <section className="mx-auto max-w-6xl">
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="card-elegant mt-8 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">{t("listTitle")}</h2>
          <p className="text-sm text-muted">
            {t("commentCount", { count: rows.length })}
            {pendingCount > 0
              ? ` · ${t("pendingCount", { count: pendingCount })}`
              : null}
          </p>
        </div>
        <div className="mt-6">
          <CommentsTable comments={rows} />
        </div>
      </div>
    </section>
  );
}
