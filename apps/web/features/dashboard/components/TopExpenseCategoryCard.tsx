import type { TopExpenseCategoryItem } from "../types/dashboard.types";
import {
  formatDashboardAmount,
  formatDashboardPercentage,
} from "../utils/dashboard-formatters";

type TopExpenseCategoryCardProps = {
  category: TopExpenseCategoryItem | null;
};

export function TopExpenseCategoryCard({ category }: TopExpenseCategoryCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Categoria com maior gasto</h2>

      {!category ? (
        <p className="mt-4 text-sm text-slate-500">Nenhuma saída registrada neste mês.</p>
      ) : (
        <div className="mt-4 space-y-2">
          <p className="text-base font-medium text-slate-900">{category.categoryName}</p>
          <p className="text-2xl font-semibold tabular-nums text-red-700">
            {formatDashboardAmount(category.total)}
          </p>
          <p className="text-sm text-slate-600">
            {formatDashboardPercentage(category.percentage)} do total de saídas
          </p>
        </div>
      )}
    </section>
  );
}
