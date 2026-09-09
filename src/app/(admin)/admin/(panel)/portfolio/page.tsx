import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAllPortfolioForAdmin } from "@/lib/portfolio";
import { AdminPageHeader } from "../_components/admin-page-header";
import { PortfolioTable } from "./_components/portfolio-table";

export const metadata: Metadata = {
  title: "Portfolio",
  robots: { index: false, follow: false },
};

export default async function AdminPortfolioPage() {
  const t = await getTranslations("portfolioAdmin");
  const projects = await getAllPortfolioForAdmin();
  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Link
          href="/admin/portfolio/new"
          className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
        >
          {t("new")}
        </Link>
      </div>
      <div className="card-elegant mt-8 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-bold tracking-tight">{t("listTitle")}</h2>
          <p className="text-sm text-muted">
            {t("projectCount", { count: projects.length })}
          </p>
        </div>
        <div className="mt-6">
          <PortfolioTable
            projects={projects.map(
              ({ id, projectName, clientCompany, year, published }) => ({
                id,
                projectName,
                clientCompany,
                year,
                published,
              }),
            )}
          />
        </div>
      </div>
    </section>
  );
}
