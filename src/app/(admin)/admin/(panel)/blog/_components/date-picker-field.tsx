"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function DatePickerField({
  defaultValue,
  className,
}: {
  defaultValue: string;
  className?: string;
}) {
  const t = useTranslations("admin.blog.form.datePicker");
  const locale = useLocale();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(viewYear, viewMonth, 1));

  const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 2024-01-01 is a Monday
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFormat.format(new Date(2024, 0, 1 + i)).slice(0, 2),
  );

  const firstDay = new Date(viewYear, viewMonth, 1);
  // Monday-first offset
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(viewYear, viewMonth, i + 1),
    ),
  ];

  const todayStr = toDateString(new Date());

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const displayLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(selected);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name="publishedAt" value={value} />
      <button
        type="button"
        id="publishedAt"
        onClick={() => {
          setViewYear(selected.getFullYear());
          setViewMonth(selected.getMonth());
          setOpen((v) => !v);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${className ?? ""} flex cursor-pointer items-center justify-between gap-3 text-left`}
      >
        <span>{displayLabel}</span>
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
          className="shrink-0 text-muted"
        >
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={t("label")}
          className="card-elegant absolute left-0 top-full z-40 mt-2 w-72 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold tracking-tight">{monthLabel}</p>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label={t("prevMonth")}
                onClick={() => shiftMonth(-1)}
                className="grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              >
                <svg
                  width="14"
                  height="14"
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
              </button>
              <button
                type="button"
                aria-label={t("nextMonth")}
                onClick={() => shiftMonth(1)}
                className="grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {weekdays.map((day) => (
              <span
                key={day}
                className="grid h-8 place-items-center text-[10px] font-bold uppercase tracking-wider text-muted"
              >
                {day}
              </span>
            ))}
            {cells.map((date, i) =>
              date === null ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: static leading placeholders
                <span key={`empty-${i}`} />
              ) : (
                <button
                  key={toDateString(date)}
                  type="button"
                  onClick={() => {
                    setValue(toDateString(date));
                    setOpen(false);
                  }}
                  className={`grid h-8 cursor-pointer place-items-center rounded-full text-xs font-semibold transition-colors ${
                    toDateString(date) === value
                      ? "bg-accent text-white"
                      : toDateString(date) === todayStr
                        ? "bg-accent-soft text-accent hover:bg-accent hover:text-white"
                        : "text-foreground/80 hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {date.getDate()}
                </button>
              ),
            )}
          </div>
          <div className="mt-3 flex justify-end border-t border-black/5 pt-3 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setValue(toDateString(now));
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                setOpen(false);
              }}
              className="cursor-pointer text-xs font-bold uppercase tracking-wide text-accent transition-opacity hover:opacity-80"
            >
              {t("today")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
