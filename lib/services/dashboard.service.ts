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

  async updateGroup(userId: string, groupId: string, name: string, emails: string[]) {
    const existingGroup = await DashboardRepository.getGroupByIdAndUser(userId, groupId);
    if (!existingGroup) {
      throw new Error("Grupo no encontrado o no autorizado");
    }

    const group = await DashboardRepository.updateGroup(userId, groupId, name);

    await DashboardRepository.deleteGroupMembers(groupId);

    if (emails && emails.length > 0) {
      const membersData = emails.map((email) => ({ group_id: groupId, email }));
      await DashboardRepository.insertGroupMembers(membersData);
    }

    return { ...group, membersCount: emails?.length ?? 0 };
  },

  async deleteGroup(userId: string, groupId: string): Promise<void> {
    const existingGroup = await DashboardRepository.getGroupByIdAndUser(userId, groupId);
    if (!existingGroup) {
      throw new Error("Grupo no encontrado o no autorizado");
    }

    await DashboardRepository.deleteGroupMembers(groupId);
    await DashboardRepository.deleteGroup(userId, groupId);
  },
};
