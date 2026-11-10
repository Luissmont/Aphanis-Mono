import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";

export async function GET() {
  try {
    const history = await DashboardService.fetchHistory();
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
