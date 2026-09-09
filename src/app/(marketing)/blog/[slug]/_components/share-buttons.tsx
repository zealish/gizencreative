"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const networks = [
  {
    name: "WhatsApp",
    buildUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    icon: (
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 2a9.87 9.87 0 0 0-8.41 14.96L2.1 22l5.16-1.5A9.87 9.87 0 1 0 12.05 2" />
    ),
  },
  {
    name: "Facebook",
    buildUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
    ),
  },
  {
    name: "X",
    buildUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zM17.61 20.64h2.04L6.49 3.24H4.3z" />
    ),
  },
  {
    name: "LinkedIn",
    buildUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    icon: (
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0" />
    ),
  },
] as const;

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const t = useTranslations("blog.detail");
  const [copied, setCopied] = useState(false);

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const getUrl = () => `${origin}${path}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {t("share")}
      </p>
      <div className="flex gap-2">
        {networks.map((network) => (
          <a
            key={network.name}
            href={network.buildUrl(getUrl(), title)}
            target="_blank"
            rel="noopener noreferrer"
            className="marketing-action grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-muted transition-colors hover:border-black/30 hover:text-foreground dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
          >
            <span className="sr-only">
              {t("shareOn", { network: network.name })}
            </span>
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {network.icon}
            </svg>
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          aria-label={t("copyLink")}
          className="marketing-action grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-muted transition-colors hover:border-black/30 hover:text-foreground dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>
      {copied ? (
        <output className="text-xs font-semibold text-accent">
          {t("copied")}
        </output>
      ) : null}
    </div>
  );
}
