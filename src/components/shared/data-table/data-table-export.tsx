import type { Column, RowData } from "@tanstack/react-table";

import type { Features } from "./data-table-types";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv<TData extends RowData>(
  filename: string,
  rows: TData[],
  columns: Column<Features, TData, unknown>[],
) {
  const headers = columns.map((col) => col.id);
  const csvRows = [headers.join(",")];

  for (const row of rows) {
    const values = columns.map((col) => {
      const value = (row as Record<string, unknown>)[col.id];
      return escapeCsvCell(value);
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
