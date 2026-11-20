import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";
import { TransfersRepository } from "@/lib/repositories/transfers.repository";
import { AuthService } from "@/lib/services/auth.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rawId = (await params).id;
    const id = (rawId || "").trim().toUpperCase();
    const body = await request.json();
    const pinHash: unknown = body.pin_hash;
    const email: unknown = body.email;
    const otpCode: unknown = body.otp_code;

    if (typeof pinHash !== "string" || !/^[a-f0-9]{64}$/i.test(pinHash)) {
      return NextResponse.json(
        { error: "pin_hash es requerido y debe ser SHA-256 válido" },
        { status: 400 }
      );
    }

    const transferInfo = await TransfersRepository.getTransferByCode(id).catch(
      () => null
    );

    let encryptedBlob: string;

    if (
      typeof email === "string" &&
      typeof otpCode === "string" &&
      email.trim() &&
      otpCode.trim()
    ) {
      encryptedBlob = await TransfersService.unlockTransfer(
        id,
        pinHash,
        email.trim().toLowerCase(),
        otpCode.trim()
      );
    } else {
      const user = await AuthService.getCurrentUser().catch(() => null);
      if (user?.email) {
        try {
          encryptedBlob = await TransfersService.unlockAuthenticatedTransfer(
            id,
            user.email.trim().toLowerCase(),
            pinHash
          );
        } catch (authErr) {
          const msg = (authErr as Error).message || "";
          if (/UNAUTHORIZED_EMAIL|INVALID_OTP/i.test(msg)) {
            encryptedBlob = await TransfersService.unlockTransfer(
              id,
              pinHash,
              null,
              null
            );
          } else {
            throw authErr;
          }
        }
      } else {
        encryptedBlob = await TransfersService.unlockTransfer(
          id,
          pinHash,
          null,
          null
        );
      }
    }

    return NextResponse.json({
      encrypted_blob: encryptedBlob,
      expires_at: transferInfo?.expires_at || null,
    });
  } catch (error) {
    console.error(error);
    const message = (error as Error).message || "";

    if (/TOO_MANY_ATTEMPTS|bloqueada|Demasiados intentos/i.test(message)) {
      return NextResponse.json(
        { error: "Demasiados intentos fallidos. Transferencia bloqueada temporalmente por 15 minutos." },
        { status: 429 }
      );
    }

    if (/GONE|NOT_FOUND|caducada|destruida|no encontrada/i.test(message)) {
      return NextResponse.json(
        { error: "Este paquete ya fue autodestruido o ha expirado" },
        { status: 410 }
      );
    }

    if (/INVALID_OTP|código de verificación/i.test(message)) {
      return NextResponse.json(
        { error: "Código de verificación incorrecto o expirado" },
        { status: 401 }
      );
    }

    if (/UNAUTHORIZED_EMAIL|no autorizado/i.test(message)) {
      return NextResponse.json(
        { error: "Correo no autorizado para este paquete" },
        { status: 403 }
      );
    }

    if (/INVALID_PIN|PIN incorrecto/i.test(message)) {
      return NextResponse.json(
        { error: "PIN de descifrado incorrecto" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "No fue posible desbloquear la transferencia" },
      { status: 400 }
    );
  }
}
