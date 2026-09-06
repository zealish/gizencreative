import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCtaDarkImage, getPageSeo } from "@/lib/settings";

import { PortfolioCta } from "./_components/portfolio-cta";
import { PortfolioGrid } from "./_components/portfolio-grid";
import { PortfolioHero } from "./_components/portfolio-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio.meta");
  const seo = await getPageSeo("/portfolio");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: "/portfolio" },
  };
}

export default async function PortfolioPage() {
  const ctaImage = await getCtaDarkImage();
  return (
    <>
      <PortfolioHero />
      <PortfolioGrid />
      <PortfolioCta image={ctaImage} />
    </>
  );
}
