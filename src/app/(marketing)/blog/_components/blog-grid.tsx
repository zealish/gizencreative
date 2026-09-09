"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/reveal";
import type { BlogCategoryInfo, LocalizedBlogPost } from "@/lib/blog-shared";
import { BlogCard } from "./blog-card";

function archiveKey(date: string): string {
  return date.slice(0, 7); // YYYY-MM
}

export function BlogGrid({
  posts,
  categories,
}: {
  posts: LocalizedBlogPost[];
  categories: BlogCategoryInfo[];
}) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [filter, setFilter] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeArchive, setActiveArchive] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const visiblePosts = posts.filter((post) => {
    if (filter !== "all" && post.category.slug !== filter) return false;
    if (activeTag && !post.tags.includes(activeTag)) return false;
    if (activeArchive && archiveKey(post.date) !== activeArchive) return false;
    if (!normalizedQuery) return true;

    const haystack = [
      post.title,
      post.excerpt,
      post.category.name,
      ...post.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.category.slug, (counts.get(post.category.slug) ?? 0) + 1);
    }
    return counts;
  }, [posts]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const archives = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      const key = archiveKey(post.date);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, count]) => ({
        key,
        count,
        label: new Date(`${key}-01T00:00:00`).toLocaleDateString(locale, {
          month: "long",
          year: "numeric",
        }),
      }));
  }, [posts, locale]);

  const sidebarItemClass = (active: boolean) =>
    `marketing-action flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
      active
        ? "bg-primary text-white"
        : "text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
    }`;

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
        <div>
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
          {visiblePosts.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted">{t("empty")}</p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {visiblePosts.map((post, index) => (
                <Reveal key={post.slug} delay={Math.min(index * 100, 300)}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <aside className="mt-10 space-y-6 lg:mt-0">
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
              {t("sidebar.categories")}
            </h3>
            <ul className="mt-3 space-y-1">
              {[{ slug: "all", name: t("filters.all") }, ...categories].map(
                (option) => (
                  <li key={option.slug}>
                    <button
                      type="button"
                      onClick={() => setFilter(option.slug)}
                      className={sidebarItemClass(filter === option.slug)}
                    >
                      <span>{option.name}</span>
                      <span className="text-xs">
                        {option.slug === "all"
                          ? posts.length
                          : (categoryCounts.get(option.slug) ?? 0)}
                      </span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
              {t("sidebar.tags")}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {tagCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setActiveTag((current) => (current === tag ? null : tag))
                  }
                  className={`marketing-action inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTag === tag
                      ? "bg-primary text-white"
                      : "border border-black/10 text-muted hover:border-black/30 hover:text-foreground dark:border-white/15 dark:hover:border-white/40"
                  }`}
                >
                  #{tag} ({count})
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
              {t("sidebar.archives")}
            </h3>
            <ul className="mt-3 space-y-1">
              {archives.map((archive) => (
                <li key={archive.key}>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveArchive((current) =>
                        current === archive.key ? null : archive.key,
                      )
                    }
                    className={sidebarItemClass(activeArchive === archive.key)}
                  >
                    <span>{archive.label}</span>
                    <span className="text-xs">{archive.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
