import { useTranslations } from "next-intl";

import { HeroParticles } from "./hero-particles";

const avatarColors = [
  "bg-emerald-200",
  "bg-amber-200",
  "bg-sky-200",
  "bg-rose-200",
  "bg-violet-200",
  "bg-lime-200",
  "bg-orange-200",
];

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2ece3] via-[#f5f1ea] to-[#f9fafb] px-4 pb-14 pt-28 text-center sm:pb-16 sm:pt-36 dark:from-[#1a1712] dark:via-[#141311] dark:to-background">
      <HeroParticles />
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:mt-6 sm:text-lg">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#kontak"
            className="w-full max-w-xs rounded-full bg-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85 sm:w-auto"
          >
            {t("ctaPrimary")}
          </a>
          <a
            href="/pricing"
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
          >
            {t("ctaSecondary")}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="mt-10 flex items-center justify-center -space-x-2">
          {avatarColors.map((c, i) => (
            <span
              key={c}
              className={`grid h-9 w-9 place-items-center rounded-full border-2 border-background text-[10px] font-bold text-black/70 ${c}`}
            >
              {String.fromCharCode(65 + i)}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">
          {t("trustedBy")}
        </p>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-sm">
          <span className="text-accent" aria-hidden="true">
            ★★★★★
          </span>
          <span className="font-semibold">{t("rating")}</span>
        </div>
      </div>
    </section>
  );
}
