import { useTranslations } from "next-intl";

const techLogos = [
  "Next.js",
  "WordPress",
  "Shopify",
  "Instagram",
  "TikTok",
  "Google Ads",
  "Meta Ads",
  "Analytics",
];

export function TechMarquee() {
  const t = useTranslations("techMarquee");

  return (
    <section className="px-4 pb-20">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-muted">
        {t("heading")}
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max gap-4">
          {[...techLogos, ...techLogos, ...techLogos, ...techLogos].map(
            (logo, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: duplicated marquee items
                key={`${logo}-${i}`}
                className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-5 py-2.5 text-sm font-semibold text-foreground/80 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none"
              >
                <span
                  className="h-2 w-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {logo}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
