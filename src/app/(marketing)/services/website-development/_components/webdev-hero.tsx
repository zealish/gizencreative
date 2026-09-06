import Link from "next/link";
import { useTranslations } from "next-intl";

const statKeys = ["delivery", "responsive", "hosting"] as const;

export function WebDevHero() {
  const t = useTranslations("websiteDevelopment.hero");

  return (
    <section className="px-4 pb-14 pt-28 text-center sm:pb-16 sm:pt-36">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          {t("title1")}
          <br />
          <span className="text-foreground/50">{t("title2")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:mt-6 sm:text-lg">
          {t("subtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/#kontak"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-accent/25 transition-opacity hover:opacity-90"
          >
            {t("ctaPrimary")} <span aria-hidden="true">→</span>
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors hover:border-black/30 dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
        <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3">
          {statKeys.map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none"
            >
              <dt className="order-last mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                {t(`stats.${key}.label`)}
              </dt>
              <dd className="text-2xl font-bold tracking-tight text-accent">
                {t(`stats.${key}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
