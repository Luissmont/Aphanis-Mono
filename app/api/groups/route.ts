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
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, emails } = await request.json();
    const newGroup = await DashboardService.createGroup(user.id, name, emails ?? []);
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
