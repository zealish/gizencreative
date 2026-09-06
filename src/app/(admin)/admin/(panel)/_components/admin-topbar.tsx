import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "./user-menu";

export function AdminTopbar({
  userName,
  userEmail,
  onMenuClick,
  collapsed,
  onToggleCollapse,
}: {
  userName: string;
  userEmail: string;
  onMenuClick: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const t = useTranslations("admin.nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30">
      <div
        className={`flex items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "mx-3 mt-3 h-14 rounded-2xl bg-white/90 shadow-lg shadow-black/5 backdrop-blur-md sm:mx-4 dark:bg-background/90 dark:shadow-black/30"
            : "mx-0 mt-0 h-16 bg-transparent"
        }`}
      >
        <button
          type="button"
          aria-label={t("openMenu")}
          onClick={onMenuClick}
          className="grid size-9 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:text-foreground lg:hidden"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
          title={collapsed ? t("expandSidebar") : t("collapseSidebar")}
          onClick={onToggleCollapse}
          className="hidden size-9 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:text-foreground lg:grid"
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
            className={collapsed ? "rotate-180" : ""}
          >
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher placement="bottom" />
          <ThemeToggle className="flex" />
          <UserMenu name={userName} email={userEmail} />
        </div>
      </div>
    </header>
  );
}
