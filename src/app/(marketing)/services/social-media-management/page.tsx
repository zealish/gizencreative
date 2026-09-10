import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { getCtaDarkImage } from "@/lib/settings";
import { SmmCta } from "./_components/smm-cta";
import { SmmFeatures } from "./_components/smm-features";
import { SmmHero } from "./_components/smm-hero";
import { SmmOfferings } from "./_components/smm-offerings";
import { SmmProcess } from "./_components/smm-process";

const servicePath = "/services/social-media-management";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("socialMediaManagement.meta");

  return buildPageMetadata({
    page: servicePath,
    title: t("title"),
    description: t("description"),
  });
}

export default async function SocialMediaManagementPage() {
  const t = await getTranslations("socialMediaManagement.meta");
  const ctaImage = await getCtaDarkImage();

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Social Media Management",
            description: t("description"),
            path: servicePath,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Social Media Management", path: servicePath },
          ]),
        ]}
      />
      <SmmHero />
      <SmmOfferings />
      <SmmProcess />
      <SmmFeatures />
      <SmmCta image={ctaImage} />
    </>
  );
}
