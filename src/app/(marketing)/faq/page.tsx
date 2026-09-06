import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd } from "@/lib/seo/json-ld";
import { getPageSeo } from "@/lib/settings";
import { Faq } from "../_components/faq";

const faqKeys = [
  "whatIs",
  "timeline",
  "selfManage",
  "packages",
  "reports",
  "gettingStarted",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq.meta");
  const seo = await getPageSeo("/faq");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
    alternates: { canonical: "/faq" },
  };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");

  return (
    <>
      <JsonLd
        data={faqJsonLd(
          faqKeys.map((key) => ({
            question: t(`items.${key}.q`),
            answer: t(`items.${key}.a`),
          })),
        )}
      />
      <Faq />
    </>
  );
}
