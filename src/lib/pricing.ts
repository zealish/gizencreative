import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { pricingPlan } from "@/lib/db/schema";
import type {
  PricingPlanView,
  PricingSeoTier,
  PricingService,
} from "@/lib/pricing-shared";

export type PricingPlanRecord = typeof pricingPlan.$inferSelect;

export function toPricingPlanView(
  record: PricingPlanRecord,
  locale: string,
): PricingPlanView {
  const useId = locale === "id";
  return {
    id: record.id,
    service: record.service as PricingService,
    seoTier: record.seoTier as PricingSeoTier | null,
    name: useId ? record.nameId : record.nameEn,
    description: useId ? record.descriptionId : record.descriptionEn,
    unit: useId ? record.unitId : record.unitEn,
    features: useId ? record.featuresId : record.featuresEn,
    price: record.price,
    originalPrice: record.originalPrice,
    discountPercent: record.discountPercent,
    featured: record.featured,
  };
}

const cached = unstable_cache(
  async () =>
    db
      .select()
      .from(pricingPlan)
      .where(eq(pricingPlan.published, true))
      .orderBy(asc(pricingPlan.sortOrder), asc(pricingPlan.createdAt)),
  ["published-pricing"],
  { tags: ["pricing"] },
);

export async function getPublishedPricingPlans(): Promise<PricingPlanRecord[]> {
  return cached();
}

export async function getAllPricingPlansForAdmin(): Promise<
  PricingPlanRecord[]
> {
  return db
    .select()
    .from(pricingPlan)
    .orderBy(asc(pricingPlan.service), asc(pricingPlan.sortOrder));
}

export async function getPricingPlanById(
  id: string,
): Promise<PricingPlanRecord | null> {
  const rows = await db
    .select()
    .from(pricingPlan)
    .where(eq(pricingPlan.id, id))
    .limit(1);
  return rows[0] ?? null;
}
