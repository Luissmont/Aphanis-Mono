"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "", text: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9\W_]/.test(pwd)) score++;

    if (score === 1) {
      return {
        score: 1,
        label: "Débil",
        color: "bg-red-500",
        text: "text-red-400",
      };
    }
    if (score === 2) {
      return {
        score: 2,
        label: "Media",
        color: "bg-amber-400",
        text: "text-amber-400",
      };
    }
    return {
      score: 3,
      label: "Fuerte",
      color: "bg-[#CCFF00]",
      text: "text-[#CCFF00]",
    };
  };

  const strength = getPasswordStrength(password);

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!isConfigured) {
      setError("Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno de Vercel.");
      return;
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9\W_]/.test(password)
    ) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número o símbolo."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!acceptedTerms) {
      setError("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }

    try {
      setLoading(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signUpError) {
        if (/already registered|already exists/i.test(signUpError.message)) {
          setError(
            "No se pudo completar el registro con este correo. Si ya tienes cuenta, inicia sesión."
          );
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (!data.session) {
        setInfoMessage(
          "Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión."
        );
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
        CREA TU CUENTA
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
              placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número/símbolo"
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

          {password.length > 0 && (
            <div className="mt-2 px-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-zinc-400">Fortaleza:</span>
                <span className={`text-[11px] font-bold ${strength.text}`}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex gap-1">
                <div
                  className={`h-full flex-1 rounded-full ${
                    strength.score >= 1 ? strength.color : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 rounded-full ${
                    strength.score >= 2 ? strength.color : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 rounded-full ${
                    strength.score >= 3 ? strength.color : "bg-transparent"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-bold text-white mb-2 block">
            Confirma tu contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white text-black rounded-full pl-5 pr-12 py-3 w-full outline-none font-medium text-sm placeholder-zinc-400 transition-all duration-200 focus:ring-2 focus:ring-[#CCFF00]"
              placeholder="Repite tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black transition-colors cursor-pointer p-1"
              title={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showConfirmPassword ? (
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

        {infoMessage && (
          <div className="p-3 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-xl text-[#CCFF00] text-xs font-semibold leading-relaxed animate-in fade-in duration-300">
            {infoMessage}
          </div>
        )}

        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 rounded accent-[#CCFF00] cursor-pointer"
            />
            <span className="text-xs text-white">
              Acepto los Términos y Condiciones del servicio
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#CCFF00] text-black font-bold text-lg py-3 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 uppercase cursor-pointer mt-2 shadow-[0_0_15px_rgba(204,255,0,0.25)]"
        >
          {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
        </button>
      </form>

      <p className="text-center text-sm text-white select-none">
        ¿Ya tienes una cuenta?{" "}
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
