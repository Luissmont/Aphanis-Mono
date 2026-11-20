import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface CreateTransferData {
  accessCode: string;
  pinHash: string;
  maxOpens: number;
  expiresAt: string;
  contentType: string;
  encryptedBlob: string;
  userId: string;
}

interface TransferInfo {
  status: string;
  expires_at: string;
  transfer_contents: {
    content_type: string;
    metadata: Record<string, unknown> | null;
  }[];
}

interface TransferWithPinHash {
  status: string;
  expires_at: string;
  pin_hash: string;
}

interface RpcResult {
  is_valid: boolean;
  transfer_id?: string;
  encrypted_blob?: string;
}

export const TransfersRepository = {
  async createTransfer(data: CreateTransferData): Promise<void> {
    const supabaseServer = await createSupabaseServerClient();

    const { data: transfer, error: transferError } = await supabaseServer
      .from("transfers")
      .insert({
        access_code: data.accessCode,
        pin_hash: data.pinHash,
        max_opens: data.maxOpens,
        expires_at: data.expiresAt,
        user_id: data.userId,
      })
      .select()
      .single();

    if (transferError) {
      throw new Error(transferError.message);
    }

    const { error: contentError } = await supabaseServer
      .from("transfer_contents")
      .insert({
        transfer_id: transfer.id,
        content_type: data.contentType,
        encrypted_blob: data.encryptedBlob,
      });

    if (contentError) {
      throw new Error(contentError.message);
    }
  },

  async getTransferByCode(accessCode: string): Promise<TransferInfo> {
    const { data, error } = await supabase
      .rpc("get_public_transfer_info", { p_access_code: accessCode })
      .single();

    if (error || !data) {
      throw new Error("Transferencia no encontrada");
    }

    return data as TransferInfo;
  },

  async getTransferWithPinHash(accessCode: string): Promise<TransferWithPinHash> {
    const { data, error } = await supabase
      .from("transfers")
      .select("status, expires_at, pin_hash")
      .eq("access_code", accessCode)
      .single();

    if (error || !data) {
      throw new Error("Transferencia no encontrada");
    }

    return data as TransferWithPinHash;
  },

  async executeUnlock(accessCode: string): Promise<string> {
    const { data, error } = await supabase
      .rpc("process_transfer_opening", {
        p_access_code: accessCode,
      })
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const result = data as RpcResult;

    if (!result || !result.is_valid || !result.encrypted_blob) {
      throw new Error("Transferencia destruida o inválida");
    }

    return result.encrypted_blob;
  },
};
