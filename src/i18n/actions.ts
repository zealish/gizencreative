"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "@/i18n/request";

export async function setLocale(locale: Locale) {
  (await cookies()).set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
