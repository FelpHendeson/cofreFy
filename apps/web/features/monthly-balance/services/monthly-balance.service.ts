import { monthlyBalanceRepository } from "../repositories/monthly-balance.repository";
import { buildMonthlyBalanceData } from "../utils/monthly-balance-calculations";
import type { MonthlyBalanceData } from "../types/monthly-balance.types";

export const monthlyBalanceService = {
  async getMonthlyBalance(month: number, year: number): Promise<MonthlyBalanceData> {
    const transactions = await monthlyBalanceRepository.findTransactionsByMonth(month, year);

    return buildMonthlyBalanceData(transactions, { month, year });
  },
};
