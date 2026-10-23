import React from "react";
import { ContentCard } from "@/components/transfer/ContentCard";
import { LimitsCard } from "@/components/transfer/LimitsCard";
import { PinCard } from "@/components/transfer/PinCard";
import { RecipientsCard } from "@/components/transfer/RecipientsCard";

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
        {/* Tarjeta 1: Contenido (Fila 1, 2 columnas) */}
        <ContentCard />

        {/* Tarjeta 2: Límites (Fila 1, 1 columna) */}
        <LimitsCard />

        {/* Tarjeta 4: PIN de cifrado (Fila 2, 2 columnas) */}
        <PinCard />

        {/* Tarjeta 3: Destinatarios (Fila 2, 1 columna) */}
        <RecipientsCard />
      </div>
    </div>
  );
}
