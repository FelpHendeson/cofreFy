import { formatDate } from "@/features/transactions/utils/transaction-formatters";
import type { BiggestExpenseItem } from "../types/dashboard.types";
import { formatDashboardAmount } from "../utils/dashboard-formatters";

type BiggestExpenseCardProps = {
  expense: BiggestExpenseItem | null;
};

export function BiggestExpenseCard({ expense }: BiggestExpenseCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Maior gasto do mês</h2>

      {!expense ? (
        <p className="mt-4 text-sm text-slate-500">Nenhuma saída registrada neste mês.</p>
      ) : (
        <div className="mt-4 space-y-2">
          <p className="text-base font-medium text-slate-900">{expense.description}</p>
          <p className="text-2xl font-semibold tabular-nums text-red-700">
            {formatDashboardAmount(expense.amount)}
          </p>
          <p className="text-sm text-slate-600">{expense.categoryName}</p>
          <p className="text-sm text-slate-500">{formatDate(expense.date)}</p>
        </div>
      )}
    </section>
  );
}
