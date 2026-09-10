import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import {
  getBentoCustomImage,
  getCtaDarkImage,
  getGeneralSettings,
  getUseCaseImages,
} from "@/lib/settings";

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

  return buildPageMetadata({
    page: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function MarketingPage() {
  const [useCaseImages, bentoImage, ctaDarkImage, settings] = await Promise.all(
    [
      getUseCaseImages(),
      getBentoCustomImage(),
      getCtaDarkImage(),
      getGeneralSettings(),
    ],
  );

  return (
    <>
      <Hero />
      <div className="bg-[#f9fafb] dark:bg-background">
        <TechMarquee />
        <Services />
        <Bento customImage={bentoImage} />
        <Testimonials />
        <UseCases images={useCaseImages} />
        <WhyChooseUs />
        <Faq />
        <CtaDark image={ctaDarkImage} phone={settings.contactPhone} />
      </div>
    </>
  );
}
