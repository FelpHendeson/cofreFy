import { Suspense } from "react";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthPeriodFilter } from "@/components/report/MonthPeriodFilter";
import { MonthlyBalanceContent } from "@/features/monthly-balance/components/MonthlyBalanceContent";
import { monthlyBalanceService } from "@/features/monthly-balance/services/monthly-balance.service";
import type { MonthPeriod } from "@/features/monthly-balance/types/monthly-balance.types";

type BalancePageProps = {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
};

function parseMonth(value?: string): number {
  const now = new Date();
  const parsed = value ? Number.parseInt(value, 10) : now.getMonth() + 1;

  if (Number.isNaN(parsed) || parsed < 1 || parsed > 12) {
    return now.getMonth() + 1;
  }

  return parsed;
}

function parseYear(value?: string): number {
  const now = new Date();
  const parsed = value ? Number.parseInt(value, 10) : now.getFullYear();

  if (Number.isNaN(parsed) || parsed < 2000 || parsed > 2100) {
    return now.getFullYear();
  }

  return parsed;
}

function buildPeriod(params: { month?: string; year?: string }): MonthPeriod {
  return {
    month: parseMonth(params.month),
    year: parseYear(params.year),
  };
}

export default async function BalancePage({ searchParams }: BalancePageProps) {
  const params = await searchParams;
  const period = buildPeriod(params);
  const data = await monthlyBalanceService.getMonthlyBalance(period.month, period.year);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <PageHeader
        title="Balancete Mensal"
        description="Conferência estruturada dos créditos e débitos do mês selecionado."
        actions={
          <Suspense
            fallback={
              <div className="h-20 w-full max-w-md animate-pulse rounded-lg bg-slate-100 lg:w-80" />
            }
          >
            <MonthPeriodFilter period={data.period} basePath="/balance" idPrefix="balance" />
          </Suspense>
        }
      />

      {!data.summary.hasMovements && (
        <EmptyState message="Nenhuma movimentação encontrada para este mês." />
      )}

      <MonthlyBalanceContent data={data} />
    </div>
  );
}
