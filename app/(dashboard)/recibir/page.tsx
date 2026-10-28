import React from "react";

export default function RecibirPage() {
  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      <header className="flex items-start gap-5">
        <div
          className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
          aria-hidden="true"
        />
        <div>
          <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
            MODALIDAD MANUAL
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
            Recibir transferencia
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base">
            Ingresa el código único y el PIN para acceder al contenido.
          </p>
        </div>
      </header>

      <div className="max-w-xl mt-12 bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 sm:p-8 shadow-2xl">
        <form className="flex flex-col">
          <div className="mb-6">
            <label className="text-xs text-zinc-400 block mb-2 font-medium">
              Código del paquete
            </label>
            <input
              type="text"
              placeholder="Ej: APH-9X2M-44..."
              className="w-full bg-black/50 border border-white/5 rounded-full py-3 px-5 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/20 transition-colors uppercase font-mono tracking-wider"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs text-zinc-400 block mb-2 font-medium">
              PIN de descifrado
            </label>
            <input
              type="password"
              placeholder="................"
              className="w-full bg-black/50 border border-white/5 rounded-full py-3 px-5 text-sm text-white placeholder-zinc-500 tracking-widest outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#CCFF00] text-black font-bold text-base py-3.5 rounded-full hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer mt-2 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
          >
            Buscar y desencriptar
          </button>
        </form>
      </div>
    </div>
  );
}

