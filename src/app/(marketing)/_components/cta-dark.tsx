import { Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { ScrollScale } from "@/components/scroll-scale";
import { WaLink } from "@/components/wa-link";

export function CtaDark({ image }: { image?: string | null }) {
  const t = useTranslations("ctaDark");

  return (
    <section id="kontak" className="px-4 py-14 sm:py-20">
      <ScrollScale className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-5 py-16 text-center text-white dark:border dark:border-white/10 dark:bg-white/5 dark:text-foreground sm:rounded-[2.5rem] sm:px-6 sm:py-24">
        {image ? (
          <>
            <Image
              src={image}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,135,221,0.4),transparent_60%)]"
          />
        )}
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-background/70 dark:text-foreground/70">
            {t("description")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WaLink
              data-marketing-action
              source="cta-home"
              href="https://wa.me/6281234567890"
              className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground dark:text-background transition-[transform,opacity] duration-200 hover:scale-[1.02] hover:opacity-90 motion-reduce:transition-none sm:w-auto"
            >
              {t("ctaWhatsApp")}
              <MessageCircle
                className="size-4 transition-transform duration-200 group-hover:rotate-6 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </WaLink>
            <a
              data-marketing-action
              href="mailto:hello@gizencreative.com"
              className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-background dark:text-foreground transition-[transform,border-color] duration-200 hover:scale-[1.02] hover:border-white/60 motion-reduce:transition-none sm:w-auto"
            >
              {t("ctaQuote")}
              <Mail
                className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </ScrollScale>
    </section>
  );
}
