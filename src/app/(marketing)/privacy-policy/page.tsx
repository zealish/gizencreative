import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalContent } from "@/components/legal-content";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.privacy.meta");

  return buildPageMetadata({
    page: "/privacy-policy",
    title: t("title"),
    description: t("description"),
  });
}

export default function PrivacyPolicyPage() {
  return <LegalContent namespace="legal.privacy" />;
}
