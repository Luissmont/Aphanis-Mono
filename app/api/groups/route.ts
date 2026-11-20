import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { AuthService } from "@/lib/services/auth.service";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const groups = await DashboardService.fetchGroups(user.id);
    return NextResponse.json(groups);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los grupos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, emails } = body;

    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
      return NextResponse.json(
        { error: "El nombre del grupo es obligatorio y debe tener como máximo 80 caracteres" },
        { status: 400 }
      );
    }

    let sanitizedEmails: string[] = [];
    if (emails !== undefined && emails !== null) {
      if (!Array.isArray(emails) || emails.length > 30) {
        return NextResponse.json(
          { error: "Máximo 30 correos permitidos por grupo" },
          { status: 400 }
        );
      }

      const allValid = emails.every(
        (email: unknown) =>
          typeof email === "string" && EMAIL_REGEX.test(email.trim())
      );

      if (!allValid) {
        return NextResponse.json(
          { error: "Uno o más correos tienen un formato inválido" },
          { status: 400 }
        );
      }

      sanitizedEmails = Array.from(
        new Set(emails.map((email: string) => email.trim().toLowerCase()))
      );
    }

    const newGroup = await DashboardService.createGroup(
      user.id,
      name.trim(),
      sanitizedEmails
    );
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el grupo" },
      { status: 500 }
    );
  }
}
