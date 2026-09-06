"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type ExpandedState,
  flexRender,
  type PaginationState,
  type RowData,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DataTablePagination } from "./data-table-pagination";
import type { DataTableFilter } from "./data-table-toolbar";
import { DataTableToolbar } from "./data-table-toolbar";
import { type Features, features } from "./data-table-types";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<Features, TData, unknown>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  enableSelection?: boolean;
  enableExport?: boolean;
  exportFilename?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  getSubRows?: (row: TData) => TData[] | undefined;
  renderBulkActions?: (rows: TData[]) => React.ReactNode;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  filters,
  enableSelection = false,
  enableExport = false,
  exportFilename,
  pageSizeOptions,
  defaultPageSize = 10,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
  onPaginationChange,
  onSortingChange,
  getSubRows,
  renderBulkActions,
}: DataTableProps<TData>) {
  const t = useTranslations("admin.dataTable");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const selectionColumn: ColumnDef<Features, TData, unknown> = {
    id: "select",
    header: ({ table }) => {
      const allSelected = table.getIsAllPageRowsSelected();
      return (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(event) =>
            table.toggleAllPageRowsSelected(event.target.checked)
          }
          aria-label={t("selectAll")}
          className="size-4 accent-accent"
        />
      );
    },
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(event) => row.toggleSelected(event.target.checked)}
        aria-label={t("selectRow")}
        className="size-4 accent-accent"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = enableSelection
    ? [selectionColumn, ...columns]
    : columns;

  const table = useTable({
    features,
    data,
    columns: tableColumns,
    pageCount: manualPagination ? pageCount : undefined,
    getSubRows,
    paginateExpandedRows: false,
    filterFromLeafRows: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      expanded,
    },
    enableRowSelection: enableSelection,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    manualPagination,
    manualSorting,
    manualFiltering,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        enableExport={enableExport}
        exportFilename={exportFilename}
        renderBulkActions={renderBulkActions}
      />
      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-black/10 dark:border-white/10"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="transition-colors hover:bg-black/[0.02] data-[state=selected]:bg-accent-soft/40 dark:hover:bg-white/[0.03]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="h-24 text-center text-muted"
                >
                  {t("noResults")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        enableSelection={enableSelection}
      />
    </div>
  );
}
