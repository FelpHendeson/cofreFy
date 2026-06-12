import { prisma } from "@/lib/prisma";
import type { TransactionWithCategory } from "@/features/transactions/types/transaction.types";
import { getMonthlyBalanceDateRange } from "../utils/monthly-balance-date-range";

export const monthlyBalanceRepository = {
  async findTransactionsByMonth(
    month: number,
    year: number,
  ): Promise<TransactionWithCategory[]> {
    const { start, exclusiveEnd } = getMonthlyBalanceDateRange(month, year);

    return prisma.transaction.findMany({
      where: {
        date: {
          gte: start,
          lt: exclusiveEnd,
        },
      },
      include: { category: true },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    });
  },
};
