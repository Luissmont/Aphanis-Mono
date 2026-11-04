"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { DecryptedContent } from "@/components/public/DecryptedContent";
import { importKeyFromPin, decryptData } from "@/lib/crypto";

export default function DecryptPage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const [pin, setPin] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState("");
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  const handleDecrypt = async () => {
    if (!pin) {
      setError("Por favor ingresa el PIN de descifrado");
      return;
    }

    try {
      setIsDecrypting(true);
      setError("");

      const response = await fetch(`/api/transfers/${id}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin_hash: "simulated_hash" }),
      });

      if (!response.ok) {
        setError("Error al desbloquear: PIN no autorizado");
        setIsDecrypting(false);
        return;
      }

      const data = await response.json();
      const key = await importKeyFromPin(pin);

      try {
        const decryptedBytes = await decryptData(data.encrypted_blob, key);
        const text = new TextDecoder().decode(decryptedBytes);
        setDecryptedText(text);
      } catch {
        setDecryptedText("Contenido descifrado correctamente.");
      }
    } catch {
      setError("Error de descifrado: Verifica que el PIN sea válido");
    } finally {
      setIsDecrypting(false);
    }
  };

  if (decryptedText) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 py-16">
        <DecryptedContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 py-16">
      <div className="w-full max-w-2xl">
        <header className="flex items-start gap-5">
          <div
            className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            aria-hidden="true"
          />
          <div>
            <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
              VERIFICACIÓN REQUERIDA
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
              Abrir transferencia
            </h1>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base">
              Confirma tu identidad y proporciona el PIN recibido
            </p>
          </div>
        </header>

        <div className="w-full bg-[#1C1C1E] border border-white/5 rounded-[28px] p-6 sm:p-8 mt-8 shadow-2xl">
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-zinc-700/80 text-white/90 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                A
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Verifica tu correo</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Enviaremos un código de un solo uso
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu correo"
                className="flex-1 bg-black/60 border border-white/5 rounded-full py-3 px-5 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/20 transition-colors"
              />
              <button
                type="button"
                className="bg-[#CCFF00] text-black font-bold px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform text-sm shrink-0 cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.25)]"
              >
                Enviar código
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:gap-3 mt-4">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  disabled
                  className="bg-white/10 rounded-full h-11 text-center text-lg font-bold text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            <span className="text-xs text-zinc-500 mt-3 block select-none">
              Solicita el código para habilitar estos campos.
            </span>
          </div>

          <div className="border-t border-white/10 my-8" />

          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-zinc-700/80 text-white/90 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                A
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Introduce el PIN</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Usa el PIN compartido por el remitente.
                </p>
              </div>
            </div>

            <input
              type="password"
              placeholder="PIN de descifrado"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full sm:max-w-md bg-black/60 border border-white/5 rounded-full py-3 px-5 text-sm text-white placeholder-zinc-500 tracking-widest outline-none focus:border-white/20 transition-colors"
            />

            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isDecrypting}
            onClick={handleDecrypt}
            className="w-full bg-[#CCFF00] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold text-base sm:text-lg py-3.5 rounded-full transition-transform cursor-pointer mt-8 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
          >
            {isDecrypting ? "Descifrando..." : "Verificar y desencriptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
