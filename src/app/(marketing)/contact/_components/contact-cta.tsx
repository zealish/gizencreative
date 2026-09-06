import { useTranslations } from "next-intl";

import { ScrollScale } from "@/components/scroll-scale";
import { WaLink } from "@/components/wa-link";

export function ContactCta() {
  const t = useTranslations("contact.cta");

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <ScrollScale className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-foreground px-5 py-16 text-center text-background dark:border dark:border-white/10 dark:bg-white/5 dark:text-foreground sm:rounded-[2.5rem] sm:px-6 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,165,107,0.4),transparent_60%)]"
        />
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-background/70 dark:text-foreground/70">
            {t("subtitle")}
          </p>
          <WaLink
            source="cta-contact"
            href="https://wa.me/6281234567890"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground dark:text-background transition-opacity hover:opacity-90"
          >
            {t("button")} <span aria-hidden="true">→</span>
          </WaLink>
        </div>
      </ScrollScale>
    </section>
  );
}
