import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";
import { AuthService } from "@/lib/services/auth.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      encrypted_blob,
      content_type,
      max_opens,
      expires_in_hours,
      pin_hash,
      recipients,
    } = body;

    if (
      typeof encrypted_blob !== "string" ||
      !encrypted_blob.trim() ||
      encrypted_blob.length > 15_000_000
    ) {
      return NextResponse.json(
        { error: "encrypted_blob inválido o excede el límite permitido (10 MB)" },
        { status: 400 }
      );
    }

    if (content_type !== "text" && content_type !== "file") {
      return NextResponse.json(
        { error: "content_type debe ser 'text' o 'file'" },
        { status: 400 }
      );
    }

    if (
      typeof max_opens !== "number" ||
      !Number.isInteger(max_opens) ||
      max_opens < 1 ||
      max_opens > 20
    ) {
      return NextResponse.json(
        { error: "max_opens debe ser un entero entre 1 y 20" },
        { status: 400 }
      );
    }

    if (
      typeof expires_in_hours !== "number" ||
      expires_in_hours < 1 ||
      expires_in_hours > 168
    ) {
      return NextResponse.json(
        { error: "expires_in_hours debe ser entre 1 y 168 horas" },
        { status: 400 }
      );
    }

    if (typeof pin_hash !== "string" || !/^[a-f0-9]{64}$/i.test(pin_hash)) {
      return NextResponse.json(
        { error: "pin_hash debe ser un hash SHA-256 válido de 64 caracteres" },
        { status: 400 }
      );
    }

    let sanitizedRecipients: string[] = [];

    if (recipients !== undefined && recipients !== null) {
      if (!Array.isArray(recipients)) {
        return NextResponse.json(
          { error: "recipients debe ser una lista de correos" },
          { status: 400 }
        );
      }

      if (recipients.length > 30) {
        return NextResponse.json(
          { error: "No puedes incluir más de 30 destinatarios" },
          { status: 400 }
        );
      }

      const rawList = recipients
        .map((e: unknown) =>
          typeof e === "string" ? e.trim().toLowerCase() : ""
        )
        .filter(Boolean);

      const allValid = rawList.every((email: string) =>
        EMAIL_REGEX.test(email)
      );

      if (!allValid) {
        return NextResponse.json(
          {
            error:
              "Uno o más destinatarios no tienen un formato de correo válido",
          },
          { status: 400 }
        );
      }

      sanitizedRecipients = Array.from(new Set(rawList));
    }

    const result = await TransfersService.processNewTransfer({
      encryptedBlob: encrypted_blob,
      contentType: content_type,
      maxOpens: max_opens,
      expiresInHours: expires_in_hours,
      pinHash: pin_hash,
      recipients: sanitizedRecipients,
      userId: user.id,
    });

    return NextResponse.json(
      {
        access_code: result.accessCode,
        email_status: result.emailStatus,
        warning: result.emailStatus?.warning,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno al procesar la transferencia" },
      { status: 500 }
    );
  }
}
