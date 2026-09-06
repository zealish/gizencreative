"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DataTable,
  DataTableColumnHeader,
  type DataTableFilter,
  type Features,
} from "@/components/shared/data-table";
import { deleteBlogPost, toggleBlogPostPublished } from "../actions";

export interface BlogPostRow {
  id: string;
  titleId: string;
  slug: string;
  category: string;
  categoryName: string;
  published: boolean;
  publishedAt: string;
}

const menuItemClass =
  "flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5";

function RowActionsMenu({ post }: { post: BlogPostRow }) {
  const t = useTranslations("admin.blog");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    function handleClose() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);

  function toggleMenu() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((prev) => !prev);
  }

  return (
    <div className="flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        aria-label={t("columns.actions")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggleMenu}
        className="grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
      >
        <MoreHorizontalIcon className="size-4" />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: position.top, right: position.right }}
              className="card-elegant fixed z-50 w-44 rounded-2xl p-1.5 shadow-lg"
            >
              <form action={toggleBlogPostPublished}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className={menuItemClass}>
                  {post.published ? t("unpublish") : t("publish")}
                </button>
              </form>
              <Link
                href={`/admin/blog/${post.id}`}
                className={menuItemClass}
                onClick={() => setOpen(false)}
              >
                {t("edit")}
              </Link>
              <form action={deleteBlogPost}>
                <input type="hidden" name="id" value={post.id} />
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                >
                  {t("delete")}
                </button>
              </form>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function BlogPostsTable({
  posts,
  categories,
}: {
  posts: BlogPostRow[];
  categories: { value: string; label: string }[];
}) {
  const t = useTranslations("admin.blog");
  const format = useFormatter();

  const columns: ColumnDef<Features, BlogPostRow, unknown>[] = [
    {
      accessorKey: "titleId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.title")}
          key={`title-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span className="text-foreground">{row.original.titleId}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.slug")}
          key={`slug-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted">/blog/{row.original.slug}</span>
      ),
      meta: { className: "hidden md:table-cell" },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.category")}
          key={`category-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => row.original.categoryName,
      meta: { className: "hidden lg:table-cell" },
    },
    {
      id: "status",
      accessorFn: (row) => (row.published ? "published" : "draft"),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.status")}
          key={`status-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            row.original.published
              ? "bg-accent-soft text-accent"
              : "bg-black/5 text-muted dark:bg-white/10"
          }`}
        >
          {row.original.published ? t("statusPublished") : t("statusDraft")}
        </span>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.date")}
          key={`date-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted">
          {format.dateTime(new Date(row.original.publishedAt), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
      meta: { className: "hidden sm:table-cell" },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("columns.actions")}</span>,
      enableSorting: false,
      cell: ({ row }) => <RowActionsMenu post={row.original} />,
    },
  ];

  const filters: DataTableFilter[] = [
    {
      columnId: "category",
      title: t("columns.category"),
      options: categories,
    },
    {
      columnId: "status",
      title: t("columns.status"),
      options: [
        { value: "published", label: t("statusPublished") },
        { value: "draft", label: t("statusDraft") },
      ],
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={posts}
      searchKey="titleId"
      searchPlaceholder={t("searchPlaceholder")}
      filters={filters}
      enableExport
      exportFilename="blog-posts"
    />
  );
}
