import { TransfersRepository } from "@/lib/repositories/transfers.repository";

interface ProcessNewTransferParams {
  encryptedBlob: string;
  contentType: string;
  maxOpens: number;
  expiresInHours: number;
}

export const TransfersService = {
  async processNewTransfer(params: ProcessNewTransferParams): Promise<string> {
    const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const hours = params.expiresInHours ?? 24;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    await TransfersRepository.createTransfer({
      accessCode,
      pinHash: "hash_placeholder",
      maxOpens: params.maxOpens,
      expiresAt,
      contentType: params.contentType,
      encryptedBlob: params.encryptedBlob,
    });

    return accessCode;
  },
};
