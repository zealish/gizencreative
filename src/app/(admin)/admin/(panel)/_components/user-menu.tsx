import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/auth-client";

export function UserMenu({ name, email }: { name: string; email: string }) {
  const t = useTranslations("admin.nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={t("accountMenu")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="grid size-9 cursor-pointer place-items-center rounded-full bg-foreground text-xs font-bold text-background transition-opacity hover:opacity-80"
      >
        {initials}
      </button>
      {open ? (
        <div className="card-elegant absolute right-0 top-full z-40 mt-2 w-64 rounded-2xl p-2 shadow-lg">
          <div className="border-b border-black/10 px-3 py-3 dark:border-white/10">
            <p className="truncate text-sm font-bold">{name}</p>
            <p className="mt-0.5 truncate text-xs text-muted">{email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5M21 12H9" />
            </svg>
            {t("signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
