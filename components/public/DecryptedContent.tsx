"use client";

import React, { useState } from "react";

export function DecryptedContent() {
  const [tab, setTab] = useState<"text" | "file">("text");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div
            className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            aria-hidden="true"
          />
          <div>
            <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
              CONTENIDO DESBLOQUEADO
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
              Transferencia segura
            </h1>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 text-white font-bold text-lg tracking-wider shrink-0 self-start sm:self-auto select-none">
          23:41:09
        </div>
      </header>

      <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 sm:p-8 mt-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase text-zinc-400 font-medium tracking-wider block mb-1">
              CONTENIDO DESCIFRADO
            </span>
            <h2 className="text-lg font-bold text-white">
              Disponible en este dispositivo
            </h2>
          </div>

          <div className="bg-black/60 p-1 rounded-full border border-white/5 flex gap-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTab("text")}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                tab === "text"
                  ? "bg-white/10 text-white shadow-sm"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Texto plano
            </button>
            <button
              type="button"
              onClick={() => setTab("file")}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                tab === "file"
                  ? "bg-white/10 text-white shadow-sm"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Archivo
            </button>
          </div>
        </div>

        {tab === "text" ? (
          <div className="bg-black/60 rounded-2xl p-6 min-h-[200px] text-white font-medium text-sm sm:text-base leading-relaxed border border-white/5">
            Hola, este es el mensaje cifrado que tengo .............
          </div>
        ) : (
          <div className="bg-black/60 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 bg-zinc-600 rounded-2xl shrink-0"
                aria-hidden="true"
              />
              <div>
                <span className="font-bold text-white text-base block">
                  informe_auditoria_2025.pdf
                </span>
                <span className="text-xs text-zinc-400 mt-1 block">
                  PDF | 12,4 MB
                </span>
              </div>
            </div>

            <button
              type="button"
              className="bg-[#CCFF00] text-black font-bold px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform text-sm shrink-0 cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.25)]"
            >
              Descargar archivo
            </button>
          </div>
        )}

        <span className="text-xs text-zinc-500 mt-6 block select-none">
          Comparte el PIN por un canal distinto al enlace
        </span>
      </div>
    </div>
  );
}

