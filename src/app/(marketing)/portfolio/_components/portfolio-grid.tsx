"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Reveal } from "@/components/reveal";
import {
  filterOptions,
  type PortfolioFilter,
  portfolioItems,
} from "./portfolio-data";

export function PortfolioGrid() {
  const t = useTranslations("portfolio");
  const [filter, setFilter] = useState<PortfolioFilter>("all");

  const visibleItems =
    filter === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === filter);

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                filter === option
                  ? "bg-primary text-white shadow-lg"
                  : "border border-black/10 bg-white text-muted hover:border-black/30 hover:text-foreground dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
              }`}
            >
              {t(`filters.${option}`)}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item, index) => (
            <Reveal key={item.key} delay={Math.min(index * 100, 300)}>
              <article className="card-elegant group overflow-hidden rounded-3xl">
                <div
                  className={`relative aspect-[4/3] bg-gradient-to-br ${item.gradient}`}
                >
                  {item.badge ? (
                    <span className="absolute right-4 top-4 rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                      {t(`badges.${item.badge}`)}
                    </span>
                  ) : null}
                  <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground shadow-lg">
                      {t("viewProject")}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {t(`categories.${item.category}`)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
