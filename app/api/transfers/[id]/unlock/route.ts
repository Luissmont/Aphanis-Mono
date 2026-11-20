import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pinHash: unknown = body.pin_hash;

    if (typeof pinHash !== "string" || !/^[a-f0-9]{64}$/i.test(pinHash)) {
      return NextResponse.json(
        { error: "pin_hash es requerido y debe ser SHA-256 válido" },
        { status: 400 }
      );
    }

    const encryptedBlob = await TransfersService.unlockTransfer(id, pinHash);
    return NextResponse.json({ encrypted_blob: encryptedBlob });
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;

    if (message === "Demasiados intentos fallidos. Intenta más tarde.") {
      return NextResponse.json({ error: message }, { status: 429 });
    }

    if (
      message === "Transferencia caducada" ||
      message === "Transferencia destruida o inválida"
    ) {
      return NextResponse.json({ error: message }, { status: 410 });
    }

    if (message === "Invalid PIN") {
      return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Transferencia no disponible o no encontrada" },
      { status: 404 }
    );
  }
}
