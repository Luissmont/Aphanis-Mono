"use client";

import React from "react";

interface LimitsCardProps {
  expiresInHours: number;
  setExpiresInHours: (hours: number) => void;
  maxOpens: number;
  setMaxOpens: (opens: number) => void;
}

const HOUR_PRESETS = [
  { label: "1h", value: 1 },
  { label: "24h", value: 24 },
  { label: "72h", value: 72 },
  { label: "7d", value: 168 },
];

const OPEN_PRESETS = [
  { label: "1", value: 1 },
  { label: "3", value: 3 },
  { label: "5", value: 5 },
  { label: "10", value: 10 },
];

export function LimitsCard({
  expiresInHours,
  setExpiresInHours,
  maxOpens,
  setMaxOpens,
}: LimitsCardProps) {
  const handleHoursChange = (val: number) => {
    const clamped = Math.max(1, Math.min(168, Math.round(val || 1)));
    setExpiresInHours(clamped);
  };

  const handleOpensChange = (val: number) => {
    const clamped = Math.max(1, Math.min(20, Math.round(val || 1)));
    setMaxOpens(clamped);
  };

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-1 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">02</span>
          <h2 className="text-base sm:text-lg font-bold text-white">Límites</h2>
        </div>

        <div className="mb-5">
          <label className="text-xs text-zinc-400 block mb-2 font-medium">
            Tiempo límite (horas)
          </label>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {HOUR_PRESETS.map((preset) => {
              const isSelected = expiresInHours === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setExpiresInHours(preset.value)}
                  className={`py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#CCFF00] text-black shadow-[0_0_10px_rgba(204,255,0,0.25)]"
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={168}
              value={expiresInHours}
              onChange={(e) => handleHoursChange(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/5 rounded-full py-2 px-4 text-xs sm:text-sm text-white font-medium outline-none focus:border-[#CCFF00]/50 transition-colors"
              placeholder="1 - 168 horas"
            />
            <span className="text-xs text-zinc-500 shrink-0 font-medium">
              horas
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-2 font-medium">
            Número de aperturas
          </label>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {OPEN_PRESETS.map((preset) => {
              const isSelected = maxOpens === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setMaxOpens(preset.value)}
                  className={`py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#CCFF00] text-black shadow-[0_0_10px_rgba(204,255,0,0.25)]"
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={20}
              value={maxOpens}
              onChange={(e) => handleOpensChange(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/5 rounded-full py-2 px-4 text-xs sm:text-sm text-white font-medium outline-none focus:border-[#CCFF00]/50 transition-colors"
              placeholder="1 - 20 aperturas"
            />
            <span className="text-xs text-zinc-500 shrink-0 font-medium">
              aperturas
            </span>
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
