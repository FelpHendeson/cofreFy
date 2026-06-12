import type { TransactionWithCategory } from "../types/transaction.types";

export type SerializedTransactionWithCategory = Omit<
  TransactionWithCategory,
  "amount" | "date" | "createdAt" | "updatedAt"
> & {
  amount: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeTransaction(
  transaction: TransactionWithCategory,
): SerializedTransactionWithCategory {
  return {
    ...transaction,
    amount: transaction.amount.toString(),
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

export function serializeTransactions(
  transactions: TransactionWithCategory[],
): SerializedTransactionWithCategory[] {
  return transactions.map(serializeTransaction);
}
