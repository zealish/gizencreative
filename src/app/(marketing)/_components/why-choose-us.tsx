import { useTranslations } from "next-intl";

const reasons = [
  {
    id: "team",
    icon: (
      <>
        <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M2 19a7 7 0 0 1 14 0" />
        <path d="M16 5.5a3 3 0 0 1 0 5" />
        <path d="M18.5 13.5A7 7 0 0 1 22 19" />
      </>
    ),
  },
  {
    id: "pricing",
    icon: (
      <>
        <path d="M12.6 2.9 21 11.3a2 2 0 0 1 0 2.8l-6.9 6.9a2 2 0 0 1-2.8 0L2.9 12.6A2 2 0 0 1 2.3 11L3 4.7A2 2 0 0 1 4.7 3l6.4-.7a2 2 0 0 1 1.5.6Z" />
        <circle cx="7.5" cy="7.5" r="1" />
      </>
    ),
  },
  {
    id: "speed",
    icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  },
  {
    id: "support",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="m4.9 4.9 4.3 4.3" />
        <path d="m14.8 14.8 4.3 4.3" />
        <path d="m14.8 9.2 4.3-4.3" />
        <path d="m4.9 19.1 4.3-4.3" />
      </>
    ),
  },
  {
    id: "reports",
    icon: (
      <>
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="M7 14l4-4 3 3 5-6" />
      </>
    ),
  },
  {
    id: "results",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  },
];

export function WhyChooseUs() {
  const t = useTranslations("whyChooseUs");

  return (
    <section id="kenapa-kami" className="px-4 py-14 sm:py-20">
      <p className="text-center text-xs font-bold uppercase tracking-wider text-accent">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-5xl">
        {t("title1")}
        <br />
        <span className="text-foreground/50">{t("title2")}</span>
      </h2>
      <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason) => (
          <div
            key={reason.id}
            className="card-elegant flex flex-col rounded-3xl p-6 sm:p-8"
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent"
              aria-hidden="true"
            >
              <svg
                role="presentation"
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {reason.icon}
              </svg>
            </span>
            <h3 className="mt-5 text-lg font-bold">
              {t(`items.${reason.id}.title`)}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {t(`items.${reason.id}.description`)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href="#kontak"
          className="inline-block rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wide transition-colors hover:border-black/30 dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
