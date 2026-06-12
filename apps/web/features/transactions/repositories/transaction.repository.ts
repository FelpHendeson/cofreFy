import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getMonthDateRange } from "../utils/transaction-formatters";
import type {
  TransactionListFilters,
  TransactionWithCategory,
} from "../types/transaction.types";

function buildWhere(filters: TransactionListFilters): Prisma.TransactionWhereInput {
  const { start, end } = getMonthDateRange(filters.month, filters.year);
  const where: Prisma.TransactionWhereInput = {
    date: {
      gte: start,
      lte: end,
    },
  };

  if (filters.type && filters.type !== "ALL") {
    where.type = filters.type;
  }

  if (filters.categoryId && filters.categoryId !== "ALL") {
    where.categoryId = filters.categoryId;
  }

  if (filters.qualification && filters.qualification !== "ALL") {
    where.qualification = filters.qualification;
  }

  return where;
}

export const transactionRepository = {
  async findAll(filters: TransactionListFilters): Promise<TransactionWithCategory[]> {
    return prisma.transaction.findMany({
      where: buildWhere(filters),
      include: { category: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  },

  async findById(id: string): Promise<TransactionWithCategory | null> {
    return prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async create(data: Prisma.TransactionCreateInput): Promise<TransactionWithCategory> {
    return prisma.transaction.create({
      data,
      include: { category: true },
    });
  },

  async update(
    id: string,
    data: Prisma.TransactionUpdateInput,
  ): Promise<TransactionWithCategory> {
    return prisma.transaction.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  async delete(id: string): Promise<TransactionWithCategory> {
    return prisma.transaction.delete({
      where: { id },
      include: { category: true },
    });
  },

  async countByCategoryId(categoryId: string): Promise<number> {
    return prisma.transaction.count({ where: { categoryId } });
  },
};
