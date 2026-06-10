import type { CategoryType } from "@prisma/client";
import type { CategoryFilterType } from "../types/category.types";

export const categoryTypeLabels: Record<CategoryType, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
  BOTH: "Ambos",
};

export const categoryFilterOptions: { value: CategoryFilterType; label: string }[] =
  [
    { value: "ALL", label: "Todas" },
    { value: "INCOME", label: "Entrada" },
    { value: "EXPENSE", label: "Saída" },
    { value: "BOTH", label: "Ambos" },
  ];
