import { supabase } from "@/lib/supabase";

interface CreateTransferData {
  accessCode: string;
  pinHash: string;
  maxOpens: number;
  expiresAt: string;
  contentType: string;
  encryptedBlob: string;
}

export const TransfersRepository = {
  async createTransfer(data: CreateTransferData): Promise<void> {
    const { data: transfer, error: transferError } = await supabase
      .from("transfers")
      .insert({
        access_code: data.accessCode,
        pin_hash: data.pinHash,
        max_opens: data.maxOpens,
        expires_at: data.expiresAt,
      })
      .select()
      .single();

    if (transferError) {
      throw new Error(transferError.message);
    }

    const { error: contentError } = await supabase
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
};
