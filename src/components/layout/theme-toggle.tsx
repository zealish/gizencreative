"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({
  className = "hidden sm:flex",
  variant = "inline",
}: {
  className?: string;
  variant?: "inline" | "floating";
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const base =
    variant === "floating"
      ? "marketing-action fixed bottom-24 right-6 z-50 grid size-14 place-items-center rounded-full bg-white text-foreground/70 shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 hover:text-foreground dark:bg-neutral-900 dark:ring-white/10"
      : "marketing-action size-9 cursor-pointer items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-foreground";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={`${base} ${className}`}
    >
      {isDark ? (
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
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
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
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
