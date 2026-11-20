"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <h1 className="font-sans text-4xl uppercase text-[#CCFF00] tracking-wide font-black">
        INICIA SESIÓN
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-bold text-white mb-2 block">
            Escribe tu correo
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-black rounded-full px-5 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-white mb-2 block">
            Escribe tu contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-black rounded-full px-5 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400"
            placeholder="Tu contraseña"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

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
          disabled={loading}
          className="w-full bg-[#CCFF00] text-black font-bold text-lg py-3 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-transform uppercase cursor-pointer mt-2"
        >
          {loading ? "INICIANDO..." : "INICIAR SESIÓN"}
        </button>
      </form>

      <p className="text-center text-sm text-white select-none">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/registro"
          className="text-[#CCFF00] font-bold hover:underline"
        >
          Crear Cuenta
        </Link>
      </p>
    </div>
  );
}
