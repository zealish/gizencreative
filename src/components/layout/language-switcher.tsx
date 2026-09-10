"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { setLocale } from "@/i18n/actions";
import type { Locale } from "@/i18n/request";

const languages: { locale: Locale; label: string }[] = [
  { locale: "en", label: "English" },
  { locale: "id", label: "Bahasa Indonesia" },
];

export function LanguageSwitcher({
  placement = "top",
}: {
  placement?: "top" | "bottom";
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const current =
    languages.find((language) => language.locale === locale) ?? languages[0];

  const select = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => setLocale(next));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={current.label}
        title={current.label}
        onClick={() => setOpen((v) => !v)}
        className="marketing-action relative flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-foreground"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="absolute -bottom-0.5 right-0 rounded-full bg-background px-1 text-[9px] font-bold uppercase leading-tight tracking-tight text-foreground/70">
          {current.locale}
        </span>
      </button>

      <div
        className={`absolute right-0 transition-all duration-200 ${
          placement === "top" ? "bottom-full pb-2" : "top-full pt-2"
        } ${
          open
            ? "visible translate-y-0 opacity-100"
            : `invisible opacity-0 ${placement === "top" ? "translate-y-1" : "-translate-y-1"}`
        }`}
      >
        <ul className="w-44 rounded-2xl bg-white p-2 shadow-xl shadow-black/10 ring-1 ring-black/5 dark:bg-background dark:shadow-black/40 dark:ring-white/10">
          {languages.map((language) => (
            <li key={language.locale}>
              <button
                type="button"
                onClick={() => select(language.locale)}
                aria-current={language.locale === locale}
                className={`marketing-action block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-foreground/5 ${
                  language.locale === locale
                    ? "font-semibold text-foreground"
                    : "text-muted"
                }`}
              >
                {language.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
