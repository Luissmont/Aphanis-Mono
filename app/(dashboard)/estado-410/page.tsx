import React from "react";
import { FileText, FileArchive } from "lucide-react";

interface TransferHistoryItem {
  id: string;
  title: string;
  type: "file" | "text";
  createdAt: string;
  openings: string;
  status: "activo" | "destruido";
}

const TRANSFERS: TransferHistoryItem[] = [
  {
    id: "1",
    title: "Contratos_Finanzas_Q3.zip",
    type: "file",
    createdAt: "28 Oct 2026, 14:22",
    openings: "1 de 3",
    status: "activo",
  },
  {
    id: "2",
    title: "Credenciales de acceso a base de datos",
    type: "text",
    createdAt: "27 Oct 2026, 09:15",
    openings: "3 de 3",
    status: "destruido",
  },
  {
    id: "3",
    title: "informe_auditoria_2025.pdf",
    type: "file",
    createdAt: "26 Oct 2026, 18:40",
    openings: "2 de 5",
    status: "activo",
  },
  {
    id: "4",
    title: "Notas clave de reunión estratégica",
    type: "text",
    createdAt: "25 Oct 2026, 11:05",
    openings: "1 de 1",
    status: "destruido",
  },
];

export default function Estado410Page() {
  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      <header className="flex items-start gap-5">
        <div
          className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
          aria-hidden="true"
        />
        <div>
          <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
            HISTORIAL DE ENVÍOS
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
            Estado 410
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base">
            Rastrea el ciclo de vida y la autodestrucción de tus paquetes.
          </p>
        </div>
      </header>

      <div className="mt-10 flex flex-col gap-4">
        {TRANSFERS.map((item) => (
          <div
            key={item.id}
            className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-300">
                {item.type === "file" ? (
                  <FileArchive className="w-5 h-5 text-[#CCFF00]" />
                ) : (
                  <FileText className="w-5 h-5 text-white/80" />
                )}
              </div>
              <div>
                <span className="font-bold text-white text-sm sm:text-base block">
                  {item.title}
                </span>
                <span className="text-xs text-zinc-500 mt-0.5 block">
                  Creado: {item.createdAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xs text-zinc-400 font-medium">
                Aperturas: {item.openings}
              </span>

              {item.status === "activo" ? (
                <span className="bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shrink-0 select-none">
                  ACTIVO
                </span>
              ) : (
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shrink-0 select-none">
                  410 GONE
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

