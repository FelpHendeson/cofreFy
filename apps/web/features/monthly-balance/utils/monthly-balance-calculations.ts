import type { Decimal } from "@prisma/client/runtime/library";
import type { TransactionWithCategory } from "@/features/transactions/types/transaction.types";
import {
  expenseQualificationLabels,
  paymentMethodLabels,
} from "@/features/transactions/utils/transaction-labels";
import type {
  BalanceSituation,
  CategoryBalanceItem,
  CreditItem,
  DebitItem,
  MonthlyBalanceData,
  MonthlyBalanceSummary,
  MonthPeriod,
  PaymentMethodBalanceItem,
  QualificationBalanceItem,
} from "../types/monthly-balance.types";

const UNQUALIFIED_KEY = "UNQUALIFIED";
const UNQUALIFIED_LABEL = "Não qualificado";
const UNINFORMED_PAYMENT_KEY = "UNINFORMED";
const UNINFORMED_PAYMENT_LABEL = "Não informado";

function amountToNumber(amount: Decimal): number {
  return amount.toNumber();
}

function formatMoneyValue(value: number): string {
  return value.toFixed(2);
}

function sumAmounts(transactions: TransactionWithCategory[]): number {
  return transactions.reduce((sum, transaction) => sum + amountToNumber(transaction.amount), 0);
}

function calculatePercentage(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return (part / total) * 100;
}

function resolveSituation(finalBalance: number): BalanceSituation {
  if (finalBalance > 0) {
    return "POSITIVE";
  }

  if (finalBalance < 0) {
    return "NEGATIVE";
  }

  return "NEUTRAL";
}

function getPaymentMethodLabel(
  paymentMethod: TransactionWithCategory["paymentMethod"],
): string | null {
  if (!paymentMethod) {
    return null;
  }

  return paymentMethodLabels[paymentMethod];
}

function buildSummary(
  transactions: TransactionWithCategory[],
  credits: TransactionWithCategory[],
  debits: TransactionWithCategory[],
  totalCredits: number,
  totalDebits: number,
  finalBalance: number,
): MonthlyBalanceSummary {
  return {
    totalCredits: formatMoneyValue(totalCredits),
    totalDebits: formatMoneyValue(totalDebits),
    finalBalance: formatMoneyValue(finalBalance),
    situation: resolveSituation(finalBalance),
    creditsCount: credits.length,
    debitsCount: debits.length,
    totalMovementsCount: transactions.length,
    hasMovements: transactions.length > 0,
  };
}

function buildCredits(credits: TransactionWithCategory[]): CreditItem[] {
  return credits.map((transaction) => ({
    id: transaction.id,
    date: transaction.date.toISOString(),
    description: transaction.description,
    categoryName: transaction.category.name,
    amount: formatMoneyValue(amountToNumber(transaction.amount)),
    paymentMethodLabel: getPaymentMethodLabel(transaction.paymentMethod),
    notes: transaction.notes,
  }));
}

function buildDebits(debits: TransactionWithCategory[]): DebitItem[] {
  return debits.map((transaction) => ({
    id: transaction.id,
    date: transaction.date.toISOString(),
    description: transaction.description,
    categoryName: transaction.category.name,
    amount: formatMoneyValue(amountToNumber(transaction.amount)),
    qualificationLabel: transaction.qualification
      ? expenseQualificationLabels[transaction.qualification]
      : null,
    paymentMethodLabel: getPaymentMethodLabel(transaction.paymentMethod),
    notes: transaction.notes,
  }));
}

function buildByCategory(
  transactions: TransactionWithCategory[],
  type: CategoryBalanceItem["type"],
  typeTotal: number,
): CategoryBalanceItem[] {
  const totals = new Map<string, { categoryName: string; count: number; total: number }>();

  for (const transaction of transactions) {
    const current = totals.get(transaction.categoryId);

    if (current) {
      current.count += 1;
      current.total += amountToNumber(transaction.amount);
      continue;
    }

    totals.set(transaction.categoryId, {
      categoryName: transaction.category.name,
      count: 1,
      total: amountToNumber(transaction.amount),
    });
  }

  return Array.from(totals.entries())
    .map(([categoryId, item]) => ({
      categoryId,
      categoryName: item.categoryName,
      type,
      count: item.count,
      total: formatMoneyValue(item.total),
      percentage: calculatePercentage(item.total, typeTotal),
    }))
    .sort((left, right) => Number(right.total) - Number(left.total));
}

function buildByPaymentMethod(
  transactions: TransactionWithCategory[],
): PaymentMethodBalanceItem[] {
  const totals = new Map<string, { label: string; count: number; total: number }>();

  for (const transaction of transactions) {
    const paymentMethodKey = transaction.paymentMethod ?? UNINFORMED_PAYMENT_KEY;
    const paymentMethodLabel = transaction.paymentMethod
      ? paymentMethodLabels[transaction.paymentMethod]
      : UNINFORMED_PAYMENT_LABEL;

    const current = totals.get(paymentMethodKey);

    if (current) {
      current.count += 1;
      current.total += amountToNumber(transaction.amount);
      continue;
    }

    totals.set(paymentMethodKey, {
      label: paymentMethodLabel,
      count: 1,
      total: amountToNumber(transaction.amount),
    });
  }

  return Array.from(totals.entries())
    .map(([paymentMethodKey, item]) => ({
      paymentMethodKey,
      paymentMethodLabel: item.label,
      count: item.count,
      total: formatMoneyValue(item.total),
    }))
    .sort((left, right) => Number(right.total) - Number(left.total));
}

function buildDebitsByQualification(
  debits: TransactionWithCategory[],
  totalDebits: number,
): QualificationBalanceItem[] {
  const totals = new Map<string, { label: string; count: number; total: number }>();

  for (const transaction of debits) {
    const qualificationKey = transaction.qualification ?? UNQUALIFIED_KEY;
    const qualificationLabel = transaction.qualification
      ? expenseQualificationLabels[transaction.qualification]
      : UNQUALIFIED_LABEL;

    const current = totals.get(qualificationKey);

    if (current) {
      current.count += 1;
      current.total += amountToNumber(transaction.amount);
      continue;
    }

    totals.set(qualificationKey, {
      label: qualificationLabel,
      count: 1,
      total: amountToNumber(transaction.amount),
    });
  }

  return Array.from(totals.entries())
    .map(([qualificationKey, item]) => ({
      qualificationKey,
      qualificationLabel: item.label,
      count: item.count,
      total: formatMoneyValue(item.total),
      percentage: calculatePercentage(item.total, totalDebits),
    }))
    .sort((left, right) => Number(right.total) - Number(left.total));
}

export function buildMonthlyBalanceData(
  transactions: TransactionWithCategory[],
  period: MonthPeriod,
): MonthlyBalanceData {
  const credits = transactions.filter((transaction) => transaction.type === "INCOME");
  const debits = transactions.filter((transaction) => transaction.type === "EXPENSE");

  const totalCredits = sumAmounts(credits);
  const totalDebits = sumAmounts(debits);
  const finalBalance = totalCredits - totalDebits;

  return {
    period,
    summary: buildSummary(
      transactions,
      credits,
      debits,
      totalCredits,
      totalDebits,
      finalBalance,
    ),
    credits: buildCredits(credits),
    debits: buildDebits(debits),
    incomesByCategory: buildByCategory(credits, "INCOME", totalCredits),
    expensesByCategory: buildByCategory(debits, "EXPENSE", totalDebits),
    byPaymentMethod: buildByPaymentMethod(transactions),
    debitsByQualification: buildDebitsByQualification(debits, totalDebits),
  };
}
