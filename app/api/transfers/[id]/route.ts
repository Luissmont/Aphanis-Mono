import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    id,
    status: "active",
    content_type: "file",
    metadata: {
      name: "informe_auditoria_2025.pdf",
      size: "12.4 MB",
    },
  });
}

