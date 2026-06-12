import { formatAmount } from "@/features/transactions/utils/transaction-formatters";
import type { MonthSituation } from "../types/dashboard.types";

export const situationLabels: Record<MonthSituation, string> = {
  POSITIVE: "Mês positivo",
  NEUTRAL: "Mês neutro",
  NEGATIVE: "Mês negativo",
};

export function formatDashboardAmount(value: string): string {
  return formatAmount(value);
}

export function formatDashboardPercentage(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function getSituationClasses(situation: MonthSituation): string {
  switch (situation) {
    case "POSITIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "NEGATIVE":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}
