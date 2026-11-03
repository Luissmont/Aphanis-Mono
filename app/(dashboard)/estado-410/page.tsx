"use client";

import React, { useEffect, useState } from "react";
import { FileText, FileArchive } from "lucide-react";

interface TransferHistoryItem {
  id: string;
  title: string;
  content_type?: "file" | "text";
  type?: "file" | "text";
  created_at?: string;
  createdAt?: string;
  current_opens?: number;
  max_opens?: number;
  openings?: string;
  status: "active" | "destroyed" | "activo" | "destruido";
}

export default function Estado410Page() {
  const [transfers, setTransfers] = useState<TransferHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transfers/history")
      .then((res) => res.json())
      .then((data) => {
        setTransfers(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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

      {loading ? (
        <div className="mt-10 py-12 text-center text-zinc-500 text-sm">
          Cargando historial...
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-4">
          {transfers.map((item) => {
            const isFile = (item.content_type || item.type) === "file";
            const isActive =
              item.status === "active" || item.status === "activo";
            const openings =
              item.openings ||
              `${item.current_opens ?? 0} de ${item.max_opens ?? 0}`;
            const created =
              item.createdAt ||
              (item.created_at
                ? new Date(item.created_at).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "");

            return (
              <div
                key={item.id}
                className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-300">
                    {isFile ? (
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
                      Creado: {created}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-xs text-zinc-400 font-medium">
                    Aperturas: {openings}
                  </span>

                  {isActive ? (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
