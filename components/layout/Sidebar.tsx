"use client";

import React from "react";

interface NavItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Crear envío", isActive: true },
  { label: "Mis grupos" },
  { label: "Recibir" },
  { label: "Estado 410" },
];

export function Sidebar() {
  return (
    <aside className="w-72 sm:w-80 h-full p-4 flex flex-col shrink-0 select-none">
      <div className="relative w-full h-full bg-[#1C1C1E] rounded-[32px] p-6 flex flex-col justify-between border border-white/5 shadow-2xl">
        <div>
          <div className="relative flex items-center justify-between mb-10 pt-2 px-1">
            <h1 className="text-4xl font-black tracking-wider text-white uppercase font-sans">
              APHANIS
            </h1>
            <button
              type="button"
              className="w-8 h-8 bg-[#CCFF00] rotate-45 rounded-md shrink-0 shadow-[0_0_16px_rgba(204,255,0,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-pointer -mr-3"
              aria-label="Colapsar menú"
            />
          </div>

          <nav className="flex flex-col gap-4" aria-label="Menú principal">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`w-full py-3.5 px-6 rounded-full backdrop-blur-md flex items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                  item.isActive
                    ? "bg-white/15 border border-white/30 text-[#CCFF00] font-semibold"
                    : "bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4">
          <button
            type="button"
            className="w-full py-3.5 px-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#CCFF00] font-bold text-sm sm:text-base flex items-center justify-center text-center transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] cursor-pointer"
          >
            Iniciar Sesión / Registrarse
          </button>
        </div>
      </div>
    </aside>
  );
}
