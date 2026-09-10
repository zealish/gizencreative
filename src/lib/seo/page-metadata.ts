import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  getPageSeo,
  getSeoOverrides,
  type MarketingSeoPage,
  type PageSeo,
} from "@/lib/settings";
import { siteConfig } from "./site-config";

export function parseKeywords(value?: string): string[] | undefined {
  if (!value) return undefined;
  const keywords = value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  return keywords.length > 0 ? keywords : undefined;
}

type BuildPageMetadataOptions = {
  /** Marketing route registered in the admin panel, used to look up overrides. */
  page?: MarketingSeoPage;
  /** Canonical path; defaults to `page`. */
  canonical?: string;
  title: string;
  description: string;
  openGraph?: Metadata["openGraph"];
};

/**
 * Merges admin panel SEO settings into page metadata:
 * per-page title/description overrides win over the page defaults, and the
 * global keywords/OG image are applied to every marketing page.
 */
export async function buildPageMetadata({
  page,
  canonical = page,
  title: defaultTitle,
  description: defaultDescription,
  openGraph,
}: BuildPageMetadataOptions): Promise<Metadata> {
  const [pageSeo, overrides, locale] = await Promise.all([
    page ? getPageSeo(page) : Promise.resolve<PageSeo>({}),
    getSeoOverrides(),
    getLocale(),
  ]);

  // On the homepage the global defaults win over the i18n fallback, matching
  // the root layout metadata.
  const globalTitle = page === "/" ? overrides.metaTitle : undefined;
  const globalDescription =
    page === "/" ? overrides.metaDescription : undefined;
  const title = pageSeo.title || globalTitle || defaultTitle;
  const description =
    pageSeo.description || globalDescription || defaultDescription;
  const ogImage = overrides.ogImage || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: parseKeywords(overrides.metaKeywords),
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale === "id" ? "id_ID" : "en_US",
      title,
      description,
      ...(canonical ? { url: canonical } : {}),
      images: [{ url: ogImage }],
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
  };
}
