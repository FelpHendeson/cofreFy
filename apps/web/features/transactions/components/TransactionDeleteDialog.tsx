"use client";

import type { TransactionWithCategory } from "../types/transaction.types";
import { formatAmount, formatDate } from "../utils/transaction-formatters";
import { TransactionDialog } from "./TransactionDialog";

type TransactionDeleteDialogProps = {
  open: boolean;
  transaction?: TransactionWithCategory;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function TransactionDeleteDialog({
  open,
  transaction,
  isPending,
  onClose,
  onConfirm,
}: TransactionDeleteDialogProps) {
  if (!transaction) {
    return null;
  }

  return (
    <TransactionDialog
      open={open}
      title="Excluir movimentação"
      description="Esta ação não pode ser desfeita."
      onClose={onClose}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Deseja excluir a movimentação{" "}
          <span className="font-medium text-slate-900">
            &quot;{transaction.description}&quot;
          </span>{" "}
          de{" "}
          <span className="font-medium text-slate-900">
            {formatAmount(transaction.amount)}
          </span>{" "}
          em{" "}
          <span className="font-medium text-slate-900">
            {formatDate(transaction.date)}
          </span>
          ?
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Excluindo..." : "Excluir movimentação"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </TransactionDialog>
  );
}
