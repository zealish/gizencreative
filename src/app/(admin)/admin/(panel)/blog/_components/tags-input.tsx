"use client";

import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

const MAX_TAGS = 8;

function slugifyTag(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TagsInput({
  suggestions,
  defaultValue = [],
}: {
  suggestions: string[];
  defaultValue?: string[];
}) {
  const t = useTranslations("admin.blog.form.tagsSelect");
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const normalizedQuery = slugifyTag(query);
  const atLimit = tags.length >= MAX_TAGS;

  const filtered = useMemo(
    () =>
      suggestions.filter(
        (tag) => !tags.includes(tag) && tag.includes(normalizedQuery),
      ),
    [suggestions, tags, normalizedQuery],
  );

  const canCreate =
    normalizedQuery.length > 0 &&
    !atLimit &&
    !tags.includes(normalizedQuery) &&
    !suggestions.includes(normalizedQuery);

  function addTag(tag: string) {
    if (atLimit || tags.includes(tag)) return;
    setTags((prev) => [...prev, tag]);
    setQuery("");
    inputRef.current?.focus();
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((entry) => entry !== tag));
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (normalizedQuery.length > 0) {
        addTag(normalizedQuery);
      }
    } else if (
      event.key === "Backspace" &&
      query.length === 0 &&
      tags.length > 0
    ) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name="tags" value={tags.join(",")} />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: click forwards focus to the inner input */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users focus the inner input directly */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex w-full flex-wrap items-center gap-1.5 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground transition-colors focus-within:border-accent dark:border-white/15 dark:bg-white/5"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={t("remove", { tag })}
              className="grid size-4 place-items-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              <XIcon size={10} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={atLimit}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={atLimit ? t("limitReached") : t("placeholder")}
          className="min-w-24 flex-1 bg-transparent py-1 outline-none placeholder:text-muted disabled:cursor-not-allowed"
        />
      </div>
      {open && !atLimit && (filtered.length > 0 || canCreate) ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-background shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <ul data-lenis-prevent className="max-h-52 overflow-y-auto p-2">
            {canCreate ? (
              <li>
                <button
                  type="button"
                  onClick={() => addTag(normalizedQuery)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-accent transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <PlusIcon size={14} aria-hidden="true" />
                  {t("createNew", { tag: normalizedQuery })}
                </button>
              </li>
            ) : null}
            {filtered.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => addTag(tag)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span>#{tag}</span>
                  <CheckIcon
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 opacity-0"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
