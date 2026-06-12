import { formatDate } from "@/features/transactions/utils/transaction-formatters";
import type { DebitItem } from "../types/monthly-balance.types";
import { formatBalanceAmount } from "../utils/monthly-balance-formatters";

type DebitsTableProps = {
  debits: DebitItem[];
};

export function DebitsTable({ debits }: DebitsTableProps) {
  return (
    <section className="rounded-xl border border-red-200/60 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-red-800">Débitos</h2>

      {debits.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhum débito registrado neste mês.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Data</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Descrição</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Categoria</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Qualificação</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Pagamento</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Observações</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {debits.map((debit) => (
                <tr key={debit.id}>
                  <td className="px-3 py-3 text-slate-600">{formatDate(debit.date)}</td>
                  <td className="px-3 py-3 text-slate-900">{debit.description}</td>
                  <td className="px-3 py-3 text-slate-600">{debit.categoryName}</td>
                  <td className="px-3 py-3 text-slate-600">{debit.qualificationLabel ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{debit.paymentMethodLabel ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-500">{debit.notes ?? "—"}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-red-700">
                    {formatBalanceAmount(debit.amount)}
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
