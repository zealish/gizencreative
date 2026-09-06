import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageSeo } from "@/lib/settings";

import { Bento } from "./_components/bento";
import { CtaDark } from "./_components/cta-dark";
import { Faq } from "./_components/faq";
import { Hero } from "./_components/hero";
import { Services } from "./_components/services";
import { TechMarquee } from "./_components/tech-marquee";
import { Testimonials } from "./_components/testimonials";
import { UseCases } from "./_components/use-cases";
import { WhyChooseUs } from "./_components/why-choose-us";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const seo = await getPageSeo("/");

  return {
    title: seo.title || t("title"),
    description: seo.description || t("description"),
  };
}

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Services />
      <Bento />
      <Testimonials />
      <UseCases />
      <WhyChooseUs />
      <Faq />
      <CtaDark />
    </>
  );
}
