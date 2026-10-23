"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";

export function ContentCard() {
  const [tab, setTab] = useState<"text" | "file">("file");

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-2 flex flex-col justify-between">
      {/* Cabecera con título y selector de tipo de contenido */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-zinc-400 block">01</span>
          <h2 className="text-base sm:text-lg font-bold text-white">Contenido</h2>
        </div>

        {/* Píldoras de selección Texto plano / Archivo */}
        <div className="bg-black/60 p-1 rounded-full border border-white/5 flex gap-1">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`py-1 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
            className={`py-1 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              tab === "file"
                ? "bg-white/10 text-white shadow-sm"
                : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Archivo
          </button>
        </div>
      </div>

      {/* Cuerpo del contenido según la pestaña activa */}
      <div className="h-56 sm:h-64 w-full">
        {tab === "text" ? (
          <textarea
            className="w-full h-full bg-black/50 rounded-2xl border border-white/5 p-4 text-sm text-white placeholder-zinc-500 resize-none outline-none focus:border-white/20 transition-colors"
            placeholder="Escribe o pega aquí la información confidencial..."
          />
        ) : (
          <div className="w-full h-full bg-black/50 rounded-2xl border border-dashed border-white/10 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-colors group">
            <Upload className="w-12 h-12 text-white/90 mb-2 group-hover:scale-105 transition-transform" />
            <span className="text-sm font-semibold text-white">Subir Archivo</span>
          </div>
        )}
      </div>
    </div>
  );
}

