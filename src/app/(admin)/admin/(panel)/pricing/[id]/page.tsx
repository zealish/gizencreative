import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPricingPlanById } from "@/lib/pricing";
import { AdminPageHeader } from "../../_components/admin-page-header";
import { PricingForm } from "../_components/pricing-form";
import { savePricingPlan } from "../actions";

export const metadata: Metadata = {
  title: "Pricing",
  robots: { index: false, follow: false },
};

export default async function EditPricingPlan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getPricingPlanById(id);
  if (!plan) notFound();
  const t = await getTranslations("pricingAdmin");
  return (
    <section className="mx-auto max-w-6xl">
      <Link
        href="/admin/pricing"
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
        <PricingForm action={savePricingPlan} plan={plan} />
      </div>
    </section>
  );
}
