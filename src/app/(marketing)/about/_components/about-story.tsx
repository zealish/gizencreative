import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

const statItems = ["projects", "clients", "years"] as const;

export function AboutStory() {
  const t = useTranslations("about.story");

  return (
    <section id="tentang" className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="card-elegant flex h-full flex-col rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                {t("missionEyebrow")}
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("missionTitle")}
              </h2>
              <p className="mt-4 text-sm text-muted sm:text-base">
                {t("missionBody")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card-elegant flex h-full flex-col rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                {t("visionEyebrow")}
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("visionTitle")}
              </h2>
              <p className="mt-4 text-sm text-muted sm:text-base">
                {t("visionBody")}
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div className="mt-5 grid gap-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:grid-cols-3 sm:p-8">
            {statItems.map((item) => (
              <div key={item} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {t(`stats.${item}.value`)}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t(`stats.${item}.label`)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
