"use client";

import React, { useEffect, useState } from "react";
import { Clock, Copy, ShieldAlert, Key } from "lucide-react";

interface TransferHistoryRecord {
  id: string;
  access_code: string;
  status: "active" | "destroyed";
  created_at: string;
  expires_at: string;
  max_opens: number;
  current_opens: number;
}

export default function Estado410Page() {
  const [transfers, setTransfers] = useState<TransferHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/transfers/history")
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => {
        setTransfers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTransfers([]);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleCopyLink = (accessCode: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${accessCode}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(accessCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
        <div className="mt-10 py-16 text-center text-zinc-500 text-sm">
          Cargando historial...
        </div>
      ) : transfers.length === 0 ? (
        <div className="mt-12 bg-[#1C1C1E] border border-white/5 rounded-[24px] p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Sin transferencias registradas
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Los envíos seguros que crees se registrarán aquí para que puedas
            monitorear su estado de autodestrucción.
          </p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-4">
          {transfers.map((item) => {
            const isActive = item.status === "active";
            const isCopied = copiedCode === item.access_code;

            return (
              <div
                key={item.id}
                className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      isActive
                        ? "bg-[#CCFF00]/10 border-[#CCFF00]/20 text-[#CCFF00]"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {isActive ? (
                      <Key className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base sm:text-lg block">
                        {item.access_code}
                      </span>
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item.access_code)}
                          className="text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
                          title="Copiar enlace directo"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                      {isCopied && (
                        <span className="text-[11px] text-[#CCFF00] font-semibold">
                          ¡Copiado!
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-zinc-400">
                      <span>Creado: {formatDate(item.created_at)}</span>
                      <span>•</span>
                      <span>Expira: {formatDate(item.expires_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="flex flex-col md:items-end">
                    <span className="text-xs text-zinc-400 font-medium">
                      Aperturas
                    </span>
                    <span className="text-sm font-bold text-white">
                      {item.current_opens} de {item.max_opens}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider shrink-0 select-none shadow-[0_0_10px_rgba(204,255,0,0.15)]">
                      ACTIVO
                    </span>
                  ) : (
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider shrink-0 select-none">
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
