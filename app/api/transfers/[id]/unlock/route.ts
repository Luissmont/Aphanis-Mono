import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pinHash: string | undefined = body.pin_hash;

    if (!pinHash) {
      return NextResponse.json({ error: "pin_hash is required" }, { status: 400 });
    }

    const encryptedBlob = await TransfersService.unlockTransfer(id, pinHash);
    return NextResponse.json({ encrypted_blob: encryptedBlob });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 410 });
  }
}
