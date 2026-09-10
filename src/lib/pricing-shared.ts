export const pricingServices = ["website", "social", "seo"] as const;
export const pricingSeoTiers = ["standard", "professional"] as const;

export type PricingService = (typeof pricingServices)[number];
export type PricingSeoTier = (typeof pricingSeoTiers)[number];

export type PricingPlanView = {
  id: string;
  service: PricingService;
  seoTier: PricingSeoTier | null;
  name: string;
  description: string;
  unit: string;
  features: string[];
  price: string | null;
  originalPrice: string | null;
  discountPercent: number | null;
  featured: boolean;
};
