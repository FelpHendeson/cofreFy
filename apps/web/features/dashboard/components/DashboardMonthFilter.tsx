"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { monthLabels } from "@/features/transactions/utils/transaction-labels";
import type { MonthPeriod } from "../types/dashboard.types";

type DashboardMonthFilterProps = {
  period: MonthPeriod;
};

export function DashboardMonthFilter({ period }: DashboardMonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, index) => currentYear - 3 + index);

  function updateParam(key: "month" | "year", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:max-w-md">
      <div>
        <label htmlFor="dashboard-month-filter" className="mb-1 block text-sm font-medium text-slate-700">
          Mês
        </label>
        <select
          id="dashboard-month-filter"
          value={period.month}
          onChange={(event) => updateParam("month", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {monthLabels.map((label, index) => (
            <option key={label} value={index + 1}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dashboard-year-filter" className="mb-1 block text-sm font-medium text-slate-700">
          Ano
        </label>
        <select
          id="dashboard-year-filter"
          value={period.year}
          onChange={(event) => updateParam("year", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
