import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getSiteLogo } from "@/lib/settings";
import { removeSiteLogo, uploadSiteLogo } from "./actions";

export const metadata: Metadata = {
  title: "General Settings",
  robots: { index: false, follow: false },
};

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export default async function GeneralSettingsPage() {
  const t = await getTranslations("admin.settings.general");
  const logo = await getSiteLogo();

  return (
    <div className="space-y-5">
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">{t("logoTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("logoDescription")}</p>
        {logo ? (
          <div className="mt-6 space-y-4">
            <div className="inline-flex rounded-xl border border-black/10 bg-background p-4 dark:border-white/15 dark:bg-white/5">
              <Image
                src={logo}
                alt="Site logo"
                width={160}
                height={64}
                className="h-16 w-auto object-contain"
                unoptimized
              />
            </div>
            <form action={removeSiteLogo}>
              <button
                type="submit"
                className="rounded-full border border-black/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors hover:border-accent hover:text-accent dark:border-white/20"
              >
                {t("logoRemove")}
              </button>
            </form>
          </div>
        ) : null}
        <form action={uploadSiteLogo} className="mt-6 space-y-4">
          <input
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            required
            className="block w-full cursor-pointer rounded-2xl border border-dashed border-black/15 bg-background px-4 py-3 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-background dark:border-white/20 dark:bg-white/5"
          />
          <p className="text-xs text-muted">{t("logoHint")}</p>
          <button
            type="submit"
            className="rounded-full bg-foreground px-7 py-3 text-sm font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85"
          >
            {logo ? t("logoReplace") : t("logoUpload")}
          </button>
        </form>
      </div>
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("description")}</p>
        <form className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="siteName" className={labelClass}>
              {t("siteNameLabel")}
            </label>
            <input
              id="siteName"
              name="siteName"
              type="text"
              placeholder="Gizen Creative"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="siteTagline" className={labelClass}>
              {t("siteTaglineLabel")}
            </label>
            <input
              id="siteTagline"
              name="siteTagline"
              type="text"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contactEmail" className={labelClass}>
              {t("contactEmailLabel")}
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              placeholder="hello@gizencreative.com"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contactPhone" className={labelClass}>
              {t("contactPhoneLabel")}
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="address" className={labelClass}>
              {t("addressLabel")}
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled
            className="rounded-full bg-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
}
