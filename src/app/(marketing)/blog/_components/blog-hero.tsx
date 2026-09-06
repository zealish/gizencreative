import { useTranslations } from "next-intl";

export function BlogHero() {
  const t = useTranslations("blog.hero");

  return (
    <section className="px-4 pb-10 pt-28 text-center sm:pb-12 sm:pt-36">
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
      </div>
    </section>
  );
}
