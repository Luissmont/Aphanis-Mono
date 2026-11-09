import { NextResponse } from "next/server";
import { TransfersService } from "@/lib/services/transfers.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const accessCode = await TransfersService.processNewTransfer(body);
    return NextResponse.json({ access_code: accessCode }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
