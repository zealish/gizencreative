import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { getCtaDarkImage, getGeneralSettings } from "@/lib/settings";

import { AboutCta } from "./_components/about-cta";
import { AboutHero } from "./_components/about-hero";
import { AboutStory } from "./_components/about-story";
import { AboutValues } from "./_components/about-values";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.meta");

  return buildPageMetadata({
    page: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage() {
  const [ctaImage, settings] = await Promise.all([
    getCtaDarkImage(),
    getGeneralSettings(),
  ]);
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutCta image={ctaImage} phone={settings.contactPhone} />
    </>
  );
}
