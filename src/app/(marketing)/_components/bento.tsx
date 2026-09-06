import { useTranslations } from "next-intl";

export function Bento() {
  const t = useTranslations("bento");

  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
          {t("heading")}
        </h2>
        <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-3">
          {/* Big dark card */}
          <div className="relative flex min-h-64 flex-col justify-end overflow-hidden rounded-3xl bg-foreground p-6 text-background shadow-[0_1px_2px_rgba(22,24,26,0.06),0_16px_40px_-12px_rgba(22,24,26,0.25)] dark:border dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] sm:min-h-72 sm:p-8 lg:col-span-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(16,165,107,0.35),transparent_55%)]"
            />
            <span className="relative w-fit rounded-full bg-accent/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              {t("custom.badge")}
            </span>
            <h3 className="relative mt-4 text-2xl font-bold">
              {t("custom.title")}
            </h3>
            <p className="relative mt-2 max-w-md text-sm text-background/70 dark:text-foreground/70">
              {t("custom.description")}
            </p>
          </div>
          {/* Stats card */}
          <div className="card-elegant flex flex-col justify-between gap-6 rounded-3xl p-6 sm:p-8">
            {(["projects", "turnaround", "clients"] as const).map((key) => (
              <div
                key={key}
                className="border-b border-black/5 pb-5 dark:border-white/10 last:border-0 last:pb-0"
              >
                <p className="text-3xl font-bold">{t(`stats.${key}.value`)}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  {t(`stats.${key}.label`)}
                </p>
              </div>
            ))}
          </div>
          {/* Process card */}
          <div className="card-elegant rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold">{t("process.title")}</h3>
            <p className="mt-2 text-sm text-muted">
              {t("process.description")}
            </p>
            <ol className="mt-6 space-y-3">
              {(["step1", "step2", "step3"] as const).map((key, i) => (
                <li
                  key={key}
                  className="flex items-center gap-3 rounded-xl border border-transparent bg-background px-4 py-3 text-sm font-medium first:border-accent/40 first:bg-accent-soft/60 dark:bg-white/5 dark:first:border-accent/40 dark:first:bg-accent-soft/40"
                >
                  <span className="text-xs font-bold text-accent">
                    0{i + 1}
                  </span>
                  <span
                    className="h-4 w-px bg-black/10 dark:bg-white/15"
                    aria-hidden="true"
                  />
                  <span className="flex-1">{t(`process.${key}`)}</span>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      i === 0 ? "bg-accent" : "bg-accent/25"
                    }`}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ol>
          </div>
          {/* Lead card */}
          <div className="card-elegant rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold">{t("lead.title")}</h3>
            <p className="mt-2 text-sm text-muted">{t("lead.description")}</p>
            <div className="mt-6 rounded-2xl border border-black/5 bg-background p-4 dark:border-white/10">
              <div className="flex items-center justify-between rounded-full bg-white px-4 py-3 shadow-sm dark:bg-white/10 dark:shadow-none">
                <span className="text-sm text-muted">
                  {t("lead.placeholder")}
                </span>
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-background"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["website", "social", "seo", "enterprise"] as const).map(
                  (key) => (
                    <span
                      key={key}
                      className="rounded-full border border-black/10 px-3 py-1 text-[11px] dark:border-white/15 font-semibold text-muted"
                    >
                      {t(`lead.tags.${key}`)}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
          {/* Pricing teaser card */}
          <div className="card-elegant rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold">{t("pricing.title")}</h3>
              <span className="rounded-full border border-accent/30 bg-white px-3 py-1 dark:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-accent">
                {t("pricing.badge")}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              {t("pricing.description")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white/70 p-4 dark:bg-white/5 sm:gap-5 sm:p-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 border-accent text-sm font-bold text-accent sm:h-16 sm:w-16">
                {t("pricing.count")}
              </span>
              <div className="min-w-0 flex-1 space-y-1 text-sm">
                <p className="flex justify-between gap-4 sm:gap-8">
                  <span className="text-muted">
                    {t("pricing.categoryLabel")}
                  </span>
                  <span className="font-semibold">
                    {t("pricing.categoryValue")}
                  </span>
                </p>
                <p className="flex justify-between gap-4 sm:gap-8">
                  <span className="text-muted">{t("pricing.priceLabel")}</span>
                  <span className="font-semibold text-accent">
                    {t("pricing.priceValue")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
