import type { CategoryType, TransactionType } from "@prisma/client";
import { categoryRepository } from "@/features/categories/repositories/category.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../schemas/transaction.schema";
import type { TransactionListFilters } from "../types/transaction.types";
import { parseAmountValue, parseDateValue } from "../utils/transaction-formatters";

function isCategoryCompatible(
  transactionType: TransactionType,
  categoryType: CategoryType,
): boolean {
  if (transactionType === "INCOME") {
    return categoryType === "INCOME" || categoryType === "BOTH";
  }

  return categoryType === "EXPENSE" || categoryType === "BOTH";
}

async function validateCategory(categoryId: string, transactionType: TransactionType) {
  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new Error("Categoria não encontrada.");
  }

  if (!category.isActive) {
    throw new Error("A categoria selecionada está inativa.");
  }

  if (!isCategoryCompatible(transactionType, category.type)) {
    throw new Error("Categoria incompatível com o tipo da movimentação.");
  }

  return category;
}

function buildTransactionData(input: CreateTransactionInput | UpdateTransactionInput) {
  const qualification = input.type === "INCOME" ? null : (input.qualification ?? null);

  return {
    type: input.type,
    description: input.description,
    amount: parseAmountValue(input.amount),
    date: parseDateValue(input.date),
    qualification,
    paymentMethod: input.paymentMethod ?? null,
    notes: input.notes ?? null,
    isRecurring: input.isRecurring ?? false,
  };
}

export const transactionService = {
  async list(filters: TransactionListFilters) {
    return transactionRepository.findAll(filters);
  },

  async create(input: CreateTransactionInput) {
    const category = await validateCategory(input.categoryId, input.type);

    return transactionRepository.create({
      ...buildTransactionData(input),
      category: { connect: { id: category.id } },
    });
  },

  async update(input: UpdateTransactionInput) {
    const existing = await transactionRepository.findById(input.id);

    if (!existing) {
      throw new Error("Movimentação não encontrada.");
    }

    const category = await validateCategory(input.categoryId, input.type);

    return transactionRepository.update(input.id, {
      ...buildTransactionData(input),
      category: { connect: { id: category.id } },
    });
  },

  async delete(id: string) {
    const existing = await transactionRepository.findById(id);

    if (!existing) {
      throw new Error("Movimentação não encontrada.");
    }

    return transactionRepository.delete(id);
  },
};
