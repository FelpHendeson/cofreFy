import type { Category, TransactionType } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
import type { TransactionWithCategory } from "@/features/transactions/types/transaction.types";

export function decimal(value: number): Decimal {
  return { toNumber: () => value } as Decimal;
}

export function createCategoryFixture(overrides: Partial<Category> = {}): Category {
  return {
    id: "cat-1",
    name: "Alimentação",
    type: "EXPENSE",
    color: null,
    icon: null,
    isDefault: false,
    isActive: true,
    createdAt: new Date("2026-01-01T12:00:00"),
    updatedAt: new Date("2026-01-01T12:00:00"),
    ...overrides,
  };
}

export function createTransactionFixture(
  overrides: Partial<TransactionWithCategory> & {
    type?: TransactionType;
    amount?: number;
  } = {},
): TransactionWithCategory {
  const category = overrides.category ?? createCategoryFixture();
  const amountValue = overrides.amount ?? 100;

  const base: TransactionWithCategory = {
    id: "tx-1",
    type: "EXPENSE",
    description: "Movimentação teste",
    amount: decimal(amountValue),
    date: new Date("2026-06-15T12:00:00"),
    categoryId: category.id,
    qualification: null,
    paymentMethod: null,
    notes: null,
    isRecurring: false,
    createdAt: new Date("2026-06-15T12:00:00"),
    updatedAt: new Date("2026-06-15T12:00:00"),
    category,
  };

  const merged = { ...base, ...overrides, category, amount: decimal(amountValue) };

  return merged;
}
