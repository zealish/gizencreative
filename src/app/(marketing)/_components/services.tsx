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

function ServiceVisual({ service }: { service: Service }) {
  const t = useTranslations("services");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/40">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
          {t(`items.${service.id}.eyebrow`)}
        </span>
        <span className="rounded-md bg-accent-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
          {t("included")}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {service.featureKeys.map((key) => (
          <li
            key={key}
            className="flex items-center gap-3 rounded-xl border border-black/5 bg-background px-4 py-3 text-sm font-medium dark:border-white/10"
          >
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-bold text-accent"
              aria-hidden="true"
            >
              ✓
            </span>
            {t(`items.${service.id}.features.${key}`)}
          </li>
        ))}
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
