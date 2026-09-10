import { getTranslations } from "next-intl/server";
import type { PricingPlanRecord } from "@/lib/pricing";
import type { PricingSeoTier, PricingService } from "@/lib/pricing-shared";
import { FeaturesInput } from "./features-input";
import { PlanScopeFields } from "./plan-scope-fields";

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export async function PricingForm({
  action,
  plan,
}: {
  action: (data: FormData) => Promise<void>;
  plan?: PricingPlanRecord;
}) {
  const t = await getTranslations("pricingAdmin");

  return (
    <form action={action} className="space-y-5">
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <PlanScopeFields
          defaultService={plan?.service as PricingService | undefined}
          defaultSeoTier={(plan?.seoTier as PricingSeoTier | null) ?? undefined}
        />
        {(
          [
            "nameId",
            "nameEn",
            "descriptionId",
            "descriptionEn",
            "unitId",
            "unitEn",
          ] as const
        ).map((name) => (
          <div key={name} className="space-y-1.5">
            <label htmlFor={name} className={labelClass}>
              {t(name)}
            </label>
            <input
              id={name}
              name={name}
              type="text"
              required
              maxLength={name.startsWith("description") ? 500 : 200}
              defaultValue={plan?.[name]}
              className={inputClass}
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <label htmlFor="price" className={labelClass}>
            {t("price")}
          </label>
          <input
            id="price"
            name="price"
            type="text"
            maxLength={50}
            placeholder="Rp 2,5jt"
            defaultValue={plan?.price ?? ""}
            className={inputClass}
          />
          <p className="text-xs text-muted">{t("priceHint")}</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="originalPrice" className={labelClass}>
            {t("originalPrice")}
          </label>
          <input
            id="originalPrice"
            name="originalPrice"
            type="text"
            maxLength={50}
            placeholder="Rp 7,5jt"
            defaultValue={plan?.originalPrice ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="discountPercent" className={labelClass}>
            {t("discountPercent")}
          </label>
          <input
            id="discountPercent"
            name="discountPercent"
            type="number"
            min={1}
            max={99}
            defaultValue={plan?.discountPercent ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="sortOrder" className={labelClass}>
            {t("sortOrder")}
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            max={999}
            defaultValue={plan?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
      </div>
      {(["featuresId", "featuresEn"] as const).map((name) => (
        <div key={name} className="space-y-1.5">
          <span className={labelClass}>{t(name)}</span>
          <FeaturesInput name={name} defaultValue={plan?.[name]} />
        </div>
      ))}
      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={plan?.featured ?? false}
          className="size-4 cursor-pointer accent-foreground"
        />
        {t("featured")}
      </label>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <input
          name="published"
          type="checkbox"
          defaultChecked={plan?.published ?? false}
          className="size-4 cursor-pointer accent-foreground"
        />
        {t("published")}
      </label>
      <button
        type="submit"
        className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
      >
        {plan ? t("save") : t("createButton")}
      </button>
    </form>
  );
}
