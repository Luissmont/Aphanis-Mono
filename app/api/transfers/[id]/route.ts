import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transfer = await TransfersService.getTransferInfo(id);
    return NextResponse.json(transfer);
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;

    if (message === "Transferencia caducada") {
      return NextResponse.json({ error: message }, { status: 410 });
    }

    return NextResponse.json(
      { error: "Transferencia no encontrada" },
      { status: 404 }
    );
  }
}
