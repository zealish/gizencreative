import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { getPageSeo } from "@/lib/settings";
import { WebDevCta } from "./_components/webdev-cta";
import { WebDevFeatures } from "./_components/webdev-features";
import { WebDevHero } from "./_components/webdev-hero";
import { WebDevOfferings } from "./_components/webdev-offerings";
import { WebDevProcess } from "./_components/webdev-process";

const servicePath = "/services/website-development";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("websiteDevelopment.meta");
  const seo = await getPageSeo(servicePath);

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: servicePath },
  };
}

export default async function WebsiteDevelopmentPage() {
  const t = await getTranslations("websiteDevelopment.meta");

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Website Development",
            description: t("description"),
            path: servicePath,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Website Development", path: servicePath },
          ]),
        ]}
      />
      <WebDevHero />
      <WebDevOfferings />
      <WebDevProcess />
      <WebDevFeatures />
      <WebDevCta />
    </>
  );
}
