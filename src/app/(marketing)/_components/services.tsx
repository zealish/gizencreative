"use client";

import { useTranslations } from "next-intl";

type Service = {
  id: string;
  index: string;
  pillKeys: string[];
  featureKeys: string[];
  reverse?: boolean;
};

const services: Service[] = [
  {
    id: "website",
    index: "01",
    pillKeys: ["responsive", "cms"],
    featureKeys: [
      "companyProfile",
      "landingPage",
      "businessWebsite",
      "contactForm",
      "whatsapp",
      "maps",
      "seo",
    ],
  },
  {
    id: "socialMedia",
    index: "02",
    pillKeys: ["strategy", "report"],
    featureKeys: [
      "strategy",
      "feed",
      "story",
      "reels",
      "caption",
      "scheduling",
      "report",
    ],
    reverse: true,
  },
  {
    id: "seo",
    index: "03",
    pillKeys: ["audit", "keyword", "technical"],
    featureKeys: [
      "audit",
      "keyword",
      "content",
      "onPage",
      "technical",
      "report",
    ],
  },
];

function FeaturePopup({ featureKey, label }: { featureKey: string; label: string }) {
  const visual = {
    companyProfile: "◈",
    landingPage: "↗",
    businessWebsite: "▦",
    contactForm: "✉",
    whatsapp: "◌",
    maps: "⌖",
    seo: "⌕",
    strategy: "✦",
    feed: "▤",
    story: "◉",
    reels: "▶",
    caption: "Aa",
    scheduling: "◷",
    report: "↗",
    audit: "⌕",
    keyword: "#",
    content: "✎",
    onPage: "◎",
    technical: "⚙",
  }[featureKey] ?? "✦";

  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 w-44 -translate-x-1/2 translate-y-2 rounded-2xl border border-accent/20 bg-white p-3 text-center opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:bg-background">
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-lg font-bold text-accent transition-transform duration-300 group-hover:scale-110 group-focus-within:scale-110" aria-hidden="true">
        {visual}
      </span>
      <span className="mt-2 block text-xs font-bold text-foreground">{label}</span>
      <span className="mx-auto mt-2 block h-1 w-8 rounded-full bg-accent" aria-hidden="true" />
    </span>
  );
}

function ServiceVisual({ service }: { service: Service }) {
  const t = useTranslations("services");

  return (
    <div className="relative overflow-visible rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/40">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {t(`items.${service.id}.eyebrow`)}
        </span>
        <span className="rounded-md bg-accent-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
          {t("included")}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {service.featureKeys.map((key) => {
          const label = t(`items.${service.id}.features.${key}`);
          return (
            <li key={key} className="group relative flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-background px-4 py-3 text-sm font-medium transition-transform duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg dark:border-white/10" tabIndex={0}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-bold text-accent" aria-hidden="true">✓</span>
              {label}
              <FeaturePopup featureKey={key} label={label} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ServiceSection({ service }: { service: Service }) {
  const t = useTranslations("services");

  return (
    <div
      className={`grid items-center gap-8 sm:gap-12 lg:grid-cols-2 ${
        service.reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {service.index} — {t(`items.${service.id}.eyebrow`)}
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          {t(`items.${service.id}.title1`)}
          <br />
          {t(`items.${service.id}.title2`)}
        </h2>
        <p className="mt-5 max-w-md text-muted">
          {t(`items.${service.id}.description`)}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {service.pillKeys.map((key) => (
            <span
              key={key}
              className="flex items-center gap-2 text-sm font-medium text-foreground/80"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              {t(`items.${service.id}.pills.${key}`)}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
          <a
            href="#kontak"
            className="rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wide text-white dark:text-background shadow-lg shadow-accent/25 transition-opacity hover:opacity-90"
          >
            {t(`items.${service.id}.cta`)}
          </a>
          <a
            href="#kontak"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
          >
            {t("learnMore")} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <ServiceVisual service={service} />
    </div>
  );
}

export function Services() {
  return (
    <section id="layanan" className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-16 sm:space-y-28">
        {services.map((service) => (
          <ServiceSection key={service.index} service={service} />
        ))}
      </div>
    </section>
  );
}
