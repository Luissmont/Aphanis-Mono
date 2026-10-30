import { NextResponse } from "next/server";

export async function GET() {
  const mockGroups = [
    {
      id: "grp_01",
      name: "Equipo de Desarrollo",
      membersCount: 8,
    },
    {
      id: "grp_02",
      name: "Directivos",
      membersCount: 4,
    },
  ];

  return NextResponse.json(mockGroups);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newGroup = {
    id: "new_group_1",
    name: body.name ?? "Nuevo Grupo",
    membersCount: Array.isArray(body.emails) ? body.emails.length : 0,
    message: "Grupo creado exitosamente",
  };

  return NextResponse.json(newGroup, { status: 201 });
}

