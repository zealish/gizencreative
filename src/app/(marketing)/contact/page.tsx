import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { getCtaDarkImage, getGeneralSettings } from "@/lib/settings";

import { ContactChannels } from "./_components/contact-channels";
import { ContactCta } from "./_components/contact-cta";
import { ContactHero } from "./_components/contact-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact.meta");

  return buildPageMetadata({
    page: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage() {
  const [ctaImage, settings] = await Promise.all([
    getCtaDarkImage(),
    getGeneralSettings(),
  ]);
  return (
    <>
      <ContactHero />
      <ContactChannels settings={settings} />
      <ContactCta image={ctaImage} phone={settings.contactPhone} />
    </>
  );
}
