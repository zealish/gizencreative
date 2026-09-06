"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";
import { DownloadIcon, SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { exportToCsv } from "./data-table-export";
import type { Features } from "./data-table-types";

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export interface DataTableFilter {
  columnId: string;
  title: string;
  options: DataTableFilterOption[];
}

interface DataTableToolbarProps<TData extends RowData> {
  table: ReactTable<Features, TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  enableExport?: boolean;
  exportFilename?: string;
  renderBulkActions?: (rows: TData[]) => React.ReactNode;
}

export function DataTableToolbar<TData extends RowData>({
  table,
  searchKey,
  searchPlaceholder,
  filters,
  enableExport = false,
  exportFilename = "export",
  renderBulkActions,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations("admin.dataTable");
  const state = table.state;
  const isFiltered = state.columnFilters.length > 0 || state.globalFilter;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  function handleExport() {
    const exportColumns = table
      .getAllColumns()
      .filter((col) => col.id !== "select" && col.getIsVisible());
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCsv(exportFilename, rows, exportColumns);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder={searchPlaceholder ?? t("searchPlaceholder")}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="h-9 w-[180px] rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5 lg:w-[260px]"
            />
          </div>
        )}
        {filters?.map((filter) => {
          const column = table.getColumn(filter.columnId);
          if (!column) return null;
          const value = (column.getFilterValue() as string) ?? "";
          return (
            <select
              key={filter.columnId}
              value={value}
              onChange={(event) =>
                column.setFilterValue(event.target.value || undefined)
              }
              aria-label={filter.title}
              className="h-9 rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5"
            >
              <option value="">{filter.title}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        })}
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
            }}
            className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold text-muted transition-colors hover:text-foreground"
          >
            {t("reset")}
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasSelection && renderBulkActions && (
          <div className="flex items-center gap-2">
            {renderBulkActions(selectedRows.map((row) => row.original))}
          </div>
        )}
        {enableExport && (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/10 px-4 text-xs font-semibold text-muted transition-colors hover:border-black/30 hover:text-foreground dark:border-white/15 dark:hover:border-white/40"
          >
            <DownloadIcon className="size-3.5" />
            {t("export")}
          </button>
        )}
      </div>
    </div>
  );
}
