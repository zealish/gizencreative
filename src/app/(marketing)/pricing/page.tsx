import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCtaDarkImage, getPageSeo } from "@/lib/settings";

import { PricingCta } from "./_components/pricing-cta";
import { PricingFaq } from "./_components/pricing-faq";
import { PricingPlans } from "./_components/pricing-plans";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing.meta");
  const seo = await getPageSeo("/pricing");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: "/pricing" },
  };
}

export default async function PricingPage() {
  const ctaImage = await getCtaDarkImage();
  return (
    <>
      <PricingPlans />
      <PricingFaq />
      <PricingCta image={ctaImage} />
    </>
  );
}
