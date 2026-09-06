import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalContent } from "@/components/legal-content";
import { getPageSeo } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.terms.meta");
  const seo = await getPageSeo("/terms-of-service");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: "/terms-of-service" },
  };
}

export default function TermsOfServicePage() {
  return <LegalContent namespace="legal.terms" />;
}
