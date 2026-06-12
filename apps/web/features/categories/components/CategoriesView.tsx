"use client";

import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CategoryFilterType } from "../types/category.types";
import { Button } from "@/components/ui/Button";
import { CategoryFilters } from "./CategoryFilters";
import { CategoryFormModal } from "./CategoryFormModal";
import { CategoryList } from "./CategoryList";

type CategoriesViewProps = {
  categories: Category[];
  filterType: CategoryFilterType;
};

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; category: Category };

export function CategoriesView({ categories, filterType }: CategoriesViewProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  function handleSuccess() {
    router.refresh();
  }

  function closeModal() {
    setModal({ mode: "closed" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CategoryFilters currentType={filterType} />

        <Button type="button" onClick={() => setModal({ mode: "create" })}>
          Criar categoria
        </Button>
      </div>

      <CategoryList
        categories={categories}
        onEdit={(category) => setModal({ mode: "edit", category })}
      />

      <CategoryFormModal
        open={modal.mode !== "closed"}
        category={modal.mode === "edit" ? modal.category : undefined}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
