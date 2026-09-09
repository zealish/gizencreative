"use client";

import { useEffect, useState } from "react";

export function SaveToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.closest("[data-settings-page]")) return;

      const submitButtons = form.querySelectorAll<HTMLButtonElement>(
        'button[type="submit"]',
      );
      for (const button of submitButtons) {
        button.disabled = true;
        button.classList.add("cursor-wait", "opacity-60");
      }

      setMessage("Menyimpan perubahan…");
      window.setTimeout(() => {
        for (const button of submitButtons) {
          button.disabled = false;
          button.classList.remove("cursor-wait", "opacity-60");
        }
        setMessage("Perubahan berhasil disimpan");
      }, 700);
    };

    document.addEventListener("submit", handleSubmit, true);
    return () => document.removeEventListener("submit", handleSubmit, true);
  }, []);

  useEffect(() => {
    if (!message || message === "Menyimpan perubahan…") return;
    const timeout = window.setTimeout(() => setMessage(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  if (!message) return null;
  return (
    <output
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-accent/20 bg-background/95 px-4 py-3 text-foreground shadow-2xl shadow-accent/15 backdrop-blur-md dark:bg-neutral-900/95 sm:bottom-6 sm:right-6"
    >
      <span
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-white shadow-lg shadow-accent/25"
        aria-hidden="true"
      >
        {message === "Menyimpan perubahan…" ? (
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="size-5"
            stroke="currentColor"
            strokeWidth="2.5"
            role="img"
            aria-label="Berhasil"
          >
            <path
              d="m5 10 3 3 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold tracking-tight">
          {message === "Menyimpan perubahan…" ? "Menyimpan" : "Tersimpan"}
        </span>
        <span className="block text-xs text-muted">{message}</span>
      </span>
    </output>
  );
}
