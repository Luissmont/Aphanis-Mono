import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { AuthService } from "@/lib/services/auth.service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const history = await DashboardService.fetchHistory(user.id);
    return NextResponse.json(history);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener el historial de transferencias" },
      { status: 500 }
    );
  }
}
