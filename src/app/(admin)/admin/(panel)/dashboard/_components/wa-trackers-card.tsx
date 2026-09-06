import { getFormatter, getTranslations } from "next-intl/server";
import type { GaRange } from "@/lib/ga";
import type { WaClickStats } from "@/lib/wa-stats";
import { RangeFilter } from "./range-filter";

export async function WaTrackersCard({
  stats,
  range,
  gaRange,
}: {
  stats: WaClickStats;
  range: GaRange;
  gaRange: GaRange;
}) {
  const t = await getTranslations("admin.dashboard.waTrackers");
  const format = await getFormatter();
  const maxSource = Math.max(...stats.bySource.map((row) => row.clicks), 1);

  return (
    <div className="card-elegant rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
        <span className="rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
          {t("totalBadge", { count: stats.total, days: t(`range.${range}`) })}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">{t("description")}</p>
      <RangeFilter
        param="waRange"
        range={range}
        otherParam="range"
        otherRange={gaRange}
      />
      {stats.total === 0 ? (
        <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-accent/20 bg-accent-soft/40 text-sm text-muted">
          {t("empty")}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-accent/20 bg-accent-soft/40 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {t("bySource")}
            </p>
            <ul className="mt-3 space-y-3">
              {stats.bySource.map((row) => (
                <li key={row.source}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-muted">
                      {t(`sources.${row.source}`)}
                    </span>
                    <span className="font-bold">
                      {Intl.NumberFormat().format(row.clicks)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-black/5 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${Math.max((row.clicks / maxSource) * 100, 4)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {t("recent")}
            </p>
            <ul className="mt-3 space-y-2">
              {stats.recent.map((click) => (
                <li
                  key={click.id}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="truncate">
                    <span className="font-semibold">
                      {t(`sources.${click.source}`)}
                    </span>
                    <span className="text-muted"> · {click.path}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {format.dateTime(click.createdAt, {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
