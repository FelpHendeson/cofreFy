import { Suspense } from "react";
import { CategoryBalanceSummary } from "@/features/monthly-balance/components/CategoryBalanceSummary";
import { CreditsTable } from "@/features/monthly-balance/components/CreditsTable";
import { DebitsTable } from "@/features/monthly-balance/components/DebitsTable";
import { MonthlyBalanceFilter } from "@/features/monthly-balance/components/MonthlyBalanceFilter";
import { MonthlyBalanceSummary } from "@/features/monthly-balance/components/MonthlyBalanceSummary";
import { PaymentMethodSummary } from "@/features/monthly-balance/components/PaymentMethodSummary";
import { QualificationBalanceSummary } from "@/features/monthly-balance/components/QualificationBalanceSummary";
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
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
            CofreFy
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Balancete Mensal</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Conferência estruturada dos créditos e débitos do mês selecionado.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-20 w-full max-w-md animate-pulse rounded-lg bg-slate-100 lg:w-80" />
          }
        >
          <MonthlyBalanceFilter period={data.period} />
        </Suspense>
      </div>

      {!data.summary.hasMovements && (
        <div className="mb-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Nenhuma movimentação encontrada para este mês.
        </div>
      )}

      <div className="space-y-6">
        <MonthlyBalanceSummary summary={data.summary} />

        <CreditsTable credits={data.credits} />
        <DebitsTable debits={data.debits} />

        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryBalanceSummary
            title="Entradas por categoria"
            items={data.incomesByCategory}
            emptyMessage="Nenhuma entrada registrada neste mês."
          />
          <CategoryBalanceSummary
            title="Saídas por categoria"
            items={data.expensesByCategory}
            emptyMessage="Nenhuma saída registrada neste mês."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PaymentMethodSummary items={data.byPaymentMethod} />
          <QualificationBalanceSummary items={data.debitsByQualification} />
        </div>
      </div>
    </div>
  );
}
