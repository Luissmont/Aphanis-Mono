import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTransferEmails(recipients: string[], accessCode: string): Promise<void> {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
  const transferUrl = `${appUrl}/${accessCode}`;

  await Promise.all(
    recipients.map((email) =>
      resend.emails.send({
        from: "APHANIS <onboarding@resend.dev>",
        to: email,
        subject: "Tienes un nuevo paquete cifrado esperándote 🔐",
        html: `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
            <tr>
              <td style="padding:36px 40px 24px;border-bottom:1px solid #2a2a2a;">
                <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:2px;">APHANIS</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 28px;">
                <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#ffffff;">Has recibido un envío seguro</p>
                <p style="margin:0 0 28px;font-size:14px;color:#a0a0a0;line-height:1.6;">
                  Alguien te ha enviado un paquete cifrado a través de APHANIS. El contenido está protegido con cifrado de extremo a extremo y solo tú puedes abrirlo.
                </p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background-color:#6366f1;">
                      <a href="${transferUrl}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                        Ver paquete cifrado
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;font-size:12px;color:#606060;line-height:1.6;">
                  O copia este enlace en tu navegador:<br/>
                  <span style="color:#818cf8;">${transferUrl}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px 28px;background-color:#141414;border-top:1px solid #2a2a2a;">
                <p style="margin:0;font-size:12px;color:#606060;line-height:1.6;">
                  <strong style="color:#a0a0a0;">Nota de seguridad:</strong> El remitente te proporcionará el PIN de descifrado por un canal seguro separado. APHANIS nunca envía el PIN por correo electrónico.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
      })
    )
  );
}

export async function sendOtpEmail(email: string, otp: string, accessCode: string): Promise<void> {
  await resend.emails.send({
    from: "APHANIS <onboarding@resend.dev>",
    to: email,
    subject: `Tu código de verificación para el paquete ${accessCode}: ${otp} 🔐`,
    html: `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
            <tr>
              <td style="padding:36px 40px 24px;border-bottom:1px solid #2a2a2a;">
                <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:2px;">APHANIS</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 28px;">
                <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#ffffff;">Código de verificación</p>
                <p style="margin:0 0 28px;font-size:14px;color:#a0a0a0;line-height:1.6;">
                  Usa este código de 6 dígitos para validar tu correo y acceder a la transferencia ${accessCode}:
                </p>
                <div style="background-color:#141414;border:1px solid #333;border-radius:8px;padding:20px;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;color:#ccff00;font-family:monospace;">
                  ${otp}
                </div>
                <p style="margin:28px 0 0;font-size:12px;color:#606060;line-height:1.6;">
                  Este código es de un solo uso y expirará en breve.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  });
}
