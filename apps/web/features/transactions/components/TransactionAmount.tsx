import type { Decimal } from "@prisma/client/runtime/library";
import type { TransactionType } from "@prisma/client";
import { formatAmount } from "../utils/transaction-formatters";

type TransactionAmountProps = {
  amount: Decimal | number | string;
  type: TransactionType;
};

export function TransactionAmount({ amount, type }: TransactionAmountProps) {
  const prefix = type === "INCOME" ? "+" : "-";

  return (
    <span
      className={`font-medium tabular-nums ${
        type === "INCOME" ? "text-emerald-700" : "text-red-700"
      }`}
    >
      {prefix} {formatAmount(amount)}
    </span>
  );
}
