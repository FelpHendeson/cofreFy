"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteTransactionAction } from "../actions/transaction.actions";
import type { SerializedTransactionWithCategory } from "../utils/transaction-serializer";
import { formatDate } from "../utils/transaction-formatters";
import { paymentMethodLabels } from "../utils/transaction-labels";
import { TransactionAmount } from "./TransactionAmount";
import { TransactionDeleteDialog } from "./TransactionDeleteDialog";
import { TransactionQualificationBadge } from "./TransactionQualificationBadge";
import { TransactionTypeBadge } from "./TransactionTypeBadge";

type TransactionListProps = {
  transactions: SerializedTransactionWithCategory[];
  onEdit: (transaction: SerializedTransactionWithCategory) => void;
};

type ActionFeedback = {
  message: string;
  success: boolean;
};

type DeleteState =
  | { mode: "closed" }
  | { mode: "confirm"; transaction: SerializedTransactionWithCategory };

export function TransactionList({ transactions, onEdit }: TransactionListProps) {
  const router = useRouter();
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>({ mode: "closed" });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!actionFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => setActionFeedback(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [actionFeedback]);

  function handleDeleteConfirm() {
    if (deleteState.mode !== "confirm") {
      return;
    }

    setActionFeedback(null);

    startTransition(async () => {
      const result = await deleteTransactionAction(deleteState.transaction.id);

      setActionFeedback({
        message:
          result.message ??
          (result.success
            ? "Movimentação excluída com sucesso."
            : "Não foi possível excluir a movimentação."),
        success: result.success,
      });

      if (result.success) {
        setDeleteState({ mode: "closed" });
        router.refresh();
      }
    });
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Nenhuma movimentação encontrada para os filtros selecionados. Crie sua primeira
        movimentação para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionFeedback && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg border px-4 py-3 text-sm ${
            actionFeedback.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {actionFeedback.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Data</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Descrição</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Categoria</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Valor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Qualificação</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Pagamento</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Recorrente</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{transaction.description}</div>
                  {transaction.notes && (
                    <p className="mt-0.5 text-xs text-slate-500">{transaction.notes}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <TransactionTypeBadge type={transaction.type} />
                </td>
                <td className="px-4 py-3 text-slate-600">{transaction.category.name}</td>
                <td className="px-4 py-3">
                  <TransactionAmount amount={transaction.amount} type={transaction.type} />
                </td>
                <td className="px-4 py-3">
                  <TransactionQualificationBadge qualification={transaction.qualification} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {transaction.paymentMethod
                    ? paymentMethodLabels[transaction.paymentMethod]
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {transaction.isRecurring ? "Sim" : "Não"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteState({ mode: "confirm", transaction })
                      }
                      className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionDeleteDialog
        open={deleteState.mode === "confirm"}
        transaction={
          deleteState.mode === "confirm" ? deleteState.transaction : undefined
        }
        isPending={isPending}
        onClose={() => setDeleteState({ mode: "closed" })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
