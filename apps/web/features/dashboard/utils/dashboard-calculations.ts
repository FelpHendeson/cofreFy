import type { Decimal } from "@prisma/client/runtime/library";
import type { TransactionWithCategory } from "@/features/transactions/types/transaction.types";
import { expenseQualificationLabels } from "@/features/transactions/utils/transaction-labels";
import type {
  BiggestExpenseItem,
  CategoryExpenseItem,
  DashboardData,
  DashboardSummary,
  MonthPeriod,
  MonthSituation,
  QualificationExpenseItem,
  RecentTransactionItem,
  TopExpenseCategoryItem,
} from "../types/dashboard.types";

const UNQUALIFIED_KEY = "UNQUALIFIED";
const UNQUALIFIED_LABEL = "Não qualificado";

function amountToNumber(amount: Decimal): number {
  return amount.toNumber();
}

function sumAmounts(transactions: TransactionWithCategory[]): number {
  return transactions.reduce((sum, transaction) => sum + amountToNumber(transaction.amount), 0);
}

function formatMoneyValue(value: number): string {
  return value.toFixed(2);
}

function calculatePercentage(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return (part / total) * 100;
}

function resolveSituation(balance: number): MonthSituation {
  if (balance > 0) {
    return "POSITIVE";
  }

  if (balance < 0) {
    return "NEGATIVE";
  }

  return "NEUTRAL";
}

function buildSummary(
  transactions: TransactionWithCategory[],
  totalIncome: number,
  totalExpense: number,
  balance: number,
): DashboardSummary {
  const expensePercentage = calculatePercentage(totalExpense, totalIncome);
  const savingsPercentage =
    totalIncome > 0 && balance > 0 ? calculatePercentage(balance, totalIncome) : 0;

  return {
    totalIncome: formatMoneyValue(totalIncome),
    totalExpense: formatMoneyValue(totalExpense),
    balance: formatMoneyValue(balance),
    situation: resolveSituation(balance),
    expensePercentage,
    savingsPercentage,
    hasMovements: transactions.length > 0,
  };
}

function buildExpensesByCategory(
  expenses: TransactionWithCategory[],
  totalExpense: number,
): CategoryExpenseItem[] {
  const totals = new Map<string, { categoryName: string; total: number }>();

  for (const expense of expenses) {
    const current = totals.get(expense.categoryId);

    if (current) {
      current.total += amountToNumber(expense.amount);
      continue;
    }

    totals.set(expense.categoryId, {
      categoryName: expense.category.name,
      total: amountToNumber(expense.amount),
    });
  }

  return Array.from(totals.entries())
    .map(([categoryId, item]) => ({
      categoryId,
      categoryName: item.categoryName,
      total: formatMoneyValue(item.total),
      percentage: calculatePercentage(item.total, totalExpense),
    }))
    .sort((left, right) => Number(right.total) - Number(left.total));
}

function buildExpensesByQualification(
  expenses: TransactionWithCategory[],
  totalExpense: number,
): QualificationExpenseItem[] {
  const totals = new Map<string, { label: string; total: number }>();

  for (const expense of expenses) {
    const qualificationKey = expense.qualification ?? UNQUALIFIED_KEY;
    const qualificationLabel = expense.qualification
      ? expenseQualificationLabels[expense.qualification]
      : UNQUALIFIED_LABEL;

    const current = totals.get(qualificationKey);

    if (current) {
      current.total += amountToNumber(expense.amount);
      continue;
    }

    totals.set(qualificationKey, {
      label: qualificationLabel,
      total: amountToNumber(expense.amount),
    });
  }

  return Array.from(totals.entries())
    .map(([qualificationKey, item]) => ({
      qualificationKey,
      qualificationLabel: item.label,
      total: formatMoneyValue(item.total),
      percentage: calculatePercentage(item.total, totalExpense),
    }))
    .sort((left, right) => Number(right.total) - Number(left.total));
}

function buildBiggestExpense(
  expenses: TransactionWithCategory[],
): BiggestExpenseItem | null {
  if (expenses.length === 0) {
    return null;
  }

  const biggest = expenses.reduce((current, candidate) =>
    amountToNumber(candidate.amount) > amountToNumber(current.amount) ? candidate : current,
  );

  return {
    id: biggest.id,
    description: biggest.description,
    amount: formatMoneyValue(amountToNumber(biggest.amount)),
    categoryName: biggest.category.name,
    date: biggest.date.toISOString(),
  };
}

function buildTopExpenseCategory(
  expensesByCategory: CategoryExpenseItem[],
): TopExpenseCategoryItem | null {
  if (expensesByCategory.length === 0) {
    return null;
  }

  const top = expensesByCategory[0];

  return {
    categoryId: top.categoryId,
    categoryName: top.categoryName,
    total: top.total,
    percentage: top.percentage,
  };
}

function buildRecentTransactions(
  transactions: TransactionWithCategory[],
): RecentTransactionItem[] {
  return transactions.slice(0, 5).map((transaction) => ({
    id: transaction.id,
    date: transaction.date.toISOString(),
    description: transaction.description,
    type: transaction.type,
    categoryName: transaction.category.name,
    amount: formatMoneyValue(amountToNumber(transaction.amount)),
  }));
}

export function buildDashboardData(
  transactions: TransactionWithCategory[],
  period: MonthPeriod,
): DashboardData {
  const income = transactions.filter((transaction) => transaction.type === "INCOME");
  const expenses = transactions.filter((transaction) => transaction.type === "EXPENSE");

  const totalIncome = sumAmounts(income);
  const totalExpense = sumAmounts(expenses);
  const balance = totalIncome - totalExpense;

  const expensesByCategory = buildExpensesByCategory(expenses, totalExpense);
  const expensesByQualification = buildExpensesByQualification(expenses, totalExpense);

  return {
    period,
    summary: buildSummary(transactions, totalIncome, totalExpense, balance),
    expensesByCategory,
    expensesByQualification,
    biggestExpense: buildBiggestExpense(expenses),
    topExpenseCategory: buildTopExpenseCategory(expensesByCategory),
    recentTransactions: buildRecentTransactions(transactions),
  };
}
