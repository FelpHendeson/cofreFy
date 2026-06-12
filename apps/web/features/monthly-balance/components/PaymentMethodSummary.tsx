import type { PaymentMethodBalanceItem } from "../types/monthly-balance.types";
import { formatBalanceAmount } from "../utils/monthly-balance-formatters";

type PaymentMethodSummaryProps = {
  items: PaymentMethodBalanceItem[];
};

export function PaymentMethodSummary({ items }: PaymentMethodSummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Por forma de pagamento</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhuma movimentação registrada neste mês.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600">
                  Forma de pagamento
                </th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Quantidade</th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.paymentMethodKey}>
                  <td className="px-3 py-3 text-slate-900">{item.paymentMethodLabel}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {item.count}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                    {formatBalanceAmount(item.total)}
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
