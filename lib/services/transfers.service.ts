import { randomBytes } from "node:crypto";
import { TransfersRepository } from "@/lib/repositories/transfers.repository";
import { sendTransferEmails } from "@/lib/services/email.service";

interface ProcessNewTransferParams {
  encryptedBlob: string;
  contentType: string;
  maxOpens: number;
  expiresInHours: number;
  pinHash: string;
  recipients: string[];
  userId: string;
}

interface ProcessTransferResult {
  accessCode: string;
  emailStatus?: {
    sent: boolean;
    warning?: string;
  };
}

interface TransferInfoResponse {
  status: string;
  expires_at: string;
  content_type?: string;
  requires_otp?: boolean;
  transfer_contents?: {
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
  async processNewTransfer(
    params: ProcessNewTransferParams
  ): Promise<ProcessTransferResult> {
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
      recipients: params.recipients || [],
    });

    let emailStatus: { sent: boolean; warning?: string } | undefined;

    if (params.recipients && params.recipients.length > 0) {
      try {
        emailStatus = await sendTransferEmails(params.recipients, accessCode);
      } catch (emailError) {
        console.error("Error enviando notificaciones:", emailError);
        emailStatus = {
          sent: false,
          warning: "Error inesperado al conectar con el servicio de correo.",
        };
      }
    }

    return { accessCode, emailStatus };
  },

  async getTransferInfo(accessCode: string): Promise<TransferInfoResponse> {
    const transfer = await TransfersRepository.getTransferByCode(accessCode);

    if (new Date(transfer.expires_at) < new Date()) {
      throw new Error("Transferencia caducada");
    }

    return transfer;
  },

  async unlockTransfer(
    accessCode: string,
    pinHash: string,
    email: string | null = null,
    otpCode: string | null = null
  ): Promise<string> {
    const now = Date.now();
    const attempt = unlockAttempts.get(accessCode);

    if (attempt && attempt.blockedUntil > now) {
      throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
    }

    try {
      const encryptedBlob = await TransfersRepository.verifyAndUnlockTransfer(
        accessCode,
        email,
        otpCode,
        pinHash
      );
      unlockAttempts.delete(accessCode);
      return encryptedBlob;
    } catch (err) {
      const msg = (err as Error).message || "";
      if (/INVALID_PIN/i.test(msg) || /pin incorrecto/i.test(msg)) {
        const currentCount =
          attempt?.blockedUntil && attempt.blockedUntil <= now
            ? 1
            : (attempt?.count ?? 0) + 1;
        const blockedUntil = currentCount >= 5 ? now + 15 * 60 * 1000 : 0;
        unlockAttempts.set(accessCode, { count: currentCount, blockedUntil });
        if (blockedUntil > now) {
          throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
        }
      }
      throw err;
    }
  },

  async unlockPublicTransfer(
    accessCode: string,
    email: string | null,
    otpCode: string | null,
    pinHash: string
  ): Promise<string> {
    return this.unlockTransfer(accessCode, pinHash, email, otpCode);
  },

  async unlockAuthenticatedTransfer(
    accessCode: string,
    userEmail: string,
    pinHash: string
  ): Promise<string> {
    const now = Date.now();
    const attempt = unlockAttempts.get(accessCode);

    if (attempt && attempt.blockedUntil > now) {
      throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
    }

    try {
      const encryptedBlob =
        await TransfersRepository.unlockTransferAuthenticated(
          accessCode,
          userEmail,
          pinHash
        );
      unlockAttempts.delete(accessCode);
      return encryptedBlob;
    } catch (err) {
      const msg = (err as Error).message || "";
      if (/INVALID_PIN/i.test(msg) || /pin incorrecto/i.test(msg)) {
        const currentCount =
          attempt?.blockedUntil && attempt.blockedUntil <= now
            ? 1
            : (attempt?.count ?? 0) + 1;
        const blockedUntil = currentCount >= 5 ? now + 15 * 60 * 1000 : 0;
        unlockAttempts.set(accessCode, { count: currentCount, blockedUntil });
        if (blockedUntil > now) {
          throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
        }
      }
      throw err;
    }
  },
};
