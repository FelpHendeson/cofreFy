import type { CategoryBalanceItem } from "../types/monthly-balance.types";
import {
  formatBalanceAmount,
  formatBalancePercentage,
} from "../utils/monthly-balance-formatters";

type CategoryBalanceSummaryProps = {
  title: string;
  items: CategoryBalanceItem[];
  emptyMessage: string;
};

export function CategoryBalanceSummary({
  title,
  items,
  emptyMessage,
}: CategoryBalanceSummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Categoria</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Quantidade</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Total</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Percentual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={`${item.type}-${item.categoryId}`}>
                  <td className="px-3 py-3 text-slate-900">{item.categoryName}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {item.count}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {formatBalanceAmount(item.total)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {formatBalancePercentage(item.percentage)}
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
