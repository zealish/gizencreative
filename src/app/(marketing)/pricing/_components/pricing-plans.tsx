"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Reveal } from "@/components/reveal";
import {
  type PricingPlanView,
  type PricingSeoTier,
  type PricingService,
  pricingSeoTiers,
  pricingServices,
} from "@/lib/pricing-shared";
import { ComparePlans } from "./compare-plans";
import { compareByService, compareSeoByTier } from "./pricing-data";

const icons: Record<PricingService, React.ReactNode> = {
  website: (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  social: (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="m15.41 6.51-6.82 3.98" />
    </svg>
  ),
  seo: (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
};

export function PricingPlans({ plans }: { plans: PricingPlanView[] }) {
  const t = useTranslations("pricing.plans");
  const [service, setService] = useState<PricingService>("website");
  const [seoTier, setSeoTier] = useState<PricingSeoTier>("standard");
  const visiblePlans = plans.filter((plan) =>
    plan.service === "seo"
      ? service === "seo" && plan.seoTier === seoTier
      : plan.service === service,
  );
  const compareTable =
    service === "seo" ? compareSeoByTier[seoTier] : compareByService[service];

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:pb-20 sm:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--accent-soft)_0%,transparent_60%)]"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="mx-auto w-fit rounded-full bg-accent-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            {t("badge")}
          </p>
          <h1 className="mt-6 text-center text-4xl font-bold tracking-tight sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-muted">
            {t("subtitle")}
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-md flex-wrap justify-center rounded-3xl border border-black/5 bg-white p-1 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:w-fit sm:max-w-none sm:flex-nowrap sm:rounded-full">
            {pricingServices.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setService(opt)}
                className={`marketing-action inline-flex flex-1 items-center justify-center gap-2 sm:flex-none rounded-full px-4 py-2.5 text-xs font-bold uppercase leading-none tracking-wide transition-colors sm:px-5 ${
                  service === opt
                    ? "bg-accent text-white dark:text-background shadow-md shadow-accent/30"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <span className="flex shrink-0 items-center">{icons[opt]}</span>
                <span className="leading-none">{t(`services.${opt}`)}</span>
              </button>
            ))}
          </div>

          {service === "seo" && (
            <div className="mx-auto mt-4 flex w-fit rounded-full border border-black/5 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              {pricingSeoTiers.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSeoTier(tier)}
                  className={`marketing-action rounded-full px-4 py-2 text-xs font-bold uppercase leading-none tracking-wide transition-colors sm:px-5 ${
                    seoTier === tier
                      ? "bg-primary text-white"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {t(`seoTiers.${tier}`)}
                </button>
              ))}
            </div>
          )}

          <div
            className={`mx-auto mt-12 grid gap-5 md:grid-cols-2 ${
              visiblePlans.length >= 4
                ? "lg:grid-cols-4"
                : visiblePlans.length === 3
                  ? "lg:grid-cols-3"
                  : "max-w-3xl"
            }`}
          >
            {visiblePlans.map((plan, index) => (
              <Reveal
                key={plan.id}
                delay={index * 100}
                className={`relative flex flex-col rounded-3xl border p-6 shadow-sm sm:p-7 ${
                  plan.featured
                    ? "border-accent/40 bg-white shadow-xl shadow-accent/10 dark:bg-white/5"
                    : "border-black/5 bg-white dark:border-white/10 dark:bg-white/5"
                }`}
              >
                {plan.discountPercent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white dark:text-background">
                    {t("discountBadge", { percent: plan.discountPercent })}
                  </span>
                )}
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted">{plan.description}</p>
                <p className="mt-5">
                  {plan.originalPrice && (
                    <span className="mr-2 text-lg font-semibold text-muted line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold">
                    {plan.price ?? t("customPrice")}
                  </span>
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  {plan.unit}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span className="mt-0.5 text-accent" aria-hidden="true">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="/#kontak"
                  className={`marketing-action inline-flex items-center justify-center gap-2 mt-7 rounded-full px-5 py-3 text-center text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-85 ${
                    plan.featured
                      ? "bg-accent text-white dark:text-background"
                      : "bg-primary text-white"
                  }`}
                >
                  {t("planCta")}{" "}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:flex-row sm:p-8 sm:text-left">
            <div>
              <h3 className="text-lg font-bold">{t("bundle.title")}</h3>
              <p className="mt-1 max-w-xl text-sm text-muted">
                {t.rich("bundle.description", {
                  strong: (chunks) => (
                    <strong className="text-foreground">{chunks}</strong>
                  ),
                })}
              </p>
            </div>
            <a
              href="/#kontak"
              className="marketing-action inline-flex items-center justify-center gap-2 shrink-0 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-85"
            >
              {t("bundle.cta")}{" "}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </a>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <ComparePlans service={service} table={compareTable} />
      </Reveal>
    </>
  );
}
