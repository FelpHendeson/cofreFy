import type { ExpenseQualification } from "@prisma/client";
import { expenseQualificationLabels } from "../utils/transaction-labels";

type TransactionQualificationBadgeProps = {
  qualification: ExpenseQualification | null;
};

export function TransactionQualificationBadge({
  qualification,
}: TransactionQualificationBadgeProps) {
  if (!qualification) {
    return <span className="text-slate-400">—</span>;
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {expenseQualificationLabels[qualification]}
    </span>
  );
}
