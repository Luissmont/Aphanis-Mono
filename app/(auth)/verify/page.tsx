import React from "react";

export default function VerifyPage() {
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center gap-10 text-center select-none">
      <h1 className="font-sans text-3xl sm:text-4xl uppercase text-[#CCFF00] tracking-wide font-black">
        VERIFICACIÓN DE CORREO ELECTRÓNICO
      </h1>

      <div className="w-64 h-48 border-[6px] border-[#CCFF00] rounded-[32px] flex items-center justify-center p-6 shadow-[0_0_30px_rgba(204,255,0,0.15)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CCFF00"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
          <rect x="3" y="5" width="18" height="14" rx="2" />
        </svg>
      </div>

      <p className="text-white font-bold text-sm sm:text-base mt-2">
        Entra a tu correo y confirma la creación de tu cuenta
      </p>
    </div>
  );
}

