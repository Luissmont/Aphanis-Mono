import React from "react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <h1 className="font-sans text-4xl uppercase text-[#CCFF00] tracking-wide font-black">
        CREA TU CUENTA
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

        <div>
          <label className="text-sm font-bold text-white mb-2 block">
            Confirma tu contraseña
          </label>
          <input
            type="password"
            required
            className="bg-white text-black rounded-full px-5 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400"
          />
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              className="w-4 h-4 rounded accent-[#CCFF00] cursor-pointer"
            />
            <span className="text-xs text-white">
              Estoy de acuerdo con los{" "}
              <Link href="#" className="text-[#CCFF00] font-bold hover:underline">
                Términos y Condiciones
              </Link>
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#CCFF00] text-black font-bold text-lg py-3 rounded-full hover:scale-105 active:scale-95 transition-transform uppercase cursor-pointer mt-2"
        >
          CREAR CUENTA
        </button>
      </form>

      <p className="text-center text-sm text-white select-none">
        Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="text-[#CCFF00] font-bold hover:underline"
        >
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
}

