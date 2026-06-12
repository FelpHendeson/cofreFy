import { formatDate } from "@/features/transactions/utils/transaction-formatters";
import type { CreditItem } from "../types/monthly-balance.types";
import { formatBalanceAmount } from "../utils/monthly-balance-formatters";

type CreditsTableProps = {
  credits: CreditItem[];
};

export function CreditsTable({ credits }: CreditsTableProps) {
  return (
    <section className="rounded-xl border border-emerald-200/60 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-800">Créditos</h2>

      {credits.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhum crédito registrado neste mês.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Data</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Descrição</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Categoria</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Pagamento</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Observações</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {credits.map((credit) => (
                <tr key={credit.id}>
                  <td className="px-3 py-3 text-slate-600">{formatDate(credit.date)}</td>
                  <td className="px-3 py-3 text-slate-900">{credit.description}</td>
                  <td className="px-3 py-3 text-slate-600">{credit.categoryName}</td>
                  <td className="px-3 py-3 text-slate-600">{credit.paymentMethodLabel ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-500">{credit.notes ?? "—"}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-emerald-700">
                    {formatBalanceAmount(credit.amount)}
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
