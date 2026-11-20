import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";
import { AuthService } from "@/lib/services/auth.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
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

    const updatedGroup = await DashboardService.updateGroup(
      user.id,
      id,
      name.trim(),
      sanitizedEmails
    );
    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;

    if (message === "Grupo no encontrado o no autorizado") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error al actualizar el grupo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await DashboardService.deleteGroup(user.id, id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;

    if (message === "Grupo no encontrado o no autorizado") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error al eliminar el grupo" },
      { status: 500 }
    );
  }
}
