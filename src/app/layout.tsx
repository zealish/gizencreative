import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { JsonLd } from "@/components/json-ld";
import { SmoothScroll } from "@/components/smooth-scroll";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { parseKeywords } from "@/lib/seo/page-metadata";
import { siteConfig } from "@/lib/seo/site-config";
import { getAnalyticsSettings, getSeoOverrides } from "@/lib/settings";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const locale = await getLocale();
  const analytics = await getAnalyticsSettings();
  const seo = await getSeoOverrides();
  const ogImage = seo.ogImage || siteConfig.ogImage;
  const title = seo.metaTitle || t("title");
  const description = seo.metaDescription || t("description");
  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: parseKeywords(seo.metaKeywords),
    applicationName: siteConfig.name,
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "48x48" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: "/",
      locale: locale === "id" ? "id_ID" : "en_US",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: analytics.googleSiteVerification
      ? { google: analytics.googleSiteVerification }
      : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const analytics = await getAnalyticsSettings();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${figtree.variable} h-full antialiased`}
    >
      {analytics.gtmId ? <GoogleTagManager gtmId={analytics.gtmId} /> : null}
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: theme init before paint
          dangerouslySetInnerHTML={{
            __html: `try{const theme=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",theme==="dark")}catch{}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SmoothScroll />
        <NextIntlClientProvider>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
      {analytics.gaMeasurementId ? (
        <GoogleAnalytics gaId={analytics.gaMeasurementId} />
      ) : null}
    </html>
  );
}
