import { DashboardRepository } from "@/lib/repositories/dashboard.repository";

export const DashboardService = {
  async fetchHistory() {
    return await DashboardRepository.getTransferHistory();
  },

  async fetchGroups() {
    return await DashboardRepository.getGroups();
  },
};
