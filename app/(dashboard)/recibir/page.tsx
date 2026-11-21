"use client";

import React, { useState } from "react";
import {
  DecryptedContent,
  type DecryptedFile,
} from "@/components/public/DecryptedContent";
import { importKeyFromPin, decryptData, hashPin } from "@/lib/crypto";
import { Lock, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";

export default function RecibirPage() {
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [decryptedFile, setDecryptedFile] = useState<DecryptedFile | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isGone, setIsGone] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanCode =
      accessCodeInput.trim().split("/").filter(Boolean).pop()?.toUpperCase() || "";

    if (!cleanCode) {
      setError("Por favor ingresa el código del paquete o la URL de acceso.");
      return;
    }

    if (!pin.trim()) {
      setError("Por favor ingresa la llave de descifrado.");
      return;
    }

    try {
      setIsProcessing(true);

      const pinHash = await hashPin(pin);

      const response = await fetch(`/api/transfers/${cleanCode}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin_hash: pinHash }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(
          resData.error || "Paquete no encontrado, destruido o PIN incorrecto."
        );
      }

      const data = await response.json();
      setExpiresAt(data.expires_at || null);

      const key = await importKeyFromPin(pin);
      const decryptedBytes = await decryptData(data.encrypted_blob, key);
      const raw = new TextDecoder().decode(decryptedBytes);

      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.dataBase64 && parsed.name) {
          setDecryptedFile(parsed);
        } else {
          setDecryptedText(raw);
        }
      } catch {
        setDecryptedText(raw);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setDecryptedText(null);
    setDecryptedFile(null);
    setExpiresAt(null);
    setAccessCodeInput("");
    setPin("");
    setError("");
    setIsGone(false);
  };

  const handleExpired = () => {
    setDecryptedText(null);
    setDecryptedFile(null);
    setExpiresAt(null);
    setIsGone(true);
  };

  if (isGone) {
    return (
      <div className="p-8 md:p-12 w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-16">
        <div className="w-full max-w-md bg-[#1C1C1E] border border-red-500/20 rounded-[28px] p-8 sm:p-10 text-center shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 block">
            ESTADO 410
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-wide">
            410 GONE
          </h1>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Este paquete ha expirado o ya fue destruido.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-full transition-colors cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (decryptedText || decryptedFile) {
    return (
      <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
        <button
          type="button"
          onClick={handleReset}
          className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a recibir otro paquete</span>
        </button>

        <DecryptedContent
          decryptedText={decryptedText}
          decryptedFile={decryptedFile}
          expiresAt={expiresAt}
          onReset={handleReset}
          onExpired={handleExpired}
        />
      </div>
    );
  }

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
            Ingresa el código o enlace recibido y el PIN correspondiente para
            descifrar el paquete.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="bg-[#1C1C1E] border border-white/5 rounded-[28px] p-8 shadow-2xl flex flex-col justify-between">
          <form onSubmit={handleUnlock} className="flex flex-col gap-6">
            <div>
              <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider block mb-2">
                Paso 1
              </span>
              <label className="text-base font-bold text-white block mb-2">
                Código de transferencia o Enlace
              </label>
              <input
                type="text"
                required
                value={accessCodeInput}
                onChange={(e) => setAccessCodeInput(e.target.value)}
                placeholder="Ej. A1B2C3D4E5F6 o https://.../A1B2C3D4E5F6"
                className="w-full bg-black/50 border border-white/5 rounded-full py-3.5 px-5 text-sm text-white placeholder-zinc-500 font-mono outline-none focus:border-[#CCFF00]/50 transition-colors"
              />
            </div>

            <div>
              <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider block mb-2">
                Paso 2
              </span>
              <label className="text-base font-bold text-white block mb-2">
                Llave de descifrado
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Llave criptográfica de 256 bits (Base64)"
                className="w-full bg-black/50 border border-white/5 rounded-full py-3.5 px-5 text-sm text-white placeholder-zinc-500 font-mono outline-none focus:border-[#CCFF00]/50 transition-colors"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-2 bg-[#CCFF00] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold py-3.5 px-8 rounded-full transition-transform cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.3)] text-sm uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Descifrando paquete...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Desbloquear y Ver</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-[#1C1C1E]/60 border border-white/5 rounded-[28px] p-8 flex flex-col justify-center">
          <h2 className="text-lg font-bold text-white mb-2">
            Seguridad Cero Conocimiento
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Al presionar &ldquo;Desbloquear y Ver&rdquo;, el navegador descarga
            el paquete cifrado y utiliza el PIN para derivar la clave simétrica
            AES-256-GCM.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            El contenido se descifra de manera exclusiva y privada en la memoria
            de este dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}
