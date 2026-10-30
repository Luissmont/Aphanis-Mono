import { NextResponse } from "next/server";

export async function GET() {
  const mockHistory = [
    {
      id: "tr_hist_01",
      title: "Contratos_Finanzas_Q3.zip",
      content_type: "file",
      current_opens: 1,
      max_opens: 3,
      status: "active",
      created_at: "2026-10-28T14:22:00.000Z",
      expires_at: "2026-10-29T14:22:00.000Z",
    },
    {
      id: "tr_hist_02",
      title: "Credenciales de acceso a base de datos",
      content_type: "text",
      current_opens: 3,
      max_opens: 3,
      status: "destroyed",
      created_at: "2026-10-27T09:15:00.000Z",
      expires_at: "2026-10-28T09:15:00.000Z",
    },
    {
      id: "tr_hist_03",
      title: "informe_auditoria_2025.pdf",
      content_type: "file",
      current_opens: 2,
      max_opens: 5,
      status: "active",
      created_at: "2026-10-26T18:40:00.000Z",
      expires_at: "2026-10-27T18:40:00.000Z",
    },
  ];

  return NextResponse.json(mockHistory);
}

