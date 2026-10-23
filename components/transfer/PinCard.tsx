import React from "react";

export function PinCard() {
  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-2 flex flex-col justify-between">
      <div>
        {/* Cabecera de Destinatarios / PIN */}
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">03</span>
          <h2 className="text-base sm:text-lg font-bold text-white">Destinatarios</h2>
        </div>

        {/* Sección: PIN de cifrado con input y botón generar */}
        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            PIN de cifrado
          </label>
          <div className="flex items-center gap-3">
            <input
              type="password"
              placeholder="................................"
              className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 px-4 text-sm text-white placeholder-zinc-500 tracking-widest outline-none focus:border-white/20 transition-colors"
            />
            <button
              type="button"
              className="bg-[#CCFF00] text-black font-bold px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer text-sm shadow-[0_0_15px_rgba(204,255,0,0.25)]"
            >
              Generar
            </button>
          </div>
        </div>
      </div>

      {/* Nota inferior explicativa */}
      <p className="text-xs text-zinc-500 mt-4 select-none">
        Comparte el PIN por un canal distinto al enlace
      </p>
    </div>
  );
}

