import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Reveal } from "@/components/reveal";
import { WaLink } from "@/components/wa-link";

const channelIcons: Record<string, ReactNode> = {
  whatsapp: <span aria-hidden="true">◌</span>,
  email: <span aria-hidden="true">✉</span>,
  instagram: (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6"
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  ),
};

export function ContactChannels({
  settings,
}: {
  settings: Partial<
    Record<
      "contactEmail" | "contactPhone" | "instagramUrl" | "linkedinUrl",
      string
    >
  >;
}) {
  const t = useTranslations("contact");
  const channels = [
    {
      id: "whatsapp",
      href: settings.contactPhone
        ? `https://wa.me/${settings.contactPhone.replace(/[^\d]/g, "")}`
        : "",
    },
    {
      id: "email",
      href: settings.contactEmail ? `mailto:${settings.contactEmail}` : "",
    },
    { id: "instagram", href: settings.instagramUrl ?? "" },
    { id: "linkedin", href: settings.linkedinUrl ?? "" },
  ]
    .map((channel) => ({ ...channel, icon: channelIcons[channel.id] }))
    .filter((channel) => channel.href);
  const infoItems = ["hours", "response", "consult"] as const;

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, index) => {
            const isExternal = channel.href.startsWith("http");
            const linkProps = {
              href: channel.href,
              target: isExternal ? "_blank" : undefined,
              rel: isExternal ? "noopener noreferrer" : undefined,
              className:
                "card-elegant marketing-action flex h-full flex-col rounded-3xl p-6 sm:p-8",
            };
            const content = (
              <>
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
              </>
            );
            return (
              <Reveal key={channel.id} delay={index * 100}>
                {channel.id === "whatsapp" ? (
                  <WaLink source="contact-channel" {...linkProps}>
                    {content}
                  </WaLink>
                ) : (
                  <a {...linkProps}>{content}</a>
                )}
              </Reveal>
            );
          })}
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
