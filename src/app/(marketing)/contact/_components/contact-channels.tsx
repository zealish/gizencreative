import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";

const channels: { id: string; href: string; icon: React.ReactNode }[] = [
  {
    id: "whatsapp",
    href: "https://wa.me/6281234567890",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "email",
    href: "mailto:hello@gizencreative.com",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    ),
  },
  {
    id: "instagram",
    href: "https://instagram.com/gizencreative",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37a4 4 0 1 1-7.9 1.17 4 4 0 0 1 7.9-1.17z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    href: "https://linkedin.com/company/gizencreative",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const infoItems = ["hours", "response", "consult"] as const;

export function ContactChannels() {
  const t = useTranslations("contact");

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, index) => (
            <Reveal key={channel.id} delay={index * 100}>
              <a
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  channel.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="card-elegant flex h-full flex-col rounded-3xl p-6 sm:p-8"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  {channel.icon}
                </span>
                <h2 className="mt-5 text-lg font-bold">
                  {t(`channels.${channel.id}.title`)}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {t(`channels.${channel.id}.description`)}
                </p>
                <span className="mt-5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
                  {t(`channels.${channel.id}.action`)}
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-5 grid gap-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:grid-cols-3 sm:p-8">
            {infoItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {t(`info.${item}Title`)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{t(`info.${item}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
