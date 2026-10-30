import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const mockTransfer = {
    id: "tr_mock_982341",
    access_code: "APH-1234",
    status: "active",
    current_opens: 0,
    max_opens: body.max_opens ?? 3,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    message: "Transferencia creada exitosamente",
  };

  return NextResponse.json(mockTransfer, { status: 201 });
}

