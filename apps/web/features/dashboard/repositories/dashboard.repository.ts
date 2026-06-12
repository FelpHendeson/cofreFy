import { prisma } from "@/lib/prisma";
import { getMonthDateRange } from "@/features/transactions/utils/transaction-formatters";
import type { TransactionWithCategory } from "@/features/transactions/types/transaction.types";

export const dashboardRepository = {
  async findTransactionsByMonth(
    month: number,
    year: number,
  ): Promise<TransactionWithCategory[]> {
    const { start, end } = getMonthDateRange(month, year);

    return prisma.transaction.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: { category: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  },
};
