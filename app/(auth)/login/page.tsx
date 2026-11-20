"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isConfigured) {
      setError("Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno de Vercel.");
      return;
    }

    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
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
    <div className="w-full max-w-sm flex flex-col gap-6 transition-all duration-300">
      <h1 className="font-sans text-4xl uppercase text-[#CCFF00] tracking-wide font-black">
        INICIA SESIÓN
      </h1>

      {!isConfigured && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold">
          Faltan configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel.
        </div>
      )}

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
            className="bg-white text-black rounded-full px-5 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400 transition-all duration-200 focus:ring-2 focus:ring-[#CCFF00]"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-white mb-2 block">
            Escribe tu contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white text-black rounded-full pl-5 pr-12 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400 transition-all duration-200 focus:ring-2 focus:ring-[#CCFF00]"
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black transition-colors cursor-pointer p-1"
              title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#CCFF00] text-black font-bold text-lg py-3 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 uppercase cursor-pointer mt-2 shadow-[0_0_15px_rgba(204,255,0,0.25)]"
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
