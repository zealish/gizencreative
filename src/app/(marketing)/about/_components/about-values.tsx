import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

const valueItems = [
  "transparency",
  "quality",
  "partnership",
  "growth",
] as const;

export function AboutValues() {
  const t = useTranslations("about.values");

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueItems.map((item, index) => (
            <Reveal key={item} delay={index * 100}>
              <div className="card-elegant flex h-full flex-col rounded-3xl p-6 sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-lg font-bold text-accent">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">
                  {t(`items.${item}.title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {t(`items.${item}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
