import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCtaDarkImage, getPageSeo } from "@/lib/settings";

import { AboutCta } from "./_components/about-cta";
import { AboutHero } from "./_components/about-hero";
import { AboutStory } from "./_components/about-story";
import { AboutValues } from "./_components/about-values";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.meta");
  const seo = await getPageSeo("/about");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const ctaImage = await getCtaDarkImage();
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutCta image={ctaImage} />
    </>
  );
}
