import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { getCtaDarkImage } from "@/lib/settings";

import { PricingCta } from "./_components/pricing-cta";
import { PricingFaq } from "./_components/pricing-faq";
import { PricingPlans } from "./_components/pricing-plans";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing.meta");

  return buildPageMetadata({
    page: "/pricing",
    title: t("title"),
    description: t("description"),
  });
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
