import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ANALYTICS_ENV_FALLBACKS,
  getGaServiceAccountInfo,
  getSeoOverrides,
} from "@/lib/settings";
import {
  removeGaCredentials,
  saveAnalyticsSettings,
  uploadGaCredentials,
} from "./actions";

export const metadata: Metadata = {
  title: "Analytics Settings",
  robots: { index: false, follow: false },
};

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export default async function AnalyticsSettingsPage() {
  const t = await getTranslations("admin.settings.analytics");
  const overrides = await getSeoOverrides();
  const gaCreds = await getGaServiceAccountInfo();

  return (
    <div className="space-y-5">
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("description")}</p>
        <form action={saveAnalyticsSettings} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="gaMeasurementId" className={labelClass}>
              {t("gaMeasurementIdLabel")}
            </label>
            <input
              id="gaMeasurementId"
              name="gaMeasurementId"
              type="text"
              defaultValue={overrides.gaMeasurementId ?? ""}
              placeholder={
                ANALYTICS_ENV_FALLBACKS.gaMeasurementId ?? "G-XXXXXXXXXX"
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="gtmId" className={labelClass}>
              {t("gtmIdLabel")}
            </label>
            <input
              id="gtmId"
              name="gtmId"
              type="text"
              defaultValue={overrides.gtmId ?? ""}
              placeholder={ANALYTICS_ENV_FALLBACKS.gtmId ?? "GTM-XXXXXXX"}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="googleSiteVerification" className={labelClass}>
              {t("googleSiteVerificationLabel")}
            </label>
            <input
              id="googleSiteVerification"
              name="googleSiteVerification"
              type="text"
              defaultValue={overrides.googleSiteVerification ?? ""}
              placeholder={ANALYTICS_ENV_FALLBACKS.googleSiteVerification}
              className={inputClass}
            />
          </div>
          <p className="text-xs text-muted">{t("analyticsFallbackHint")}</p>
          <button
            type="submit"
            className="rounded-full bg-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85"
          >
            {t("save")}
          </button>
        </form>
      </div>
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">
          {t("gaCredsTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted">{t("gaCredsDescription")}</p>
        {gaCreds ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-accent/40 bg-accent-soft/60 px-4 py-3 text-sm dark:bg-accent-soft/40">
              <p className="font-bold">{gaCreds.clientEmail}</p>
              {gaCreds.projectId ? (
                <p className="mt-1 text-xs text-muted">{gaCreds.projectId}</p>
              ) : null}
              <p className="mt-1 text-xs text-muted">
                {t("gaCredsUpdatedAt", {
                  date: new Date(gaCreds.updatedAt).toLocaleString(),
                })}
              </p>
            </div>
            <form action={removeGaCredentials}>
              <button
                type="submit"
                className="rounded-full border border-black/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors hover:border-accent hover:text-accent dark:border-white/20"
              >
                {t("gaCredsRemove")}
              </button>
            </form>
          </div>
        ) : null}
        <form action={uploadGaCredentials} className="mt-6 space-y-4">
          <input
            type="file"
            name="credentials"
            accept="application/json,.json"
            required
            className="block w-full cursor-pointer rounded-2xl border border-dashed border-black/15 bg-background px-4 py-3 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-background dark:border-white/20 dark:bg-white/5"
          />
          <button
            type="submit"
            className="rounded-full bg-foreground px-7 py-3 text-sm font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85"
          >
            {gaCreds ? t("gaCredsReplace") : t("gaCredsUpload")}
          </button>
        </form>
      </div>
    </div>
  );
}
