import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { supabase } from "@/lib/supabase";
import { sendOtpEmail } from "@/lib/services/email.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    const rawId = (await params).id;
    const accessCode = (rawId || "").trim().toUpperCase();

    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Formato de correo inválido" },
        { status: 400 }
      );
    }

    const otp = randomInt(100000, 1000000).toString();

    const { data: isAuthorized, error } = await supabase.rpc(
      "request_transfer_otp",
      {
        p_access_code: accessCode,
        p_email: email,
        p_otp_code: otp,
      }
    );

    if (error) {
      const msg = error.message || "";
      if (/OTP_COOLDOWN/i.test(msg)) {
        return NextResponse.json(
          {
            error:
              "Debes esperar 60 segundos antes de solicitar otro código de verificación.",
          },
          { status: 429 }
        );
      }
      if (/MAX_OTP_EXCEEDED/i.test(msg)) {
        return NextResponse.json(
          {
            error:
              "Has alcanzado el límite máximo de solicitudes de código para esta transferencia.",
          },
          { status: 429 }
        );
      }
      if (/TOO_MANY_ATTEMPTS|bloqueada/i.test(msg)) {
        return NextResponse.json(
          {
            error:
              "Transferencia bloqueada temporalmente por demasiados intentos fallidos.",
          },
          { status: 429 }
        );
      }
      console.error("Error en request_transfer_otp:", error);
    }

    if (isAuthorized) {
      try {
        const { error: brevoError } = await sendOtpEmail(
          email,
          otp,
          accessCode
        );
        if (brevoError) {
          console.error("Brevo API Error al enviar OTP:", brevoError);
          return NextResponse.json({
            sent: false,
            warning:
              "El código fue generado pero el servicio de Brevo no pudo entregar el correo en este momento.",
          });
        }
      } catch (emailError) {
        console.error("Error enviando OTP via Brevo:", emailError);
        return NextResponse.json({
          sent: false,
          warning:
            "Ocurrió un error al intentar enviar el correo mediante Brevo.",
        });
      }
      return NextResponse.json({ sent: true });
    }

    await new Promise((r) =>
      setTimeout(r, Math.max(0, 400 - (Date.now() - startTime)))
    );

    return NextResponse.json({
      sent: true,
      message:
        "Si el correo está autorizado, recibirás un código de verificación.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al solicitar código de verificación" },
      { status: 500 }
    );
  }
}
