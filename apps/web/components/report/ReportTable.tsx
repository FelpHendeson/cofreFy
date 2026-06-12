import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

export type ReportColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  cell: (row: T) => ReactNode;
  cellClassName?: string;
};

type ReportTableProps<T> = {
  columns: ReportColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
};

export function ReportTable<T>({ columns, rows, getRowKey }: ReportTableProps<T>) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-3 py-2 font-medium text-slate-600",
                  column.align === "right" ? "text-right" : "text-left",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-3 py-3",
                    column.align === "right" ? "text-right tabular-nums" : "text-left",
                    column.cellClassName,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
