"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { CategoryFilterType } from "../types/category.types";
import { categoryFilterOptions } from "../utils/category-labels";

type CategoryFiltersProps = {
  currentType?: CategoryFilterType;
};

export function CategoryFilters({ currentType = "ALL" }: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilterChange(value: CategoryFilterType) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "ALL") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    const query = params.toString();
    router.push(query ? `/categories?${query}` : "/categories");
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="category-type-filter" className="text-sm font-medium text-slate-700">
        Filtrar por tipo
      </label>
      <select
        id="category-type-filter"
        value={currentType}
        onChange={(event) =>
          handleFilterChange(event.target.value as CategoryFilterType)
        }
        className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {categoryFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
