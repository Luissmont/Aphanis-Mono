"use client";

import React from "react";

interface NavItem {
  label: string;
  href?: string;
  isSpecial?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Crear envío" },
  { label: "Mis grupos" },
  { label: "Recibir" },
  { label: "Estado 410" },
];

export function Sidebar() {
  return (
    <aside className="w-72 sm:w-80 h-full p-4 flex flex-col shrink-0 select-none">
      {/* Contenedor principal de la Sidebar con esquinas redondeadas y fondo oscuro */}
      <div className="w-full h-full bg-[#1C1C1E] rounded-[32px] p-6 flex flex-col justify-between border border-white/5 shadow-2xl">
        {/* Cabecera: Logo APHANIS + Adorno amarillo rotado */}
        <div>
          <div className="flex items-center gap-3 mb-10 pt-2 px-1">
            <h1 className="text-4xl font-black tracking-wider text-white uppercase font-sans">
              APHANIS
            </h1>
            <div
              className="w-8 h-8 bg-[#CCFF00] rotate-45 rounded-md shrink-0 shadow-[0_0_16px_rgba(204,255,0,0.35)]"
              aria-hidden="true"
            />
          </div>

          {/* Menú de navegación principal con efecto Glassmorphism */}
          <nav className="flex flex-col gap-4" aria-label="Menú principal">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className="w-full py-3.5 px-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium text-sm sm:text-base flex items-center justify-center text-center transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Botón inferior: Iniciar Sesión / Registrarse con acento amarillo neón */}
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

