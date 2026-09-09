import { useTranslations } from "next-intl";

const faqKeys = [
  "whatIs",
  "timeline",
  "selfManage",
  "packages",
  "reports",
  "gettingStarted",
] as const;

export function Faq() {
  const t = useTranslations("faq");

  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
          {t("headingLine1")}
          <br />
          <span className="text-foreground/50">{t("headingLine2")}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-center text-muted">
          {t("subtitle")}
        </p>
        <div className="mt-10 space-y-3 sm:mt-12">
          {faqKeys.map((key) => (
            <details
              key={key}
              className="faq-item group rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:px-6 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold sm:text-base">
                {t(`items.${key}.q`)}
                <span
                  className="faq-icon text-xl font-normal text-muted transition-transform"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="faq-content">
                <p className="pt-3 text-sm leading-relaxed text-muted">
                  {t(`items.${key}.a`)}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
