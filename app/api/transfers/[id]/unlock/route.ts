import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";
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

    let encryptedBlob: string;

    if (
      typeof email === "string" &&
      typeof otpCode === "string" &&
      email.trim() &&
      otpCode.trim()
    ) {
      encryptedBlob = await TransfersService.unlockPublicTransfer(
        id,
        email.trim().toLowerCase(),
        otpCode.trim(),
        pinHash
      );
    } else {
      const user = await AuthService.getCurrentUser();
      if (!user || !user.email) {
        return NextResponse.json(
          { error: "Se requiere sesión activa para el desbloqueo autenticado" },
          { status: 401 }
        );
      }

      encryptedBlob = await TransfersService.unlockAuthenticatedTransfer(
        id,
        user.email.trim().toLowerCase(),
        pinHash
      );
    }

    return NextResponse.json({ encrypted_blob: encryptedBlob });
  } catch (error) {
    console.error(error);
    const message = (error as Error).message || "";

    if (message === "Demasiados intentos fallidos. Intenta más tarde.") {
      return NextResponse.json({ error: message }, { status: 429 });
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
