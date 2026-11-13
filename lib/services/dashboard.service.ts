import { DashboardRepository } from "@/lib/repositories/dashboard.repository";

export const DashboardService = {
  async fetchHistory(userId: string) {
    return await DashboardRepository.getTransferHistory(userId);
  },

  async fetchGroups(userId: string) {
    return await DashboardRepository.getGroups(userId);
  },
};
