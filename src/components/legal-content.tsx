import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

type LegalSection = { heading: string; body: string[] };

export function LegalContent({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const sections: LegalSection[] = t.raw("sections");

  return (
    <section className="px-4 pb-20 pt-36">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-sm text-muted">{t("updated")}</p>
        </Reveal>
        <div className="mt-12 space-y-10">
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={Math.min(index * 60, 300)}>
              <h2 className="text-lg font-bold">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
