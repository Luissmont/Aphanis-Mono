import React from "react";
import { ChevronDown } from "lucide-react";

export function RecipientsCard() {
  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-1 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">03</span>
          <h2 className="text-base sm:text-lg font-bold text-white">Destinatarios</h2>
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Correos electrónicos
          </label>
          <input
            type="email"
            placeholder="persona@empresa.com"
            className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Mis grupos
          </label>
          <div className="bg-black/50 border border-white/5 rounded-full py-2.5 px-4 flex items-center justify-between text-sm text-white font-medium cursor-pointer hover:border-white/10 transition-colors">
            <span>Ningún grupo seleccionado</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
