import { categoryService } from "@/features/categories/services/category.service";
import { TransactionsView } from "@/features/transactions/components/TransactionsView";
import {
  expenseQualificationSchema,
  transactionTypeSchema,
} from "@/features/transactions/schemas/transaction.schema";
import { transactionService } from "@/features/transactions/services/transaction.service";
import type {
  TransactionFilterType,
  TransactionListFilters,
  TransactionQualificationFilter,
} from "@/features/transactions/types/transaction.types";

type TransactionsPageProps = {
  searchParams: Promise<{
    month?: string;
    year?: string;
    type?: string;
    categoryId?: string;
    qualification?: string;
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

function parseType(value?: string): TransactionFilterType | undefined {
  if (!value || value === "ALL") {
    return undefined;
  }

  const parsed = transactionTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

function parseCategoryId(value?: string): string | undefined {
  if (!value || value === "ALL") {
    return undefined;
  }

  return value;
}

function parseQualification(value?: string): TransactionQualificationFilter | undefined {
  if (!value || value === "ALL") {
    return undefined;
  }

  const parsed = expenseQualificationSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

function buildFilters(params: {
  month?: string;
  year?: string;
  type?: string;
  categoryId?: string;
  qualification?: string;
}): TransactionListFilters {
  return {
    month: parseMonth(params.month),
    year: parseYear(params.year),
    type: parseType(params.type),
    categoryId: parseCategoryId(params.categoryId),
    qualification: parseQualification(params.qualification),
  };
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);

  const [transactions, categories] = await Promise.all([
    transactionService.list(filters),
    categoryService.list("ALL"),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
          CofreFy
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Movimentações</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Registre, edite e filtre entradas e saídas financeiras vinculadas às categorias.
        </p>
      </div>

      <TransactionsView
        transactions={transactions}
        categories={categories}
        filters={filters}
      />
    </div>
  );
}
