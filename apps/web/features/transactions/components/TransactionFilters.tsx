"use client";

import type { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterSelect } from "@/components/ui/FilterSelect";
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
      <FilterSelect
        id="month-filter"
        label="Mês"
        value={filters.month}
        onChange={(value) => updateParam("month", value)}
        options={monthLabels.map((label, index) => ({
          value: index + 1,
          label,
        }))}
      />

      <FilterSelect
        id="year-filter"
        label="Ano"
        value={filters.year}
        onChange={(value) => updateParam("year", value)}
        options={yearOptions.map((year) => ({
          value: year,
          label: String(year),
        }))}
      />

      <FilterSelect
        id="type-filter"
        label="Tipo"
        value={filters.type ?? "ALL"}
        onChange={(value) => updateParam("type", value as TransactionFilterType)}
        options={transactionTypeFilterOptions}
      />

      <FilterSelect
        id="category-filter"
        label="Categoria"
        value={filters.categoryId ?? "ALL"}
        onChange={(value) => updateParam("categoryId", value)}
        options={[
          { value: "ALL", label: "Todas" },
          ...activeCategories.map((category) => ({
            value: category.id,
            label: category.name,
          })),
        ]}
      />

      <FilterSelect
        id="qualification-filter"
        label="Qualificação"
        value={filters.qualification ?? "ALL"}
        onChange={(value) =>
          updateParam("qualification", value as TransactionQualificationFilter)
        }
        options={qualificationFilterOptions}
      />
    </div>
  );
}
