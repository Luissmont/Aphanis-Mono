import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <h1 className="font-sans text-4xl uppercase text-[#CCFF00] tracking-wide font-black">
        INICIA SESIÓN
      </h1>

      <form className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-bold text-white mb-2 block">
            Escribe tu correo
          </label>
          <input
            type="email"
            required
            className="bg-white text-black rounded-full px-5 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-white mb-2 block">
            Escribe tu contraseña
          </label>
          <input
            type="password"
            required
            className="bg-white text-black rounded-full px-5 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400"
          />
        </div>

        <div className="flex justify-between items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-[#CCFF00] cursor-pointer"
            />
            <span className="text-xs text-white">Recordarme</span>
          </label>
          <Link
            href="#"
            className="text-xs font-bold text-[#CCFF00] hover:underline"
          >
            Olvidé mi contraseña
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-[#CCFF00] text-black font-bold text-lg py-3 rounded-full hover:scale-105 active:scale-95 transition-transform uppercase cursor-pointer mt-2"
        >
          INICIAR SESIÓN
        </button>
      </form>

      <p className="text-center text-sm text-white select-none">
        No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-[#CCFF00] font-bold hover:underline"
        >
          Crear Cuenta
        </Link>
      </p>
    </div>
  );
}

