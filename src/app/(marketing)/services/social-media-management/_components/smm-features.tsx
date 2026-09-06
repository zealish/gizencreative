import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

const featureKeys = [
  "contentStrategy",
  "feed",
  "story",
  "reels",
  "captionHashtag",
  "scheduling",
  "design",
  "report",
] as const;

export function SmmFeatures() {
  const t = useTranslations("socialMediaManagement.features");

  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="card-elegant rounded-3xl p-6 sm:rounded-[2.5rem] sm:p-12">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                {t("eyebrow")}
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                {t("title1")}
                <br />
                <span className="text-foreground/50">{t("title2")}</span>
              </h2>
              <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
                {t("subtitle")}
              </p>
            </div>
            <Reveal>
              <ul className="grid gap-3 sm:grid-cols-2">
                {featureKeys.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2.5 text-sm text-foreground/80"
                  >
                    <span className="text-accent" aria-hidden="true">
                      ✓
                    </span>
                    {t(`items.${key}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
