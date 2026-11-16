import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";
import { AuthService } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { encrypted_blob, content_type, max_opens, expires_in_hours, pin_hash, recipients } = body;

    const accessCode = await TransfersService.processNewTransfer({
      encryptedBlob: encrypted_blob,
      contentType: content_type,
      maxOpens: max_opens,
      expiresInHours: expires_in_hours,
      pinHash: pin_hash,
      recipients,
      userId: user.id,
    });

    return NextResponse.json({ access_code: accessCode }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
