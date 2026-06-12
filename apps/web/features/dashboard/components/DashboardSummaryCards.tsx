import type { DashboardSummary } from "../types/dashboard.types";
import {
  formatDashboardAmount,
  formatDashboardPercentage,
  getSituationClasses,
  situationLabels,
} from "../utils/dashboard-formatters";

type DashboardSummaryCardsProps = {
  summary: DashboardSummary;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  const cards = [
    {
      label: "Total de entradas",
      value: formatDashboardAmount(summary.totalIncome),
      className: "text-emerald-700",
    },
    {
      label: "Total de saídas",
      value: formatDashboardAmount(summary.totalExpense),
      className: "text-red-700",
    },
    {
      label: "Saldo final",
      value: formatDashboardAmount(summary.balance),
      className:
        summary.situation === "POSITIVE"
          ? "text-emerald-700"
          : summary.situation === "NEGATIVE"
            ? "text-red-700"
            : "text-slate-700",
    },
    {
      label: "Situação do mês",
      value: situationLabels[summary.situation],
      className: "",
      badge: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-600">{card.label}</p>
            {card.badge ? (
              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getSituationClasses(summary.situation)}`}
              >
                {card.value}
              </span>
            ) : (
              <p className={`mt-2 text-2xl font-semibold tabular-nums ${card.className}`}>
                {card.value}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Renda comprometida</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {formatDashboardPercentage(summary.expensePercentage)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Percentual economizado</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {formatDashboardPercentage(summary.savingsPercentage)}
          </p>
        </div>
      </div>
    </div>
  );
}
