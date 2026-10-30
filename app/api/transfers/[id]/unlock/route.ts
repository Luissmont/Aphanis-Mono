import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.pin_hash) {
    return NextResponse.json(
      { error: "PIN incorrecto o faltante" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id,
    encrypted_blob: "U2FsdGVkX19+mock+encrypted+data+aphanis+payload+2026==",
  });
}

