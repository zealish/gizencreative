import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

export function PricingFaq() {
  const t = useTranslations("pricing.faq");
  const faqs: { q: string; a: string }[] = t.raw("items");

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-muted">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h2>
        <div className="mt-10 space-y-3 sm:mt-12">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delay={Math.min(index * 60, 300)}>
              <details className="faq-item group rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:px-6 sm:py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold sm:text-base">
                  {faq.q}
                  <span
                    className="faq-icon text-xl font-normal text-muted transition-transform"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
