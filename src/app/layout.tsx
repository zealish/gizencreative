import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { SmoothScroll } from "@/components/smooth-scroll";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/seo/site-config";
import { getAnalyticsSettings } from "@/lib/settings";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const locale = await getLocale();
  const analytics = await getAnalyticsSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
    applicationName: siteConfig.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: "/",
      locale: locale === "id" ? "id_ID" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      title: t("title"),
      description: t("description"),
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
      className={`${lato.variable} h-full antialiased`}
    >
      {analytics.gtmId ? <GoogleTagManager gtmId={analytics.gtmId} /> : null}
      <body className="min-h-full flex flex-col">
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: theme init before paint
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==="dark"||(!("theme" in localStorage)&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SmoothScroll />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
      {analytics.gaMeasurementId ? (
        <GoogleAnalytics gaId={analytics.gaMeasurementId} />
      ) : null}
    </html>
  );
}
