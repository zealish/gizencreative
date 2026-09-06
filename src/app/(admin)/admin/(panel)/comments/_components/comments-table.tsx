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
import { deleteComment, toggleCommentApproved } from "../actions";

export interface CommentRow {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
  postTitle: string;
  postSlug: string;
}

const menuItemClass =
  "flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-muted transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5";

function RowActionsMenu({ comment }: { comment: CommentRow }) {
  const t = useTranslations("admin.comments");
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
              <form action={toggleCommentApproved}>
                <input type="hidden" name="id" value={comment.id} />
                <button type="submit" className={menuItemClass}>
                  {comment.approved ? t("unapprove") : t("approve")}
                </button>
              </form>
              <Link
                href={`/blog/${comment.postSlug}`}
                target="_blank"
                className={menuItemClass}
                onClick={() => setOpen(false)}
              >
                {t("viewPost")}
              </Link>
              <form action={deleteComment}>
                <input type="hidden" name="id" value={comment.id} />
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

export function CommentsTable({ comments }: { comments: CommentRow[] }) {
  const t = useTranslations("admin.comments");
  const format = useFormatter();

  const columns: ColumnDef<Features, CommentRow, unknown>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.name")}
          key={`name-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span className="text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.message")}
          key={`message-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span
          className="block max-w-xs truncate text-muted"
          title={row.original.message}
        >
          {row.original.message}
        </span>
      ),
      meta: { className: "hidden sm:table-cell" },
    },
    {
      accessorKey: "postTitle",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.post")}
          key={`post-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span className="block max-w-[16rem] truncate text-xs text-muted">
          {row.original.postTitle}
        </span>
      ),
      meta: { className: "hidden lg:table-cell" },
    },
    {
      id: "status",
      accessorFn: (row) => (row.approved ? "approved" : "pending"),
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
            row.original.approved
              ? "bg-accent-soft text-accent"
              : "bg-black/5 text-muted dark:bg-white/10"
          }`}
        >
          {row.original.approved ? t("statusApproved") : t("statusPending")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.date")}
          key={`date-${column.getIsSorted()}`}
        />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted">
          {format.dateTime(new Date(row.original.createdAt), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
      meta: { className: "hidden md:table-cell" },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("columns.actions")}</span>,
      enableSorting: false,
      cell: ({ row }) => <RowActionsMenu comment={row.original} />,
    },
  ];

  const filters: DataTableFilter[] = [
    {
      columnId: "status",
      title: t("columns.status"),
      options: [
        { value: "approved", label: t("statusApproved") },
        { value: "pending", label: t("statusPending") },
      ],
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={comments}
      searchKey="name"
      searchPlaceholder={t("searchPlaceholder")}
      filters={filters}
      enableExport
      exportFilename="blog-comments"
    />
  );
}
