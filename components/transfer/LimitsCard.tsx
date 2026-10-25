import React from "react";
import { ChevronDown } from "lucide-react";

export function LimitsCard() {
  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-1 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">02</span>
          <h2 className="text-base sm:text-lg font-bold text-white">Límites</h2>
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Tiempo límite
          </label>
          <div className="bg-black/50 border border-white/5 rounded-full py-2.5 px-4 flex items-center justify-between text-sm text-white font-medium cursor-pointer hover:border-white/10 transition-colors">
            <span>24 horas</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Número de aperturas
          </label>
          <div className="bg-black/50 border border-white/5 rounded-full py-2.5 px-4 flex items-center justify-between text-sm text-white font-medium cursor-pointer hover:border-white/10 transition-colors">
            <span>3 aperturas</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>

      <div className="mt-5 border border-[#CCFF00]/20 bg-[#CCFF00]/5 rounded-xl p-3">
        <p className="text-[#CCFF00] text-[10px] sm:text-xs font-medium leading-relaxed">
          El contenido se elimina automáticamente al alcanzar cualquiera de los límites
        </p>
      </div>
    </div>
  );
}
