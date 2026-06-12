import type { TransactionType } from "@prisma/client";

export type MonthPeriod = {
  month: number;
  year: number;
};

export type BalanceSituation = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type MonthlyBalanceSummary = {
  totalCredits: string;
  totalDebits: string;
  finalBalance: string;
  situation: BalanceSituation;
  creditsCount: number;
  debitsCount: number;
  totalMovementsCount: number;
  hasMovements: boolean;
};

export type CreditItem = {
  id: string;
  date: string;
  description: string;
  categoryName: string;
  amount: string;
  paymentMethodLabel: string | null;
  notes: string | null;
};

export type DebitItem = {
  id: string;
  date: string;
  description: string;
  categoryName: string;
  amount: string;
  qualificationLabel: string | null;
  paymentMethodLabel: string | null;
  notes: string | null;
};

export type CategoryBalanceItem = {
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  count: number;
  total: string;
  percentage: number;
};

export type PaymentMethodBalanceItem = {
  paymentMethodKey: string;
  paymentMethodLabel: string;
  count: number;
  total: string;
};

export type QualificationBalanceItem = {
  qualificationKey: string;
  qualificationLabel: string;
  count: number;
  total: string;
  percentage: number;
};

export type MonthlyBalanceData = {
  period: MonthPeriod;
  summary: MonthlyBalanceSummary;
  credits: CreditItem[];
  debits: DebitItem[];
  incomesByCategory: CategoryBalanceItem[];
  expensesByCategory: CategoryBalanceItem[];
  byPaymentMethod: PaymentMethodBalanceItem[];
  debitsByQualification: QualificationBalanceItem[];
};
