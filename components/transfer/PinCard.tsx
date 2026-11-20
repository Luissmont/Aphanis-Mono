"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PinCardProps {
  pin: string;
  setPin: (val: string) => void;
  onGeneratePin: () => void;
}

export function PinCard({ pin, setPin, onGeneratePin }: PinCardProps) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-2 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">03</span>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Clave de descifrado
          </h2>
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            PIN o frase de descifrado (Zero-Knowledge)
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa una clave o genera un PIN seguro"
                className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-zinc-500 font-mono outline-none focus:border-white/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPin ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onGeneratePin}
              className="bg-[#CCFF00] text-black font-bold px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer text-sm shadow-[0_0_15px_rgba(204,255,0,0.25)]"
            >
              Generar
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mt-4 select-none">
        Comparte el PIN por un canal distinto al enlace
      </p>
    </div>
  );
}
