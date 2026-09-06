export const siteConfig = {
  name: "Gizen Creative",
  legalName: "Gizen Creative Digital Service Platform",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gizencreative.com",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  twitterHandle: "@gizencreative",
  ogImage: "/opengraph-image",
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
