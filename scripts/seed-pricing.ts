import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "../src/lib/db";
import { pricingPlan } from "../src/lib/db/schema";

type PlanMessages = {
  name: string;
  description: string;
  unit: string;
  features: string[];
};

type Messages = {
  pricing: {
    plans: Record<string, Record<string, PlanMessages>>;
  };
};

type SeedPlan = {
  service: "website" | "social" | "seo";
  seoTier: "standard" | "professional" | null;
  messageGroup: string;
  messageKey: string;
  price: string | null;
  originalPrice: string | null;
  discountPercent: number | null;
  featured: boolean;
};

const seedPlans: SeedPlan[] = [
  {
    service: "website",
    seoTier: null,
    messageGroup: "website",
    messageKey: "basic",
    price: "Rp 2,5jt",
    originalPrice: null,
    discountPercent: null,
    featured: false,
  },
  {
    service: "website",
    seoTier: null,
    messageGroup: "website",
    messageKey: "professional",
    price: "Rp 5jt",
    originalPrice: "Rp 7,5jt",
    discountPercent: 33,
    featured: true,
  },
  {
    service: "website",
    seoTier: null,
    messageGroup: "website",
    messageKey: "corporate",
    price: "Rp 9jt",
    originalPrice: "Rp 14jt",
    discountPercent: 35,
    featured: false,
  },
  {
    service: "social",
    seoTier: null,
    messageGroup: "social",
    messageKey: "standard",
    price: "Rp 1,5jt",
    originalPrice: null,
    discountPercent: null,
    featured: false,
  },
  {
    service: "social",
    seoTier: null,
    messageGroup: "social",
    messageKey: "professional",
    price: "Rp 3jt",
    originalPrice: "Rp 4,5jt",
    discountPercent: 33,
    featured: true,
  },
  {
    service: "seo",
    seoTier: "standard",
    messageGroup: "seo",
    messageKey: "starter",
    price: "Rp 2jt",
    originalPrice: null,
    discountPercent: null,
    featured: false,
  },
  {
    service: "seo",
    seoTier: "standard",
    messageGroup: "seo",
    messageKey: "growth",
    price: "Rp 3,5jt",
    originalPrice: "Rp 5jt",
    discountPercent: 30,
    featured: true,
  },
  {
    service: "seo",
    seoTier: "professional",
    messageGroup: "seo",
    messageKey: "business",
    price: "Rp 6jt",
    originalPrice: "Rp 8,5jt",
    discountPercent: 29,
    featured: true,
  },
  {
    service: "seo",
    seoTier: "professional",
    messageGroup: "seo",
    messageKey: "enterprise",
    price: null,
    originalPrice: null,
    discountPercent: null,
    featured: false,
  },
];

function loadMessages(locale: string): Messages {
  const file = path.join(process.cwd(), "messages", `${locale}.json`);
  return JSON.parse(readFileSync(file, "utf8")) as Messages;
}

async function main() {
  const id = loadMessages("id");
  const en = loadMessages("en");

  const rows = seedPlans.map((plan, index) => {
    const textId = id.pricing.plans[plan.messageGroup][plan.messageKey];
    const textEn = en.pricing.plans[plan.messageGroup][plan.messageKey];
    return {
      id: randomUUID(),
      service: plan.service,
      seoTier: plan.seoTier,
      nameId: textId.name,
      nameEn: textEn.name,
      descriptionId: textId.description,
      descriptionEn: textEn.description,
      unitId: textId.unit,
      unitEn: textEn.unit,
      featuresId: textId.features,
      featuresEn: textEn.features,
      price: plan.price,
      originalPrice: plan.originalPrice,
      discountPercent: plan.discountPercent,
      featured: plan.featured,
      sortOrder: index,
      published: true,
    };
  });

  await db.delete(pricingPlan);
  await db.insert(pricingPlan).values(rows);
  console.log(`Seeded ${rows.length} pricing plans.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
