import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

const offeringItems = [
  {
    key: "landingPage",
    icon: (
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M8 14h8" />
      </svg>
    ),
  },
  {
    key: "companyProfile",
    icon: (
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 10h1M14 10h1M9 14h1M14 14h1" />
      </svg>
    ),
  },
  {
    key: "businessWebsite",
    icon: (
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z" />
      </svg>
    ),
  },
] as const;

export function WebDevOfferings() {
  const t = useTranslations("websiteDevelopment.offerings");

  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {t("title1")}
            <br />
            <span className="text-foreground/50">{t("title2")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-3">
          {offeringItems.map((item, index) => (
            <Reveal key={item.key} delay={index * 100}>
              <div className="card-elegant flex h-full flex-col rounded-3xl p-6 sm:p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {t(`items.${item.key}.description`)}
                </p>
                <p className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {t(`items.${item.key}.bestFor`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
