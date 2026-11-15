import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  async getTransferHistory(userId: string): Promise<TransferRecord[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("transfers")
      .select("id, access_code, status, created_at, expires_at, max_opens, current_opens")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as TransferRecord[];
  },

  async getGroups(userId: string): Promise<GroupRecord[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("groups")
      .select("id, name, created_at, group_members(email)")
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as GroupRecord[];
  },

  async insertGroup(userId: string, name: string): Promise<{ id: string; name: string; created_at: string }> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("groups")
      .insert({ user_id: userId, name })
      .select("id, name, created_at")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Error al crear el grupo");
    }

    return data as { id: string; name: string; created_at: string };
  },

  async insertGroupMembers(membersData: { group_id: string; email: string }[]): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("group_members").insert(membersData);

    if (error) {
      throw new Error(error.message);
    }
  },
};
