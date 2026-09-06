import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

const stepKeys = ["audit", "planning", "production", "reporting"] as const;

export function SmmProcess() {
  const t = useTranslations("socialMediaManagement.process");

  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {t("title1")}
            <br />
            <span className="text-foreground/50">{t("title2")}</span>
          </h2>
        </div>
        <ol className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key, index) => (
            <Reveal key={key} delay={index * 100} className="h-full">
              <li className="card-elegant h-full rounded-3xl p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-bold">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {t(`steps.${key}.description`)}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
