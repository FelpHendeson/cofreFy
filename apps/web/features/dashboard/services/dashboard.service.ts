import { buildDashboardData } from "../utils/dashboard-calculations";
import { dashboardRepository } from "../repositories/dashboard.repository";
import type { DashboardData } from "../types/dashboard.types";

export const dashboardService = {
  async getMonthlyDashboard(month: number, year: number): Promise<DashboardData> {
    const transactions = await dashboardRepository.findTransactionsByMonth(month, year);

    return buildDashboardData(transactions, { month, year });
  },
};
