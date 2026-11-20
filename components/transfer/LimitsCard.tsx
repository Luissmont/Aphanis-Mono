"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface LimitsCardProps {
  expiresInHours: number;
  setExpiresInHours: (hours: number) => void;
  maxOpens: number;
  setMaxOpens: (opens: number) => void;
}

export function LimitsCard({
  expiresInHours,
  setExpiresInHours,
  maxOpens,
  setMaxOpens,
}: LimitsCardProps) {
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
          <div className="relative">
            <select
              value={expiresInHours}
              onChange={(e) => setExpiresInHours(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 px-4 pr-10 text-sm text-white font-medium cursor-pointer hover:border-white/10 transition-colors appearance-none outline-none"
            >
              <option value={1} className="bg-[#1C1C1E] text-white">
                1 hora
              </option>
              <option value={24} className="bg-[#1C1C1E] text-white">
                24 horas
              </option>
              <option value={72} className="bg-[#1C1C1E] text-white">
                72 horas
              </option>
              <option value={168} className="bg-[#1C1C1E] text-white">
                7 días (168 horas)
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Número de aperturas
          </label>
          <div className="relative">
            <select
              value={maxOpens}
              onChange={(e) => setMaxOpens(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 px-4 pr-10 text-sm text-white font-medium cursor-pointer hover:border-white/10 transition-colors appearance-none outline-none"
            >
              <option value={1} className="bg-[#1C1C1E] text-white">
                1 apertura
              </option>
              <option value={3} className="bg-[#1C1C1E] text-white">
                3 aperturas
              </option>
              <option value={5} className="bg-[#1C1C1E] text-white">
                5 aperturas
              </option>
              <option value={10} className="bg-[#1C1C1E] text-white">
                10 aperturas
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
