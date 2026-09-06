"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";

import { createBlogCategory } from "../actions";

export type CategoryOption = {
  slug: string;
  nameId: string;
  nameEn: string;
};

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label={title}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />
      <div
        data-lenis-prevent
        className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-black/10 bg-background p-5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold tracking-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid size-7 place-items-center rounded-md text-muted transition-colors hover:text-foreground"
          >
            <XIcon size={14} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function CategorySelect({
  categories: initialCategories,
  defaultValue,
}: {
  categories: CategoryOption[];
  defaultValue?: string;
}) {
  const t = useTranslations("admin.blog.form.categorySelect");
  const [categories, setCategories] = useState(initialCategories);
  const [selected, setSelected] = useState(
    defaultValue ?? initialCategories[0]?.slug ?? "",
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();

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

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      categories.filter((category) =>
        `${category.nameId} ${category.nameEn} ${category.slug}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    [categories, normalizedQuery],
  );

  const selectedCategory = categories.find(
    (category) => category.slug === selected,
  );

  function handleCreated(category: CategoryOption) {
    setCategories((prev) =>
      [...prev, category].sort((a, b) => a.nameId.localeCompare(b.nameId)),
    );
    setSelected(category.slug);
    setCreateOpen(false);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name="category" value={selected} required />
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${inputClass} flex items-center justify-between gap-2 text-left`}
      >
        <span className={selectedCategory ? "" : "text-muted"}>
          {selectedCategory?.nameId ?? t("placeholder")}
        </span>
        <ChevronDownIcon
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-background shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <div className="border-b border-black/10 p-2 dark:border-white/10">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-xl bg-black/5 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted dark:bg-white/5"
            />
          </div>
          <ul data-lenis-prevent className="max-h-52 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">{t("empty")}</li>
            ) : (
              filtered.map((category) => (
                <li key={category.slug}>
                  <button
                    type="button"
                    aria-pressed={category.slug === selected}
                    onClick={() => {
                      setSelected(category.slug);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                      category.slug === selected
                        ? "font-semibold text-foreground"
                        : "text-muted"
                    }`}
                  >
                    <span>
                      {category.nameId}
                      <span className="ml-2 text-xs text-muted">
                        /{category.slug}
                      </span>
                    </span>
                    {category.slug === selected ? (
                      <CheckIcon
                        size={14}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="flex items-center justify-between gap-2 border-t border-black/10 p-2 dark:border-white/10">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <PlusIcon size={14} aria-hidden="true" />
              {t("createNew")}
            </button>
            <button
              type="button"
              onClick={() => setListOpen(true)}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
            >
              {t("viewAll")}
            </button>
          </div>
        </div>
      ) : null}
      {createOpen ? (
        <CreateCategoryModal
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
        />
      ) : null}
      {listOpen ? (
        <ModalShell title={t("allTitle")} onClose={() => setListOpen(false)}>
          <ul className="mt-4 space-y-1">
            {categories.map((category) => (
              <li
                key={category.slug}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {category.nameId}
                  </p>
                  <p className="text-xs text-muted">
                    {category.nameEn} · /{category.slug}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(category.slug);
                    setListOpen(false);
                    setOpen(false);
                  }}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-muted transition-colors hover:border-black/30 hover:text-foreground dark:border-white/15 dark:hover:border-white/40"
                >
                  {category.slug === selected
                    ? t("selectedLabel")
                    : t("useLabel")}
                </button>
              </li>
            ))}
          </ul>
        </ModalShell>
      ) : null}
    </div>
  );
}

function CreateCategoryModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (category: CategoryOption) => void;
}) {
  const t = useTranslations("admin.blog.form.categorySelect");
  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<"invalid" | "duplicate" | null>(null);
  const [isPending, startTransition] = useTransition();

  const effectiveSlug = slugTouched ? slug : slugify(nameId);

  function handleSubmit() {
    setError(null);
    const payload = {
      slug: effectiveSlug,
      nameId: nameId.trim(),
      nameEn: nameEn.trim(),
    };
    startTransition(async () => {
      const result = await createBlogCategory(payload);
      if (result.ok) {
        onCreated(result.category);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <ModalShell title={t("createTitle")} onClose={onClose}>
      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="new-category-name-id" className={labelClass}>
            {t("nameIdLabel")}
          </label>
          <input
            id="new-category-name-id"
            type="text"
            value={nameId}
            onChange={(event) => setNameId(event.target.value)}
            placeholder="Branding & Desain"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="new-category-name-en" className={labelClass}>
            {t("nameEnLabel")}
          </label>
          <input
            id="new-category-name-en"
            type="text"
            value={nameEn}
            onChange={(event) => setNameEn(event.target.value)}
            placeholder="Branding & Design"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="new-category-slug" className={labelClass}>
            {t("slugLabel")}
          </label>
          <input
            id="new-category-slug"
            type="text"
            value={effectiveSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            placeholder="branding-desain"
            className={inputClass}
          />
          <p className="text-xs text-muted">{t("slugHint")}</p>
        </div>
        {error ? (
          <p role="alert" className="text-sm font-medium text-red-500">
            {t(error === "duplicate" ? "errorDuplicate" : "errorInvalid")}
          </p>
        ) : null}
        <button
          type="button"
          disabled={
            isPending ||
            nameId.trim().length < 2 ||
            nameEn.trim().length < 2 ||
            effectiveSlug.length < 2
          }
          onClick={handleSubmit}
          className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {isPending ? t("creating") : t("createButton")}
        </button>
      </div>
    </ModalShell>
  );
}
