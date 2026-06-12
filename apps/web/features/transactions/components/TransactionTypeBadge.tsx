import type { TransactionType } from "@prisma/client";
import { transactionTypeLabels } from "../utils/transaction-labels";

type TransactionTypeBadgeProps = {
  type: TransactionType;
};

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        type === "INCOME"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {transactionTypeLabels[type]}
    </span>
  );
}
