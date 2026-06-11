"use client";

import type { Category } from "@prisma/client";
import { CategoryDialog } from "./CategoryDialog";
import { CategoryForm } from "./CategoryForm";

type CategoryFormModalProps = {
  open: boolean;
  category?: Category;
  onClose: () => void;
  onSuccess: () => void;
};

export function CategoryFormModal({
  open,
  category,
  onClose,
  onSuccess,
}: CategoryFormModalProps) {
  const isEditing = !!category;

  function handleSuccess() {
    onSuccess();
    onClose();
  }

  return (
    <CategoryDialog
      open={open}
      title={isEditing ? "Editar categoria" : "Criar categoria"}
      description={
        isEditing
          ? "Altere os dados da categoria selecionada."
          : "Preencha os campos para adicionar uma nova categoria."
      }
      onClose={onClose}
    >
      <CategoryForm
        key={category?.id ?? "create"}
        category={category}
        variant="modal"
        onCancel={onClose}
        onSuccess={handleSuccess}
      />
    </CategoryDialog>
  );
}
