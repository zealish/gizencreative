"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Reveal } from "@/components/reveal";
import { BlogCard } from "./blog-card";
import { type BlogCategory, blogCategories, blogPosts } from "./blog-data";

type Filter = "all" | BlogCategory;

const filterOptions: Filter[] = ["all", ...blogCategories];

export function BlogGrid() {
  const t = useTranslations("blog");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const visiblePosts = blogPosts.filter((post) => {
    if (filter !== "all" && post.category !== filter) return false;
    if (!normalizedQuery) return true;

    const haystack = [
      t(`posts.${post.key}.title`),
      t(`posts.${post.key}.excerpt`),
      t(`categories.${post.category}`),
      ...post.tags.map((tag) => t(`tags.${tag}`)),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl">
          <label className="relative block">
            <span className="sr-only">{t("searchLabel")}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-black/10 bg-white py-3.5 pl-12 pr-6 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none dark:border-white/15 dark:bg-white/5"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                filter === option
                  ? "bg-foreground text-background shadow-lg"
                  : "border border-black/10 bg-white text-muted hover:border-black/30 hover:text-foreground dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40"
              }`}
            >
              {t(`filters.${option}`)}
            </button>
          ))}
        </div>
        {visiblePosts.length === 0 ? (
          <p className="mt-14 text-center text-sm text-muted">{t("empty")}</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post, index) => (
              <Reveal key={post.slug} delay={Math.min(index * 100, 300)}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
