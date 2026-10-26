import React from "react";
import { ContentCard } from "@/components/transfer/ContentCard";
import { LimitsCard } from "@/components/transfer/LimitsCard";
import { PinCard } from "@/components/transfer/PinCard";
import { RecipientsCard } from "@/components/transfer/RecipientsCard";

export default function Home() {
  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      <header>
        <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
          NUEVA TRANSFERENCIA
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
          Crear envío seguro
        </h1>
        <p className="text-zinc-400 mt-2 text-sm sm:text-base">
          Cifra texto o archivos y controla quién puede acceder.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <ContentCard />
        <LimitsCard />
        <PinCard />
        <RecipientsCard />
      </div>
    </div>
  );
}

