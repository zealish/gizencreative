"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const navItems = [
  { key: "general", href: "/admin/settings/general" },
  { key: "seo", href: "/admin/settings/seo" },
  { key: "analytics", href: "/admin/settings/analytics" },
  { key: "smtp", href: "/admin/settings/smtp" },
  { key: "storage", href: "/admin/settings/storage" },
  { key: "pages", href: "/admin/settings/pages" },
] as const;

export function SettingsNav() {
  const t = useTranslations("admin.settings.nav");
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:w-48 lg:shrink-0 lg:flex-col">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              active
                ? "bg-primary text-white"
                : "text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
            }`}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
