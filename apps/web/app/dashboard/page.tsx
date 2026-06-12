import { Suspense } from "react";
import { BiggestExpenseCard } from "@/features/dashboard/components/BiggestExpenseCard";
import { CategoryExpenseSummary } from "@/features/dashboard/components/CategoryExpenseSummary";
import { DashboardMonthFilter } from "@/features/dashboard/components/DashboardMonthFilter";
import { DashboardSummaryCards } from "@/features/dashboard/components/DashboardSummaryCards";
import { QualificationExpenseSummary } from "@/features/dashboard/components/QualificationExpenseSummary";
import { RecentTransactionsList } from "@/features/dashboard/components/RecentTransactionsList";
import { TopExpenseCategoryCard } from "@/features/dashboard/components/TopExpenseCategoryCard";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";
import type { MonthPeriod } from "@/features/dashboard/types/dashboard.types";

type DashboardPageProps = {
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

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const period = buildPeriod(params);
  const data = await dashboardService.getMonthlyDashboard(period.month, period.year);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
            CofreFy
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard Mensal</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Visão resumida das entradas, saídas e indicadores do mês selecionado.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-20 w-full max-w-md animate-pulse rounded-lg bg-slate-100 lg:w-80" />
          }
        >
          <DashboardMonthFilter period={data.period} />
        </Suspense>
      </div>

      {!data.summary.hasMovements && (
        <div className="mb-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Nenhuma movimentação encontrada para este mês.
        </div>
      )}

      <div className="space-y-6">
        <DashboardSummaryCards summary={data.summary} />

        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryExpenseSummary items={data.expensesByCategory} />
          <QualificationExpenseSummary items={data.expensesByQualification} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BiggestExpenseCard expense={data.biggestExpense} />
          <TopExpenseCategoryCard category={data.topExpenseCategory} />
        </div>

        <RecentTransactionsList transactions={data.recentTransactions} />
      </div>
    </div>
  );
}
