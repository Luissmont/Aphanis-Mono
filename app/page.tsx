import React from "react";
import { ContentCard } from "@/components/transfer/ContentCard";
import { LimitsCard } from "@/components/transfer/LimitsCard";

export default function Home() {
  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      {/* Cabecera de la página */}
      <header className="flex items-start gap-5">
        <div
          className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
          aria-hidden="true"
        />
        <div>
          <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
            NUEVA TRANSFERENCIA
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
            Crear envío seguro
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base">
            Cifra texto o archivos y controla quién puede acceder.
          </p>
        </div>
      </header>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Tarjeta 1: Contenido (Modularizada) */}
        <ContentCard />

        {/* Tarjeta 2: Límites (Modularizada) */}
        <LimitsCard />

        {/* Tarjeta 4: PIN de cifrado (Placeholder temporal) */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-2 h-64 flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white">03 PIN de cifrado</h2>
        </div>

        {/* Tarjeta 3: Destinatarios (Placeholder temporal) */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-1 h-64 flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white">03 Destinatarios</h2>
        </div>
      </div>
    </div>
  );
}
