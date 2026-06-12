import { formatAmount } from "@/features/transactions/utils/transaction-formatters";
import type { BalanceSituation } from "../types/monthly-balance.types";

export const situationLabels: Record<BalanceSituation, string> = {
  POSITIVE: "Fechamento positivo",
  NEUTRAL: "Fechamento neutro",
  NEGATIVE: "Fechamento negativo",
};

export function formatBalanceAmount(value: string): string {
  return formatAmount(value);
}

export function formatBalancePercentage(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function getSituationClasses(situation: BalanceSituation): string {
  switch (situation) {
    case "POSITIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "NEGATIVE":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}
