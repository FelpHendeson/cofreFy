"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterSelect } from "@/components/ui/FilterSelect";
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
    <FilterSelect
      id="category-type-filter"
      label="Filtrar por tipo"
      value={currentType}
      onChange={(value) => handleFilterChange(value as CategoryFilterType)}
      options={categoryFilterOptions}
      className="max-w-xs"
    />
  );
}
