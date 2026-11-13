import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { AuthService } from "@/lib/services/auth.service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await DashboardService.fetchGroups(user.id);
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
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
