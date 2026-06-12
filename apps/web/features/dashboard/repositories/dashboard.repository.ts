import { prisma } from "@/lib/prisma";
import type { TransactionWithCategory } from "@/features/transactions/types/transaction.types";
import { getDashboardMonthDateRange } from "../utils/dashboard-date-range";

export const dashboardRepository = {
  async findTransactionsByMonth(
    month: number,
    year: number,
  ): Promise<TransactionWithCategory[]> {
    const { start, exclusiveEnd } = getDashboardMonthDateRange(month, year);

    return prisma.transaction.findMany({
      where: {
        date: {
          gte: start,
          lt: exclusiveEnd,
        },
      },
      include: { category: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  },
};
