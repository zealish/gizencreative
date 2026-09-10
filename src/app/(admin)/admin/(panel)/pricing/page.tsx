import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAllPricingPlansForAdmin } from "@/lib/pricing";
import { AdminPageHeader } from "../_components/admin-page-header";
import { PricingTable } from "./_components/pricing-table";

export const metadata: Metadata = {
  title: "Pricing",
  robots: { index: false, follow: false },
};

export default async function AdminPricingPage() {
  const t = await getTranslations("pricingAdmin");
  const plans = await getAllPricingPlansForAdmin();
  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <Link
          href="/admin/pricing/new"
          className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
        >
          {t("new")}
        </Link>
      </div>
      <div className="card-elegant mt-8 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-bold tracking-tight">{t("listTitle")}</h2>
          <p className="text-sm text-muted">
            {t("planCount", { count: plans.length })}
          </p>
        </div>
        <div className="mt-6">
          <PricingTable
            plans={plans.map(
              ({
                id,
                nameId,
                service,
                seoTier,
                price,
                sortOrder,
                published,
              }) => ({
                id,
                nameId,
                service,
                seoTier,
                price,
                sortOrder,
                published,
              }),
            )}
          />
        </div>
      </div>
    </section>
  );
}
