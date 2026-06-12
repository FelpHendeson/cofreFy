import type { CategoryExpenseItem } from "../types/dashboard.types";
import {
  formatDashboardAmount,
  formatDashboardPercentage,
} from "../utils/dashboard-formatters";

type CategoryExpenseSummaryProps = {
  items: CategoryExpenseItem[];
};

export function CategoryExpenseSummary({ items }: CategoryExpenseSummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Saídas por categoria</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhuma saída registrada neste mês.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Categoria</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Total</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Percentual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.categoryId}>
                  <td className="px-3 py-3 text-slate-900">{item.categoryName}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {formatDashboardAmount(item.total)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {formatDashboardPercentage(item.percentage)}
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
