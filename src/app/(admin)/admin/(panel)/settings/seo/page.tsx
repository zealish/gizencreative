import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getPageSeoOverrides,
  getSeoOverrides,
  MARKETING_SEO_PAGES,
} from "@/lib/settings";
import { savePageSeo, saveSeoSettings } from "./actions";

export const metadata: Metadata = {
  title: "SEO Settings",
  robots: { index: false, follow: false },
};

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const tableInputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export default async function SeoSettingsPage() {
  const t = await getTranslations("admin.settings.seo");
  const overrides = await getSeoOverrides();
  const pageSeo = await getPageSeoOverrides();

  return (
    <div className="space-y-5">
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("description")}</p>
        <form action={saveSeoSettings} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="metaTitle" className={labelClass}>
              {t("metaTitleLabel")}
            </label>
            <input
              id="metaTitle"
              name="metaTitle"
              type="text"
              defaultValue={overrides.metaTitle ?? ""}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="metaDescription" className={labelClass}>
              {t("metaDescriptionLabel")}
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={3}
              defaultValue={overrides.metaDescription ?? ""}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="metaKeywords" className={labelClass}>
              {t("metaKeywordsLabel")}
            </label>
            <input
              id="metaKeywords"
              name="metaKeywords"
              type="text"
              defaultValue={overrides.metaKeywords ?? ""}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ogImage" className={labelClass}>
              {t("ogImageLabel")}
            </label>
            <input
              id="ogImage"
              name="ogImage"
              type="url"
              placeholder="https://"
              defaultValue={overrides.ogImage ?? ""}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-opacity hover:opacity-85"
          >
            {t("save")}
          </button>
        </form>
      </div>
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">{t("pagesTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("pagesDescription")}</p>
        {MARKETING_SEO_PAGES.map((page) => (
          <form key={page} id={`page-seo-${page}`} action={savePageSeo}>
            <input type="hidden" name="page" value={page} />
          </form>
        ))}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/15">
                <th className={`py-3 pr-4 ${labelClass}`}>
                  {t("pagesColumnPage")}
                </th>
                <th className={`py-3 pr-4 ${labelClass}`}>
                  {t("pagesColumnTitle")}
                </th>
                <th className={`py-3 pr-4 ${labelClass}`}>
                  {t("pagesColumnDescription")}
                </th>
                <th className={`py-3 ${labelClass}`}>
                  {t("pagesColumnActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {MARKETING_SEO_PAGES.map((page) => {
                const formId = `page-seo-${page}`;
                const seo = pageSeo[page];
                return (
                  <tr
                    key={page}
                    className="border-b border-black/5 align-top dark:border-white/10"
                  >
                    <td className="py-3 pr-4 font-mono text-xs whitespace-nowrap">
                      {page}
                    </td>
                    <td className="w-[30%] py-3 pr-4">
                      <input
                        type="text"
                        name="title"
                        form={formId}
                        defaultValue={seo?.title ?? ""}
                        placeholder={t("pagesDefaultPlaceholder")}
                        className={tableInputClass}
                      />
                    </td>
                    <td className="w-[45%] py-3 pr-4">
                      <textarea
                        name="description"
                        form={formId}
                        rows={2}
                        defaultValue={seo?.description ?? ""}
                        placeholder={t("pagesDefaultPlaceholder")}
                        className={tableInputClass}
                      />
                    </td>
                    <td className="py-3">
                      <button
                        type="submit"
                        form={formId}
                        className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors hover:border-accent hover:text-accent dark:border-white/20"
                      >
                        {t("pagesSave")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted">{t("pagesHint")}</p>
      </div>
    </div>
  );
}
