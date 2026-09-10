// Text lives in messages under the `pricing` namespace; this file only holds
// comparison-table structure: prices (IDR, locale-independent), numbers,
// feature flags, and message keys.

export type Service = "website" | "social" | "seo";
export type SeoTier = "standard" | "professional";

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

export const compareByService: Record<Exclude<Service, "seo">, CompareTable> = {
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
};

export const compareSeoByTier: Record<SeoTier, CompareTable> = {
  standard: {
    columns: [
      { key: "starter", price: "Rp 2jt", monthly: true },
      { key: "growth", price: "Rp 3,5jt", monthly: true },
    ],
    rows: [
      { key: "keywords", values: [{ text: "5" }, { text: "15" }] },
      { key: "onPageSeo", values: [true, true] },
      { key: "offPageSeo", values: [false, true] },
      { key: "articles", values: [{ text: "2" }, { text: "4" }] },
      { key: "backlinks", values: [false, true] },
      { key: "audit", values: [false, false] },
      { key: "specialist", values: [false, false] },
      { key: "rankingReport", values: [true, true] },
      { key: "prioritySupport", values: [false, false] },
    ],
  },
  professional: {
    columns: [
      { key: "business", price: "Rp 6jt", monthly: true },
      { key: "enterprise" },
    ],
    rows: [
      {
        key: "keywords",
        values: [{ text: "30" }, { textKey: "unlimited" }],
      },
      { key: "onPageSeo", values: [true, true] },
      { key: "offPageSeo", values: [true, true] },
      { key: "articles", values: [{ text: "8" }, { textKey: "custom" }] },
      { key: "backlinks", values: [true, true] },
      { key: "audit", values: [true, true] },
      { key: "specialist", values: [false, true] },
      { key: "rankingReport", values: [true, true] },
      { key: "prioritySupport", values: [false, true] },
    ],
  },
};
