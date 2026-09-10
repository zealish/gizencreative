import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalContent } from "@/components/legal-content";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.terms.meta");

  return buildPageMetadata({
    page: "/terms-of-service",
    title: t("title"),
    description: t("description"),
  });
}

export default function TermsOfServicePage() {
  return <LegalContent namespace="legal.terms" />;
}
