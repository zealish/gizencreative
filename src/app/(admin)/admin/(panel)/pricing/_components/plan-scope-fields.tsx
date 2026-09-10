"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  type PricingSeoTier,
  type PricingService,
  pricingSeoTiers,
  pricingServices,
} from "@/lib/pricing-shared";

const inputClass =
  "w-full cursor-pointer rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export function PlanScopeFields({
  defaultService = "website",
  defaultSeoTier = "standard",
}: {
  defaultService?: PricingService;
  defaultSeoTier?: PricingSeoTier;
}) {
  const t = useTranslations("pricingAdmin");
  const [service, setService] = useState<PricingService>(defaultService);

  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="service" className={labelClass}>
          {t("service")}
        </label>
        <select
          id="service"
          name="service"
          value={service}
          onChange={(event) => setService(event.target.value as PricingService)}
          className={inputClass}
        >
          {pricingServices.map((option) => (
            <option key={option} value={option}>
              {t(`services.${option}`)}
            </option>
          ))}
        </select>
      </div>
      {service === "seo" ? (
        <div className="space-y-1.5">
          <label htmlFor="seoTier" className={labelClass}>
            {t("seoTier")}
          </label>
          <select
            id="seoTier"
            name="seoTier"
            defaultValue={defaultSeoTier}
            className={inputClass}
          >
            {pricingSeoTiers.map((option) => (
              <option key={option} value={option}>
                {t(`seoTiers.${option}`)}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </>
  );
}
