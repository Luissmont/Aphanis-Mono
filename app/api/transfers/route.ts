import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { encrypted_blob, content_type, max_opens, expires_in_hours, recipients } = body;
    const accessCode = await TransfersService.processNewTransfer({
      encryptedBlob: encrypted_blob,
      contentType: content_type,
      maxOpens: max_opens,
      expiresInHours: expires_in_hours,
      recipients,
    });
    return NextResponse.json({ access_code: accessCode }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
