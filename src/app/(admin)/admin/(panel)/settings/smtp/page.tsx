import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "SMTP Settings",
  robots: { index: false, follow: false },
};

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export default async function SmtpSettingsPage() {
  const t = await getTranslations("admin.settings.smtp");

  return (
    <div className="card-elegant rounded-3xl p-6 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
      <p className="mt-2 text-sm text-muted">{t("description")}</p>
      <form className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
          <div className="space-y-1.5">
            <label htmlFor="smtpHost" className={labelClass}>
              {t("hostLabel")}
            </label>
            <input
              id="smtpHost"
              name="smtpHost"
              type="text"
              placeholder="smtp.example.com"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="smtpPort" className={labelClass}>
              {t("portLabel")}
            </label>
            <input
              id="smtpPort"
              name="smtpPort"
              type="number"
              placeholder="587"
              className={inputClass}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="smtpUser" className={labelClass}>
            {t("userLabel")}
          </label>
          <input
            id="smtpUser"
            name="smtpUser"
            type="text"
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="smtpPassword" className={labelClass}>
            {t("passwordLabel")}
          </label>
          <input
            id="smtpPassword"
            name="smtpPassword"
            type="password"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="smtpFrom" className={labelClass}>
            {t("fromLabel")}
          </label>
          <input
            id="smtpFrom"
            name="smtpFrom"
            type="email"
            placeholder="no-reply@gizencreative.com"
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            name="smtpSecure"
            className="size-4 rounded border-black/10 accent-[var(--accent,#000)] dark:border-white/15"
          />
          {t("secureLabel")}
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled
            className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {t("save")}
          </button>
          <button
            type="button"
            disabled
            className="rounded-full border border-black/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/5"
          >
            {t("testConnection")}
          </button>
        </div>
      </form>
    </div>
  );
}
