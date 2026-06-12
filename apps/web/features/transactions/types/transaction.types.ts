import type {
  Category,
  ExpenseQualification,
  PaymentMethod,
  Transaction,
  TransactionType,
} from "@prisma/client";

export type { Transaction, TransactionType, ExpenseQualification, PaymentMethod };

export type TransactionWithCategory = Transaction & {
  category: Category;
};

export type TransactionFilterType = TransactionType | "ALL";

export type TransactionQualificationFilter = ExpenseQualification | "ALL";

export type TransactionListFilters = {
  month: number;
  year: number;
  type?: TransactionFilterType;
  categoryId?: string;
  qualification?: TransactionQualificationFilter;
};

export type TransactionActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
