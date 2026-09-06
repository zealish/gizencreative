import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

const offeringItems = [
  {
    key: "auditKeyword",
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
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
        <path d="M8 11h6" />
        <path d="M11 8v6" />
      </svg>
    ),
  },
  {
    key: "contentOnPage",
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    ),
  },
  {
    key: "technicalReport",
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
        <path d="M3 3v18h18" />
        <path d="m7 15 4-4 3 3 5-6" />
      </svg>
    ),
  },
] as const;

export function SeoOfferings() {
  const t = useTranslations("seoWebsite.offerings");

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
