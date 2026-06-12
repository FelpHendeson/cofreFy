"use client";

import type { Category } from "@prisma/client";
import { TransactionDialog } from "./TransactionDialog";
import { TransactionForm } from "./TransactionForm";
import type { TransactionWithCategory } from "../types/transaction.types";

type TransactionFormModalProps = {
  open: boolean;
  transaction?: TransactionWithCategory;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
};

export function TransactionFormModal({
  open,
  transaction,
  categories,
  onClose,
  onSuccess,
}: TransactionFormModalProps) {
  const isEditing = !!transaction;

  function handleSuccess() {
    onSuccess();
    onClose();
  }

  return (
    <TransactionDialog
      open={open}
      title={isEditing ? "Editar movimentação" : "Nova movimentação"}
      description={
        isEditing
          ? "Altere os dados da movimentação selecionada."
          : "Preencha os campos para registrar uma nova movimentação."
      }
      onClose={onClose}
    >
      <TransactionForm
        key={transaction?.id ?? "create"}
        transaction={transaction}
        categories={categories}
        onCancel={onClose}
        onSuccess={handleSuccess}
      />
    </TransactionDialog>
  );
}
