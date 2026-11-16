import { TransfersRepository } from "@/lib/repositories/transfers.repository";
import { sendTransferEmails } from "@/lib/services/email.service";

interface ProcessNewTransferParams {
  encryptedBlob: string;
  contentType: string;
  maxOpens: number;
  expiresInHours: number;
  pinHash: string;
  recipients?: string[];
  userId: string;
}

interface TransferInfoResponse {
  status: string;
  expires_at: string;
  pin_hash: string;
  transfer_contents: {
    content_type: string;
    metadata: Record<string, unknown> | null;
  }[];
}

export const TransfersService = {
  async processNewTransfer(params: ProcessNewTransferParams): Promise<string> {
    const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const hours = params.expiresInHours ?? 24;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    await TransfersRepository.createTransfer({
      accessCode,
      pinHash: params.pinHash,
      maxOpens: params.maxOpens,
      expiresAt,
      contentType: params.contentType,
      encryptedBlob: params.encryptedBlob,
      userId: params.userId,
    });

    if (params.recipients && params.recipients.length > 0) {
      await sendTransferEmails(params.recipients, accessCode);
    }

    return accessCode;
  },

  async getTransferInfo(accessCode: string): Promise<TransferInfoResponse> {
    const transfer = await TransfersRepository.getTransferByCode(accessCode);

    if (new Date(transfer.expires_at) < new Date()) {
      throw new Error("Transferencia caducada");
    }

    return transfer;
  },

  async unlockTransfer(accessCode: string, incomingPinHash: string): Promise<string> {
    const transfer = await TransfersRepository.getTransferByCode(accessCode);

    if (transfer.pin_hash !== incomingPinHash) {
      throw new Error("Invalid PIN");
    }

    const encryptedBlob = await TransfersRepository.executeUnlock(accessCode);
    return encryptedBlob;
  },
};
