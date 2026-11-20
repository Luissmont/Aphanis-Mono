import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { supabase } from "@/lib/supabase";
import { sendOtpEmail } from "@/lib/services/email.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
      console.error("Error en request_transfer_otp:", error);
    }

    if (isAuthorized) {
      try {
        const { error: resendError } = await sendOtpEmail(
          email,
          otp,
          accessCode
        );
        if (resendError) {
          console.error("Resend API Error al enviar OTP:", resendError);
          return NextResponse.json({
            sent: false,
            warning:
              "El código fue generado pero Resend rechazó el envío (posible restricción de cuenta gratuita en modo prueba: solo se permite enviar a correos verificados).",
          });
        }
      } catch (emailError) {
        console.error("Error enviando OTP via Resend:", emailError);
        return NextResponse.json({
          sent: false,
          warning:
            "Ocurrió un error al intentar enviar el correo mediante Resend.",
        });
      }
      return NextResponse.json({ sent: true });
    }

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
