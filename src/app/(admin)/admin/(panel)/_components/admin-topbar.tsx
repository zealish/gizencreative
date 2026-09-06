import { useTranslations } from "next-intl";
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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-black/10 bg-background/80 px-4 backdrop-blur-md sm:px-6 dark:border-white/10">
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
    </header>
  );
}
