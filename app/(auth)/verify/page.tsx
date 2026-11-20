import React from "react";

export default function VerifyPage() {
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center gap-10 text-center select-none">
      <h1 className="font-sans text-3xl sm:text-4xl uppercase text-[#CCFF00] tracking-wide font-black">
        VERIFICACIÓN DE CORREO ELECTRÓNICO
      </h1>

      <div className="flex items-center justify-center">
        <svg
          viewBox="0 0 240 160"
          width="256"
          height="176"
          fill="none"
          stroke="#CCFF00"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-64 h-44 drop-shadow-[0_0_20px_rgba(204,255,0,0.25)]"
          style={{ maxWidth: "100%", height: "auto" }}
        >
          <rect x="4" y="4" width="232" height="152" rx="32" />
          <path d="M14 20 L120 98 L226 20" />
        </svg>
      </div>

      <p className="text-white font-bold text-sm sm:text-base mt-2">
        Entra a tu correo y confirma la creación de tu cuenta
      </p>
    </div>
  );
}
