import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { getCtaDarkImage } from "@/lib/settings";

import { PortfolioCta } from "./_components/portfolio-cta";
import { PortfolioGrid } from "./_components/portfolio-grid";
import { PortfolioHero } from "./_components/portfolio-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio.meta");

  return buildPageMetadata({
    page: "/portfolio",
    title: t("title"),
    description: t("description"),
  });
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
