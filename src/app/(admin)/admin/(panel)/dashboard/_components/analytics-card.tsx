import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { GaDashboardStats, GaRange } from "@/lib/ga";
import { RangeFilter } from "./range-filter";

export async function AnalyticsCard({
  stats,
  range,
  waRange,
}: {
  stats: GaDashboardStats | null;
  range: GaRange;
  waRange: GaRange;
}) {
  const t = await getTranslations("admin.dashboard.analytics");
  const totals = [
    { label: t("activeUsers"), value: stats?.totals.activeUsers },
    { label: t("pageViews"), value: stats?.totals.pageViews },
    { label: t("sessions"), value: stats?.totals.sessions },
  ];

  return (
    <div className="card-elegant rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
        <span className="rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
          {stats ? t("badgeConnected") : t("badgeNotConnected")}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        {t("description", { days: t(`range.${range}`) })}
      </p>
      <RangeFilter
        param="range"
        range={range}
        otherParam="waRange"
        otherRange={waRange}
      />
      <div className="mt-6 grid grid-cols-3 gap-3">
        {totals.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-accent/20 bg-accent-soft/40 p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight">
              {item.value === undefined
                ? "—"
                : Intl.NumberFormat().format(item.value)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-accent/20 bg-accent-soft/40 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          {t("chartLabel")}
        </p>
        <div className="mt-3">
          {stats && stats.daily.length > 1 ? (
            <TrendChart daily={stats.daily} />
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted">
              {t("noData")}
            </div>
          )}
        </div>
      </div>
      {stats && stats.topPages.length > 0 ? (
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {t("topPages")}
          </p>
          <ul className="mt-2 space-y-2">
            {stats.topPages.map((page) => (
              <li
                key={page.path}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="truncate text-muted">{page.path}</span>
                <span className="shrink-0 font-bold">
                  {Intl.NumberFormat().format(page.views)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <Link
        href="/admin/settings/analytics"
        className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
      >
        {t("manage")}
      </Link>
    </div>
  );
}

function TrendChart({ daily }: { daily: GaDashboardStats["daily"] }) {
  const width = 560;
  const height = 128;
  const max = Math.max(...daily.map((point) => point.pageViews), 1);
  const stepX = width / (daily.length - 1);
  const points = daily.map((point, index) => ({
    x: index * stepX,
    y: height - (point.pageViews / max) * (height - 8) - 4,
  }));
  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-32 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Page views trend"
    >
      <path d={area} className="fill-accent/15" />
      <path
        d={line}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
