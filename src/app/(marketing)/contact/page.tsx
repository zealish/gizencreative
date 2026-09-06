import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCtaDarkImage, getPageSeo } from "@/lib/settings";

import { ContactChannels } from "./_components/contact-channels";
import { ContactCta } from "./_components/contact-cta";
import { ContactHero } from "./_components/contact-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact.meta");
  const seo = await getPageSeo("/contact");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const ctaImage = await getCtaDarkImage();
  return (
    <>
      <ContactHero />
      <ContactChannels />
      <ContactCta image={ctaImage} />
    </>
  );
}
