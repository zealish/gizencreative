"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const serviceItems = [
  { key: "websiteDevelopment", href: "/services/website-development" },
  { key: "socialMediaManagement", href: "/services/social-media-management" },
  { key: "seoWebsite", href: "/services/seo-website" },
] as const;

const navLinks = [
  { key: "pricing", href: "/pricing" },
  { key: "portfolio", href: "/portfolio" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
] as const;

function ServicesDropdown() {
  const t = useTranslations("navbar");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover-intent only; keyboard access via the toggle button below
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
          open
            ? "bg-foreground/10 text-foreground"
            : "text-foreground/70 hover:text-foreground"
        }`}
      >
        {t("services")}
        <svg
          aria-hidden="true"
          className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>

      <div
        className={`absolute left-0 top-full pt-3 transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="w-[26rem] rounded-2xl bg-white p-3 shadow-xl shadow-black/10 ring-1 ring-black/5 dark:bg-background dark:shadow-black/40 dark:ring-white/10">
          {serviceItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 transition-colors hover:bg-foreground/5"
            >
              <p className="text-sm font-bold text-foreground">
                {t(`serviceItems.${item.key}.title`)}
              </p>
              <p className="mt-0.5 text-sm text-foreground/60">
                {t(`serviceItems.${item.key}.description`)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu() {
  const t = useTranslations("navbar");
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={t("services")}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      <div
        className={`absolute inset-x-0 top-full mt-2 transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <nav className="rounded-2xl bg-white p-3 shadow-xl shadow-black/10 ring-1 ring-black/5 dark:bg-background dark:shadow-black/40 dark:ring-white/10">
          <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            {t("services")}
          </p>
          {serviceItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
            >
              {t(`serviceItems.${item.key}.title`)}
            </Link>
          ))}
          <div className="my-2 border-t border-black/5 dark:border-white/10" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}
          <Link
            href="/#kontak"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white"
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </div>
  );
}

export function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const t = useTranslations("navbar");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-0">
      <div
        className={`relative mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "mt-3 max-w-5xl rounded-2xl bg-white/90 shadow-lg shadow-black/5 backdrop-blur-md dark:bg-background/90 dark:shadow-black/30"
            : "mt-0 max-w-7xl bg-transparent"
        }`}
      >
        <Logo logoUrl={logoUrl} />
        <nav className="hidden items-center gap-4 md:flex">
          <ServicesDropdown />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wide text-foreground/70 transition-colors hover:text-foreground"
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 flex items-center justify-end gap-3 sm:gap-5">
          <ThemeToggle />
          <Link
            href="/#kontak"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md transition-opacity hover:opacity-85 md:inline-block"
          >
            {t("cta")}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
