import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AdminPageHeader } from "../../_components/admin-page-header";
import { PortfolioForm } from "../_components/portfolio-form";
import { savePortfolio } from "../actions";

export const metadata: Metadata = {
  title: "Portfolio",
  robots: { index: false, follow: false },
};

export default async function NewPortfolio() {
  const t = await getTranslations("portfolioAdmin");
  return (
    <section className="mx-auto max-w-6xl">
      <Link
        href="/admin/portfolio"
        className="text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> {t("backToList")}
      </Link>
      <div className="mt-6">
        <AdminPageHeader
          eyebrow={t("eyebrow")}
          title={t("new")}
          description={t("newDescription")}
        />
      </div>
      <div className="card-elegant mt-8 rounded-3xl p-6 sm:p-8">
        <PortfolioForm action={savePortfolio} />
      </div>
    </section>
  );
}
