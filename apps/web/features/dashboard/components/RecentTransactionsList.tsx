import { TransactionAmount } from "@/features/transactions/components/TransactionAmount";
import { TransactionTypeBadge } from "@/features/transactions/components/TransactionTypeBadge";
import { formatDate } from "@/features/transactions/utils/transaction-formatters";
import type { RecentTransactionItem } from "../types/dashboard.types";

type RecentTransactionsListProps = {
  transactions: RecentTransactionItem[];
};

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Movimentações recentes</h2>

      {transactions.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhuma movimentação encontrada para este mês.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Data</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Descrição</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Tipo</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Categoria</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-3 py-3 text-slate-600">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-3 py-3 text-slate-900">{transaction.description}</td>
                  <td className="px-3 py-3">
                    <TransactionTypeBadge type={transaction.type} />
                  </td>
                  <td className="px-3 py-3 text-slate-600">{transaction.categoryName}</td>
                  <td className="px-3 py-3 text-right">
                    <TransactionAmount amount={transaction.amount} type={transaction.type} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
