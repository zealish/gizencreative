"use client";

import type { Column, RowData } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import type { Features } from "./data-table-types";

interface DataTableColumnHeaderProps<TData extends RowData, TValue> {
  column: Column<Features, TData, TValue>;
  title: string;
  sortable?: boolean;
  className?: string;
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  sortable = true,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!sortable) {
    return <div className={`font-semibold ${className ?? ""}`}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  const handleSort = () => {
    if (sorted === "asc") {
      column.toggleSorting(true);
    } else if (sorted === "desc") {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  };

  return (
    <div className={`flex items-center ${className ?? ""}`}>
      <button
        type="button"
        onClick={handleSort}
        className="-ml-1 flex items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-foreground"
      >
        <span>{title}</span>
        {sorted === "asc" ? (
          <ArrowDownIcon className="size-3.5" />
        ) : sorted === "desc" ? (
          <ArrowUpIcon className="size-3.5" />
        ) : (
          <ArrowUpDownIcon className="size-3.5 opacity-50" />
        )}
      </button>
    </div>
  );
}
