"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { Features } from "./data-table-types";

const pageButtonClass =
  "inline-flex size-8 items-center justify-center rounded-full border border-black/10 text-muted transition-colors hover:border-black/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 dark:border-white/15 dark:hover:border-white/40";

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<Features, TData>;
  pageSizeOptions?: number[];
  enableSelection?: boolean;
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
  enableSelection = false,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations("admin.dataTable");
  const state = table.state;

  return (
    <div className="flex flex-col gap-3 px-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
      {enableSelection ? (
        <div className="text-sm text-muted sm:flex-1">
          {t("selectedCount", {
            selected: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end sm:gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{t("rowsPerPage")}</p>
          <select
            value={state.pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-8 rounded-xl border border-black/10 bg-white px-2 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm font-medium">
          {t("pageOf", {
            page: state.pagination.pageIndex + 1,
            total: Math.max(table.getPageCount(), 1),
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={pageButtonClass}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("firstPage")}</span>
            <ChevronsLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            className={pageButtonClass}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("previousPage")}</span>
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            className={pageButtonClass}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("nextPage")}</span>
            <ChevronRightIcon className="size-4" />
          </button>
          <button
            type="button"
            className={pageButtonClass}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("lastPage")}</span>
            <ChevronsRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
