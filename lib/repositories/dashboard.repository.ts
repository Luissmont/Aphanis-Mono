import { supabase } from "@/lib/supabase";

interface TransferRecord {
  id: string;
  access_code: string;
  status: string;
  created_at: string;
  expires_at: string;
  max_opens: number;
  current_opens: number;
}

interface GroupRecord {
  id: string;
  name: string;
  created_at: string;
  group_members: { email: string }[];
}

export const DashboardRepository = {
  async getTransferHistory(): Promise<TransferRecord[]> {
    const { data, error } = await supabase
      .from("transfers")
      .select("id, access_code, status, created_at, expires_at, max_opens, current_opens")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as TransferRecord[];
  },

  async getGroups(): Promise<GroupRecord[]> {
    const { data, error } = await supabase
      .from("groups")
      .select("id, name, created_at, group_members(email)");

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as GroupRecord[];
  },
};
