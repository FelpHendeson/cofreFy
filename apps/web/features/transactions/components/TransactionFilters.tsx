"use client";

import type { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  TransactionFilterType,
  TransactionListFilters,
  TransactionQualificationFilter,
} from "../types/transaction.types";
import {
  monthLabels,
  qualificationFilterOptions,
  transactionTypeFilterOptions,
} from "../utils/transaction-labels";

type TransactionFiltersProps = {
  filters: TransactionListFilters;
  categories: Category[];
};

export function TransactionFilters({ filters, categories }: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategories = categories.filter((category) => category.isActive);
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, index) => currentYear - 3 + index);

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/transactions?${query}` : "/transactions");
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div>
        <label htmlFor="month-filter" className="mb-1 block text-sm font-medium text-slate-700">
          Mês
        </label>
        <select
          id="month-filter"
          value={filters.month}
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
        <label htmlFor="year-filter" className="mb-1 block text-sm font-medium text-slate-700">
          Ano
        </label>
        <select
          id="year-filter"
          value={filters.year}
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

      <div>
        <label htmlFor="type-filter" className="mb-1 block text-sm font-medium text-slate-700">
          Tipo
        </label>
        <select
          id="type-filter"
          value={filters.type ?? "ALL"}
          onChange={(event) =>
            updateParam("type", event.target.value as TransactionFilterType)
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {transactionTypeFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="category-filter"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Categoria
        </label>
        <select
          id="category-filter"
          value={filters.categoryId ?? "ALL"}
          onChange={(event) => updateParam("categoryId", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="ALL">Todas</option>
          {activeCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="qualification-filter"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Qualificação
        </label>
        <select
          id="qualification-filter"
          value={filters.qualification ?? "ALL"}
          onChange={(event) =>
            updateParam(
              "qualification",
              event.target.value as TransactionQualificationFilter,
            )
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {qualificationFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
