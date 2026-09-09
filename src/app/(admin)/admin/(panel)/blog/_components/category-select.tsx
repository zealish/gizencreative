"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";

import {
  createBlogCategory,
  deleteBlogCategory,
  updateBlogCategory,
} from "../actions";

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
        className="relative max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-black/10 bg-background p-5 shadow-xl dark:border-white/10 dark:bg-neutral-900 sm:p-6"
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
  const [editing, setEditing] = useState<CategoryOption | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [listQuery, setListQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
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
  const normalizedListQuery = listQuery.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      categories.filter((category) =>
        `${category.nameId} ${category.nameEn} ${category.slug}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    [categories, normalizedQuery],
  );
  const filteredList = useMemo(
    () =>
      categories.filter((category) =>
        `${category.nameId} ${category.nameEn} ${category.slug}`
          .toLowerCase()
          .includes(normalizedListQuery),
      ),
    [categories, normalizedListQuery],
  );
  const pageCount = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const pageCategories = filteredList.slice(
    (page - 1) * pageSize,
    page * pageSize,
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
          <input
            type="search"
            value={listQuery}
            onChange={(event) => {
              setListQuery(event.target.value);
              setPage(1);
            }}
            placeholder={t("searchAllPlaceholder")}
            className="mt-4 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/15 dark:bg-white/5"
          />
          <div className="mt-3 overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.03] text-xs uppercase tracking-wider text-muted dark:border-white/10 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    {t("nameIdLabel")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("nameEnLabel")}
                  </th>
                  <th className="px-4 py-3 font-semibold">{t("slugLabel")}</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {t("actionsLabel")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {pageCategories.map((category) => (
                  <tr
                    key={category.slug}
                    className="hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 font-semibold">
                      {category.nameId}
                    </td>
                    <td className="px-4 py-3 text-muted">{category.nameEn}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      /{category.slug}
                    </td>
                    <td className="px-4 py-3">
                      <CategoryActionMenu
                        category={category}
                        selected={selected === category.slug}
                        onEdit={() => setEditing(category)}
                        onSelect={() => {
                          setSelected(category.slug);
                          setListOpen(false);
                          setOpen(false);
                        }}
                        onError={setListError}
                        onDeleted={() => {
                          setCategories((prev) =>
                            prev.filter((item) => item.slug !== category.slug),
                          );
                          if (selected === category.slug) setSelected("");
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredList.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{t("empty")}</p>
          ) : (
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <p className="text-muted">
                {t("pageSummary", { page, pageCount })}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((value) => value - 1)}
                  className="cursor-pointer rounded-full border border-black/10 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-white/15"
                >
                  {t("previousLabel")}
                </button>
                <button
                  type="button"
                  disabled={page === pageCount}
                  onClick={() => setPage((value) => value + 1)}
                  className="cursor-pointer rounded-full border border-black/10 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-white/15"
                >
                  {t("nextLabel")}
                </button>
              </div>
            </div>
          )}
          {listError ? (
            <p role="alert" className="mt-3 text-sm text-red-500">
              {listError}
            </p>
          ) : null}
          {editing ? (
            <EditCategoryModal
              category={editing}
              onClose={() => setEditing(null)}
              onUpdated={(next) => {
                setCategories((prev) =>
                  prev
                    .map((item) => (item.slug === editing.slug ? next : item))
                    .sort((a, b) => a.nameId.localeCompare(b.nameId)),
                );
                setSelected(next.slug);
                setEditing(null);
              }}
            />
          ) : null}
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
        setError(
          result.error === "invalid" || result.error === "duplicate"
            ? result.error
            : "invalid",
        );
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

function DeleteCategoryButton({
  slug,
  onError,
  onDeleted,
}: {
  slug: string;
  onError: (message: string) => void;
  onDeleted: () => void;
}) {
  const t = useTranslations("admin.blog.form.categorySelect");
  const [isPending, startTransition] = useTransition();
  function handleDelete() {
    if (!window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      const result = await deleteBlogCategory(slug);
      if (result.ok) onDeleted();
      else
        onError(t(result.error === "in_use" ? "errorInUse" : "errorInvalid"));
    });
  }
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50"
    >
      {t("deleteLabel")}
    </button>
  );
}

function EditCategoryModal({
  category,
  onClose,
  onUpdated,
}: {
  category: CategoryOption;
  onClose: () => void;
  onUpdated: (category: CategoryOption) => void;
}) {
  const t = useTranslations("admin.blog.form.categorySelect");
  const [nameId, setNameId] = useState(category.nameId);
  const [nameEn, setNameEn] = useState(category.nameEn);
  const [slug, setSlug] = useState(category.slug);
  const [error, setError] = useState<"invalid" | "duplicate" | null>(null);
  const [isPending, startTransition] = useTransition();
  function handleSubmit() {
    startTransition(async () => {
      const result = await updateBlogCategory({
        originalSlug: category.slug,
        slug: slugify(slug),
        nameId: nameId.trim(),
        nameEn: nameEn.trim(),
      });
      if (result.ok) onUpdated(result.category);
      else setError(result.error === "duplicate" ? "duplicate" : "invalid");
    });
  }
  return (
    <ModalShell title={t("editTitle")} onClose={onClose}>
      <div className="mt-4 space-y-4">
        <input
          aria-label={t("nameIdLabel")}
          value={nameId}
          onChange={(event) => setNameId(event.target.value)}
          className={inputClass}
        />
        <input
          aria-label={t("nameEnLabel")}
          value={nameEn}
          onChange={(event) => setNameEn(event.target.value)}
          className={inputClass}
        />
        <input
          aria-label={t("slugLabel")}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className={inputClass}
        />
        {error ? (
          <p role="alert" className="text-sm text-red-500">
            {t(error === "duplicate" ? "errorDuplicate" : "errorInvalid")}
          </p>
        ) : null}
        <button
          type="button"
          disabled={
            isPending ||
            nameId.trim().length < 2 ||
            nameEn.trim().length < 2 ||
            slugify(slug).length < 2
          }
          onClick={handleSubmit}
          className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? t("saving") : t("saveButton")}
        </button>
      </div>
    </ModalShell>
  );
}

function CategoryActionMenu({
  category,
  selected,
  onEdit,
  onSelect,
  onError,
  onDeleted,
}: {
  category: CategoryOption;
  selected: boolean;
  onEdit: () => void;
  onSelect: () => void;
  onError: (message: string) => void;
  onDeleted: () => void;
}) {
  const t = useTranslations("admin.blog.form.categorySelect");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function closeMenu(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, [open]);
  return (
    <div ref={menuRef} className="relative flex justify-end">
      <button
        type="button"
        aria-label={t("actionsLabel")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer rounded-full p-2 text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
      >
        <MoreHorizontalIcon size={18} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-2xl border border-black/10 bg-background p-1.5 shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => {
              onSelect();
              setOpen(false);
            }}
            className="w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
          >
            {selected ? t("selectedLabel") : t("useLabel")}
          </button>
          <button
            type="button"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
          >
            {t("editLabel")}
          </button>
          <DeleteCategoryButton
            slug={category.slug}
            onError={(message) => {
              onError(message);
              setOpen(false);
            }}
            onDeleted={() => {
              onDeleted();
              setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
