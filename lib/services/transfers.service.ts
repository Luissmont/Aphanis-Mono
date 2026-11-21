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

export const TransfersService = {
  async processNewTransfer(
    params: ProcessNewTransferParams
  ): Promise<ProcessTransferResult> {
    const hours = params.expiresInHours ?? 24;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    let accessCode = "";
    let inserted = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!inserted && attempts < maxAttempts) {
      attempts++;
      accessCode = randomBytes(6).toString("hex").toUpperCase();
      try {
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
        inserted = true;
      } catch (err) {
        const msg = (err as Error).message || "";
        if (
          (/unique/i.test(msg) || /23505/i.test(msg) || /duplicate/i.test(msg)) &&
          attempts < maxAttempts
        ) {
          continue;
        }
        throw err;
      }
    }

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
    return TransfersRepository.verifyAndUnlockTransfer(
      accessCode,
      email,
      otpCode,
      pinHash
    );
  },

  async unlockAuthenticatedTransfer(
    accessCode: string,
    userEmail: string,
    pinHash: string
  ): Promise<string> {
    return TransfersRepository.unlockTransferAuthenticated(
      accessCode,
      userEmail,
      pinHash
    );
  },
};
