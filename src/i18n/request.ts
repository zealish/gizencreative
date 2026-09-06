import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE = "NEXT_LOCALE";

function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

async function resolveLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const deviceLanguages = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase().split("-")[0]);

  for (const language of deviceLanguages) {
    if (isLocale(language)) return language;
  }

  return "en";
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  return {
    locale,
    // dynamic import: message bundle is selected per-request by locale
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
