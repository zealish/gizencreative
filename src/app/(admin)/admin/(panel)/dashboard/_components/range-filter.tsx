import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { GaRange } from "@/lib/ga";

const RANGE_OPTIONS: GaRange[] = ["7d", "28d", "90d"];

export async function RangeFilter({
  param,
  range,
  otherParam,
  otherRange,
}: {
  param: string;
  range: GaRange;
  otherParam: string;
  otherRange: GaRange;
}) {
  const t = await getTranslations("admin.dashboard.analytics");

  return (
    <div className="mt-4 flex gap-2">
      {RANGE_OPTIONS.map((option) => {
        const search = new URLSearchParams();
        if (option !== "28d") search.set(param, option);
        if (otherRange !== "28d") search.set(otherParam, otherRange);
        const query = search.toString();
        return (
          <Link
            key={option}
            href={query ? `/admin/dashboard?${query}` : "/admin/dashboard"}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              option === range
                ? "border-accent bg-accent text-white"
                : "border-accent/30 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {t(`range.${option}`)}
          </Link>
        );
      })}
    </div>
  );
}
