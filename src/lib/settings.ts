import { eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { siteSetting } from "@/lib/db/schema";

export const ANALYTICS_KEYS = [
  "gaMeasurementId",
  "gaPropertyId",
  "gtmId",
  "googleSiteVerification",
] as const;

export const SEO_META_KEYS = [
  "metaTitle",
  "metaDescription",
  "metaKeywords",
  "ogImage",
] as const;

export const SEO_SETTING_KEYS = [...ANALYTICS_KEYS, ...SEO_META_KEYS] as const;

export type SeoSettingKey = (typeof SEO_SETTING_KEYS)[number];

export type AnalyticsKey = (typeof ANALYTICS_KEYS)[number];

export const ANALYTICS_ENV_FALLBACKS: Record<AnalyticsKey, string | undefined> =
  {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    gaPropertyId: process.env.GA_PROPERTY_ID,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  };

export const getSeoOverrides = unstable_cache(
  async (): Promise<Partial<Record<SeoSettingKey, string>>> => {
    try {
      const rows = await db
        .select()
        .from(siteSetting)
        .where(inArray(siteSetting.key, [...SEO_SETTING_KEYS]));
      return Object.fromEntries(rows.map((row) => [row.key, row.value]));
    } catch {
      return {};
    }
  },
  ["seo-settings"],
  { tags: ["site-settings"] },
);

export const GENERAL_SETTING_KEYS = [
  "siteName",
  "siteTagline",
  "contactEmail",
  "contactPhone",
  "address",
] as const;

export type GeneralSettingKey = (typeof GENERAL_SETTING_KEYS)[number];

export const getGeneralSettings = unstable_cache(
  async (): Promise<Partial<Record<GeneralSettingKey, string>>> => {
    try {
      const rows = await db
        .select()
        .from(siteSetting)
        .where(inArray(siteSetting.key, [...GENERAL_SETTING_KEYS]));
      return Object.fromEntries(rows.map((row) => [row.key, row.value]));
    } catch {
      return {};
    }
  },
  ["general-settings"],
  { tags: ["site-settings"] },
);

export const GA_SERVICE_ACCOUNT_KEY = "gaServiceAccount";

export type GaServiceAccountInfo = {
  clientEmail: string;
  projectId?: string;
  updatedAt: string;
};

export const getGaServiceAccountInfo = unstable_cache(
  async (): Promise<GaServiceAccountInfo | null> => {
    try {
      const [row] = await db
        .select()
        .from(siteSetting)
        .where(eq(siteSetting.key, GA_SERVICE_ACCOUNT_KEY));
      if (!row?.value) return null;
      const creds = JSON.parse(row.value) as {
        client_email?: string;
        project_id?: string;
      };
      if (!creds.client_email) return null;
      return {
        clientEmail: creds.client_email,
        projectId: creds.project_id,
        updatedAt: row.updatedAt.toISOString(),
      };
    } catch {
      return null;
    }
  },
  ["ga-service-account"],
  { tags: ["site-settings"] },
);

export type GaServiceAccountCredentials = {
  clientEmail: string;
  privateKey: string;
};

export const getGaServiceAccountCredentials = unstable_cache(
  async (): Promise<GaServiceAccountCredentials | null> => {
    try {
      const [row] = await db
        .select()
        .from(siteSetting)
        .where(eq(siteSetting.key, GA_SERVICE_ACCOUNT_KEY));
      if (!row?.value) return null;
      const creds = JSON.parse(row.value) as {
        client_email?: string;
        private_key?: string;
      };
      if (!creds.client_email || !creds.private_key) return null;
      return { clientEmail: creds.client_email, privateKey: creds.private_key };
    } catch {
      return null;
    }
  },
  ["ga-service-account-creds"],
  { tags: ["site-settings"] },
);

export const MARKETING_SEO_PAGES = [
  "/",
  "/about",
  "/services/website-development",
  "/services/social-media-management",
  "/services/seo-website",
  "/portfolio",
  "/pricing",
  "/blog",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
] as const;

export type MarketingSeoPage = (typeof MARKETING_SEO_PAGES)[number];

export type PageSeo = {
  title?: string;
  description?: string;
};

export const PAGE_SEO_PREFIX = "pageSeo:";

export const getPageSeoOverrides = unstable_cache(
  async (): Promise<Partial<Record<MarketingSeoPage, PageSeo>>> => {
    try {
      const keys = MARKETING_SEO_PAGES.map((page) => PAGE_SEO_PREFIX + page);
      const rows = await db
        .select()
        .from(siteSetting)
        .where(inArray(siteSetting.key, keys));
      const result: Partial<Record<MarketingSeoPage, PageSeo>> = {};
      for (const row of rows) {
        try {
          const page = row.key.slice(
            PAGE_SEO_PREFIX.length,
          ) as MarketingSeoPage;
          result[page] = JSON.parse(row.value) as PageSeo;
        } catch {
          // skip malformed entries
        }
      }
      return result;
    } catch {
      return {};
    }
  },
  ["page-seo"],
  { tags: ["site-settings"] },
);

export async function getPageSeo(page: MarketingSeoPage): Promise<PageSeo> {
  const overrides = await getPageSeoOverrides();
  return overrides[page] ?? {};
}

export async function getAnalyticsSettings(): Promise<
  Record<AnalyticsKey, string | undefined>
> {
  const overrides = await getSeoOverrides();
  return {
    gaMeasurementId:
      overrides.gaMeasurementId || ANALYTICS_ENV_FALLBACKS.gaMeasurementId,
    gaPropertyId:
      overrides.gaPropertyId || ANALYTICS_ENV_FALLBACKS.gaPropertyId,
    gtmId: overrides.gtmId || ANALYTICS_ENV_FALLBACKS.gtmId,
    googleSiteVerification:
      overrides.googleSiteVerification ||
      ANALYTICS_ENV_FALLBACKS.googleSiteVerification,
  };
}

export const SITE_LOGO_KEY = "siteLogo";

export const getSiteLogo = unstable_cache(
  async (): Promise<string | null> => {
    const rows = await db
      .select({ value: siteSetting.value })
      .from(siteSetting)
      .where(eq(siteSetting.key, SITE_LOGO_KEY));
    return rows[0]?.value || null;
  },
  ["site-logo"],
  { tags: ["site-settings"] },
);

export const USE_CASE_IDS = ["website", "socialMedia", "seo"] as const;

export type UseCaseId = (typeof USE_CASE_IDS)[number];

export const USE_CASE_IMAGE_PREFIX = "useCaseImage:";

export const getUseCaseImages = unstable_cache(
  async (): Promise<Partial<Record<UseCaseId, string>>> => {
    try {
      const keys = USE_CASE_IDS.map((id) => USE_CASE_IMAGE_PREFIX + id);
      const rows = await db
        .select()
        .from(siteSetting)
        .where(inArray(siteSetting.key, keys));
      const result: Partial<Record<UseCaseId, string>> = {};
      for (const row of rows) {
        const id = row.key.slice(USE_CASE_IMAGE_PREFIX.length) as UseCaseId;
        if (row.value) {
          result[id] = row.value;
        }
      }
      return result;
    } catch {
      return {};
    }
  },
  ["use-case-images"],
  { tags: ["site-settings"] },
);

export const STORAGE_PROVIDERS = ["local", "cloudinary", "s3", "r2"] as const;

export type StorageProvider = (typeof STORAGE_PROVIDERS)[number];

export const STORAGE_KEYS = [
  "storageProvider",
  "cloudinaryCloudName",
  "cloudinaryApiKey",
  "cloudinaryApiSecret",
  "cloudinaryFolder",
  "s3Region",
  "s3Bucket",
  "s3AccessKeyId",
  "s3SecretAccessKey",
  "s3Endpoint",
  "s3PublicUrl",
  "r2AccountId",
  "r2Bucket",
  "r2AccessKeyId",
  "r2SecretAccessKey",
  "r2PublicUrl",
] as const;

export type StorageKey = (typeof STORAGE_KEYS)[number];

export const getStorageSettings = unstable_cache(
  async (): Promise<Partial<Record<StorageKey, string>>> => {
    const rows = await db
      .select({ key: siteSetting.key, value: siteSetting.value })
      .from(siteSetting)
      .where(inArray(siteSetting.key, [...STORAGE_KEYS]));
    const result: Partial<Record<StorageKey, string>> = {};
    for (const row of rows) {
      if (row.value) {
        result[row.key as StorageKey] = row.value;
      }
    }
    return result;
  },
  ["storage-settings"],
  { tags: ["site-settings"] },
);

export function getStorageProvider(
  settings: Partial<Record<StorageKey, string>>,
): StorageProvider {
  const value = settings.storageProvider;
  return STORAGE_PROVIDERS.includes(value as StorageProvider)
    ? (value as StorageProvider)
    : "local";
}
