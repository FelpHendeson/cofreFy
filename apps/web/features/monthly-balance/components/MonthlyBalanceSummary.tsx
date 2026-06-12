import type { MonthlyBalanceSummary as MonthlyBalanceSummaryData } from "../types/monthly-balance.types";
import {
  formatBalanceAmount,
  getSituationClasses,
  situationLabels,
} from "../utils/monthly-balance-formatters";

type MonthlyBalanceSummaryProps = {
  summary: MonthlyBalanceSummaryData;
};

export function MonthlyBalanceSummary({ summary }: MonthlyBalanceSummaryProps) {
  const balanceClassName =
    summary.situation === "POSITIVE"
      ? "text-emerald-700"
      : summary.situation === "NEGATIVE"
        ? "text-red-700"
        : "text-slate-700";

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Total de créditos</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-700">
            {formatBalanceAmount(summary.totalCredits)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Total de débitos</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-red-700">
            {formatBalanceAmount(summary.totalDebits)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Saldo final</p>
          <p className={`mt-2 text-2xl font-semibold tabular-nums ${balanceClassName}`}>
            {formatBalanceAmount(summary.finalBalance)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Situação do mês</p>
          <span
            className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getSituationClasses(summary.situation)}`}
          >
            {situationLabels[summary.situation]}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Item</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 text-slate-900">Total de créditos</td>
              <td className="px-4 py-3 text-right tabular-nums text-emerald-700">
                {formatBalanceAmount(summary.totalCredits)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-900">Total de débitos</td>
              <td className="px-4 py-3 text-right tabular-nums text-red-700">
                {formatBalanceAmount(summary.totalDebits)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-900">Saldo final</td>
              <td className={`px-4 py-3 text-right font-medium tabular-nums ${balanceClassName}`}>
                {formatBalanceAmount(summary.finalBalance)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-900">Quantidade de créditos</td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                {summary.creditsCount}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-900">Quantidade de débitos</td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                {summary.debitsCount}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-900">Total de movimentações</td>
              <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-700">
                {summary.totalMovementsCount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
