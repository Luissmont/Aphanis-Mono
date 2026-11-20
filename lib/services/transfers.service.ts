import { randomBytes } from "node:crypto";
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
  transfer_contents: {
    content_type: string;
    metadata: Record<string, unknown> | null;
  }[];
}

interface AttemptRecord {
  count: number;
  blockedUntil: number;
}

const unlockAttempts = new Map<string, AttemptRecord>();

export const TransfersService = {
  async processNewTransfer(params: ProcessNewTransferParams): Promise<string> {
    const accessCode = randomBytes(4).toString("hex").toUpperCase();
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
      try {
        await sendTransferEmails(params.recipients, accessCode);
      } catch (emailError) {
        console.error("Error enviando notificaciones:", emailError);
      }
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
    const now = Date.now();
    const attempt = unlockAttempts.get(accessCode);

    if (attempt && attempt.blockedUntil > now) {
      throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
    }

    const transfer = await TransfersRepository.getTransferWithPinHash(accessCode);

    if (transfer.status !== "active" || new Date(transfer.expires_at).getTime() <= now) {
      throw new Error("Transferencia caducada");
    }

    if (transfer.pin_hash !== incomingPinHash) {
      const currentCount =
        attempt?.blockedUntil && attempt.blockedUntil <= now
          ? 1
          : (attempt?.count ?? 0) + 1;
      const blockedUntil = currentCount >= 5 ? now + 15 * 60 * 1000 : 0;
      unlockAttempts.set(accessCode, { count: currentCount, blockedUntil });

      if (blockedUntil > now) {
        throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
      }
      throw new Error("Invalid PIN");
    }

    unlockAttempts.delete(accessCode);

    const encryptedBlob = await TransfersRepository.executeUnlock(accessCode);
    return encryptedBlob;
  },
};
