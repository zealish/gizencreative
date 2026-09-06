import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { getCtaDarkImage, getPageSeo } from "@/lib/settings";
import { SeoCta } from "./_components/seo-cta";
import { SeoFeatures } from "./_components/seo-features";
import { SeoHero } from "./_components/seo-hero";
import { SeoOfferings } from "./_components/seo-offerings";
import { SeoProcess } from "./_components/seo-process";

const servicePath = "/services/seo-website";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seoWebsite.meta");
  const seo = await getPageSeo(servicePath);

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: servicePath },
  };
}

export default async function SeoWebsitePage() {
  const t = await getTranslations("seoWebsite.meta");
  const ctaImage = await getCtaDarkImage();

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "SEO Website",
            description: t("description"),
            path: servicePath,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "SEO Website", path: servicePath },
          ]),
        ]}
      />
      <SeoHero />
      <SeoOfferings />
      <SeoProcess />
      <SeoFeatures />
      <SeoCta image={ctaImage} />
    </>
  );
}
