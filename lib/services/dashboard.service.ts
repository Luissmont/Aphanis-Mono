import { DashboardRepository } from "@/lib/repositories/dashboard.repository";

export const DashboardService = {
  async fetchHistory(userId: string) {
    return await DashboardRepository.getTransferHistory(userId);
  },

  async fetchGroups(userId: string) {
    return await DashboardRepository.getGroups(userId);
  },

  async createGroup(userId: string, name: string, emails: string[]) {
    const group = await DashboardRepository.insertGroup(userId, name);

    if (emails && emails.length > 0) {
      const membersData = emails.map((email) => ({ group_id: group.id, email }));
      await DashboardRepository.insertGroupMembers(membersData);
    }

    return { ...group, membersCount: emails?.length ?? 0 };
  },
};
