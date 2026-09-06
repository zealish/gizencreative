import { useTranslations } from "next-intl";

import { ScrollScale } from "@/components/scroll-scale";

export function PortfolioCta() {
  const t = useTranslations("portfolio.cta");

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
          <p className="mx-auto mt-4 max-w-md text-background/70 dark:text-foreground/70">
            {t("subtitle")}
          </p>
          <a
            href="/#kontak"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-opacity hover:opacity-90 dark:text-background"
          >
            {t("button")} <span aria-hidden="true">→</span>
          </a>
        </div>
      </ScrollScale>
    </section>
  );
}
