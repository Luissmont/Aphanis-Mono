import { AuthRepository } from "@/lib/repositories/auth.repository";
import type { User } from "@supabase/supabase-js";

export const AuthService = {
  async getCurrentUser(): Promise<User | null> {
    return await AuthRepository.getCurrentUser();
  },
};
