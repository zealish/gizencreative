export type Service = "website" | "social" | "seo";

// Text lives in messages under the `pricing` namespace; this file only holds
// prices (IDR, locale-independent), numbers, feature flags, and message keys.

export type Plan = {
  /** Message key under `pricing.plans`, e.g. "website.basic" */
  key: string;
  /** Price in IDR; omitted => custom pricing (resolved via `pricing.plans.customPrice`) */
  price?: string;
  originalPrice?: string;
  discountPercent?: number;
  featured?: boolean;
};

export const serviceOptions: Service[] = ["website", "social", "seo"];

export const plansByService: Record<Service, Plan[]> = {
  website: [
    { key: "website.basic", price: "Rp 2,5jt" },
    {
      key: "website.professional",
      price: "Rp 5jt",
      originalPrice: "Rp 7,5jt",
      discountPercent: 33,
      featured: true,
    },
    {
      key: "website.corporate",
      price: "Rp 9jt",
      originalPrice: "Rp 14jt",
      discountPercent: 35,
    },
  ],
  social: [
    { key: "social.standard", price: "Rp 1,5jt" },
    {
      key: "social.professional",
      price: "Rp 3jt",
      originalPrice: "Rp 4,5jt",
      discountPercent: 33,
      featured: true,
    },
  ],
  seo: [
    { key: "seo.starter", price: "Rp 2jt" },
    {
      key: "seo.growth",
      price: "Rp 3,5jt",
      originalPrice: "Rp 5jt",
      discountPercent: 30,
      featured: true,
    },
    {
      key: "seo.business",
      price: "Rp 6jt",
      originalPrice: "Rp 8,5jt",
      discountPercent: 29,
    },
    { key: "seo.enterprise" },
  ],
};

export type CompareValue =
  | boolean
  /** Locale-independent literal (numbers, counts) */
  | { text: string }
  /** Translated value, resolved via `pricing.compare.values.<key>` */
  | { textKey: "unlimited" | "custom" };

export type CompareColumn = {
  /** Message key under `pricing.compare.<service>.columns` */
  key: string;
  /** Price in IDR; omitted => custom pricing */
  price?: string;
  /** Render price with the per-month suffix */
  monthly?: boolean;
};

export type CompareTable = {
  columns: CompareColumn[];
  /** Row `key` resolves via `pricing.compare.<service>.rows.<key>` */
  rows: { key: string; values: CompareValue[] }[];
};

export const compareByService: Record<Service, CompareTable> = {
  website: {
    columns: [
      { key: "basic", price: "Rp 2,5jt" },
      { key: "professional", price: "Rp 5jt" },
      { key: "corporate", price: "Rp 9jt" },
    ],
    rows: [
      {
        key: "pages",
        values: [{ text: "1–3" }, { text: "10" }, { textKey: "unlimited" }],
      },
      { key: "responsive", values: [true, true, true] },
      { key: "customDesign", values: [false, false, true] },
      { key: "cms", values: [false, true, true] },
      { key: "onPageSeo", values: [false, true, true] },
      { key: "copywriting", values: [false, true, true] },
      { key: "multiLanguage", values: [false, false, true] },
      { key: "integrations", values: [false, false, true] },
      { key: "domainHosting", values: [true, true, true] },
      {
        key: "revisions",
        values: [
          { text: "2x" },
          { textKey: "unlimited" },
          { textKey: "unlimited" },
        ],
      },
      { key: "prioritySupport", values: [false, false, true] },
    ],
  },
  social: {
    columns: [
      { key: "standard", price: "Rp 1,5jt", monthly: true },
      { key: "professional", price: "Rp 3jt", monthly: true },
    ],
    rows: [
      { key: "feedContent", values: [{ text: "12" }, { text: "20" }] },
      { key: "reels", values: [false, { text: "4" }] },
      { key: "copywriting", values: [true, true] },
      { key: "calendar", values: [true, true] },
      { key: "engagement", values: [false, true] },
      { key: "ads", values: [false, true] },
      { key: "report", values: [true, true] },
    ],
  },
  seo: {
    columns: [
      { key: "starter", price: "Rp 2jt", monthly: true },
      { key: "growth", price: "Rp 3,5jt", monthly: true },
      { key: "business", price: "Rp 6jt", monthly: true },
      { key: "enterprise" },
    ],
    rows: [
      {
        key: "keywords",
        values: [
          { text: "5" },
          { text: "15" },
          { text: "30" },
          { textKey: "unlimited" },
        ],
      },
      { key: "onPageSeo", values: [true, true, true, true] },
      { key: "offPageSeo", values: [false, true, true, true] },
      {
        key: "articles",
        values: [
          { text: "2" },
          { text: "4" },
          { text: "8" },
          { textKey: "custom" },
        ],
      },
      { key: "backlinks", values: [false, true, true, true] },
      { key: "audit", values: [false, false, true, true] },
      { key: "specialist", values: [false, false, false, true] },
      { key: "rankingReport", values: [true, true, true, true] },
      { key: "prioritySupport", values: [false, false, false, true] },
    ],
  },
};
