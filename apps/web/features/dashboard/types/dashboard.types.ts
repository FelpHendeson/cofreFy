import type { TransactionType } from "@prisma/client";

export type MonthPeriod = {
  month: number;
  year: number;
};

export type MonthSituation = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type DashboardSummary = {
  totalIncome: string;
  totalExpense: string;
  balance: string;
  situation: MonthSituation;
  expensePercentage: number;
  savingsPercentage: number;
  hasMovements: boolean;
};

export type CategoryExpenseItem = {
  categoryId: string;
  categoryName: string;
  total: string;
  percentage: number;
};

export type QualificationExpenseItem = {
  qualificationKey: string;
  qualificationLabel: string;
  total: string;
  percentage: number;
};

export type BiggestExpenseItem = {
  id: string;
  description: string;
  amount: string;
  categoryName: string;
  date: string;
};

export type TopExpenseCategoryItem = {
  categoryId: string;
  categoryName: string;
  total: string;
  percentage: number;
};

export type RecentTransactionItem = {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  categoryName: string;
  amount: string;
};

export type DashboardData = {
  period: MonthPeriod;
  summary: DashboardSummary;
  expensesByCategory: CategoryExpenseItem[];
  expensesByQualification: QualificationExpenseItem[];
  biggestExpense: BiggestExpenseItem | null;
  topExpenseCategory: TopExpenseCategoryItem | null;
  recentTransactions: RecentTransactionItem[];
};
