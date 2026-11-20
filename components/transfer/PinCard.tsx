"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";

interface PinCardProps {
  pin: string;
  setPin?: (val: string) => void;
  onGeneratePin: () => void;
}

export function PinCard({ pin, onGeneratePin }: PinCardProps) {
  const [showPin, setShowPin] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!pin) return;
    await navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-2 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">03</span>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Llave de descifrado (256 bits)
          </h2>
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Llave criptográfica generada (Zero-Knowledge)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                readOnly
                placeholder="Generando llave segura..."
                className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-zinc-500 font-mono outline-none select-all cursor-default"
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

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!pin}
                className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2.5 rounded-full transition-colors cursor-pointer text-sm shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-[#CCFF00]">Copiada</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onGeneratePin}
                className="flex items-center justify-center gap-1.5 bg-[#CCFF00] text-black font-bold px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer text-sm shadow-[0_0_15px_rgba(204,255,0,0.25)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mt-4 select-none">
        Comparte esta llave por un canal seguro distinto al enlace. Nunca se almacena en el servidor.
      </p>
    </div>
  );
}
