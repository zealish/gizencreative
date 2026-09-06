import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const navItems = [
  {
    key: "dashboard",
    href: "/admin/dashboard",
    icon: (
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
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    key: "media",
    href: "/admin/media",
    icon: (
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    key: "settings",
    href: "/admin/settings",
    icon: (
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
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
] as const;

export function AdminSidebar({
  open,
  onClose,
  collapsed,
}: {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
}) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label={t("closeMenu")}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-black/10 bg-background transition-[transform,width] duration-200 lg:sticky lg:top-0 lg:h-svh lg:translate-x-0 dark:border-white/10 ${
          collapsed ? "w-64 lg:w-[68px]" : "w-64"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-16 items-center border-b border-black/10 px-4 dark:border-white/10 ${
            collapsed
              ? "justify-between lg:justify-center lg:px-0"
              : "justify-between"
          }`}
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 6h10v4H8v8H4V6zm10 8h6v4h-6v-4z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span
              className={`text-sm font-bold tracking-tight ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Gizen Admin
            </span>
          </Link>
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={onClose}
            className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:text-foreground lg:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                title={collapsed ? t(item.key) : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  collapsed ? "lg:justify-center lg:px-0" : ""
                } ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span className={collapsed ? "lg:hidden" : ""}>
                  {t(item.key)}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-black/10 p-3 dark:border-white/10">
          <Link
            href="/"
            title={collapsed ? t("backToSite") : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
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
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className={collapsed ? "lg:hidden" : ""}>
              {t("backToSite")}
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
