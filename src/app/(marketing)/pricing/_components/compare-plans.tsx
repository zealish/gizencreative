"use client";

import { useTranslations } from "next-intl";

import type { CompareTable, Service } from "./pricing-data";

export function ComparePlans({
  service,
  table,
}: {
  service: Service;
  table: CompareTable;
}) {
  const t = useTranslations("pricing.compare");

  return (
    <section className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-muted">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h2>
        <div className="mt-10 overflow-x-auto rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:mt-12">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10">
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted sm:px-6 sm:py-5">
                  {t("featureColumn")}
                </th>
                {table.columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-4 text-center sm:px-6 sm:py-5"
                  >
                    <span className="block text-base font-bold">
                      {t(`${service}.columns.${col.key}`)}
                    </span>
                    <span className="block text-xs font-normal text-muted">
                      {col.price
                        ? col.monthly
                          ? t("perMonth", { price: col.price })
                          : col.price
                        : t("values.custom")}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-black/5 dark:border-white/10 last:border-b-0"
                >
                  <td className="px-4 py-3.5 text-sm text-foreground/80 sm:px-6 sm:py-4">
                    {t(`${service}.rows.${row.key}`)}
                  </td>
                  {row.values.map((value, i) => (
                    <td
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-order plan columns
                      key={i}
                      className="px-4 py-3.5 text-center sm:px-6 sm:py-4"
                    >
                      {typeof value === "boolean" ? (
                        value ? (
                          <span
                            className="text-accent"
                            role="img"
                            aria-label={t("included")}
                          >
                            ✓
                          </span>
                        ) : (
                          <span
                            className="text-foreground/50"
                            role="img"
                            aria-label={t("notIncluded")}
                          >
                            —
                          </span>
                        )
                      ) : (
                        <span className="text-sm font-semibold">
                          {"text" in value
                            ? value.text
                            : t(`values.${value.textKey}`)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
