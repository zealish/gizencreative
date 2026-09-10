"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "gizen-cookie-consent";

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(
      window.localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted",
    );
  }, []);

  const acceptCookies = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-lg sm:inset-x-auto sm:right-6 sm:bottom-6">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-consent-title"
        className="card-elegant rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-background sm:p-7"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {t("eyebrow")}
        </p>
        <h2
          id="cookie-consent-title"
          className="mt-2 text-xl font-bold tracking-tight text-foreground"
        >
          {t("title")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{t("description")}</p>
        <button
          type="button"
          onClick={acceptCookies}
          className="mt-5 w-full cursor-pointer rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-accent/25 transition-opacity hover:opacity-90"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
