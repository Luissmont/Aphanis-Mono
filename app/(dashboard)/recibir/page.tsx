"use client";

import React, { useState } from "react";
import {
  DecryptedContent,
  type DecryptedFile,
} from "@/components/public/DecryptedContent";
import { importKeyFromPin, decryptData, hashPin } from "@/lib/crypto";
import { Lock, Loader2, ArrowLeft } from "lucide-react";

export default function RecibirPage() {
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [decryptedFile, setDecryptedFile] = useState<DecryptedFile | null>(null);

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
      setError("Por favor ingresa el PIN de descifrado.");
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
    setAccessCodeInput("");
    setPin("");
    setError("");
  };

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
          onReset={handleReset}
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
            Ingresa el código único y el PIN para acceder al contenido.
          </p>
        </div>
      </header>

      <div className="max-w-xl mt-12 bg-[#1C1C1E] border border-white/5 rounded-[28px] p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleUnlock} className="flex flex-col">
          <div className="mb-6">
            <label className="text-xs text-zinc-400 block mb-2 font-medium">
              Código del paquete o enlace
            </label>
            <input
              type="text"
              required
              value={accessCodeInput}
              onChange={(e) => setAccessCodeInput(e.target.value)}
              placeholder="Ej: APH-9X2M o https://.../APH-9X2M"
              className="w-full bg-black/50 border border-white/5 rounded-full py-3.5 px-5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#CCFF00]/50 transition-colors font-mono tracking-wider"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs text-zinc-400 block mb-2 font-medium">
              PIN de descifrado
            </label>
            <input
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Introduce el PIN secreto"
              className="w-full bg-black/50 border border-white/5 rounded-full py-3.5 px-5 text-sm text-white placeholder-zinc-500 font-mono tracking-widest outline-none focus:border-[#CCFF00]/50 transition-colors"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#CCFF00] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold text-base py-3.5 rounded-full transition-transform cursor-pointer mt-2 shadow-[0_0_20px_rgba(204,255,0,0.25)] uppercase flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Desencriptando...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Buscar y desencriptar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
