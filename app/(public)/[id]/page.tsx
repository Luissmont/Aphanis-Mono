"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  DecryptedContent,
  type DecryptedFile,
} from "@/components/public/DecryptedContent";
import { importKeyFromPin, decryptData, hashPin } from "@/lib/crypto";
import { ShieldAlert, KeyRound, Loader2, Lock } from "lucide-react";

export default function DecryptPage() {
  const params = useParams();
  const id = ((params?.id as string) || "").trim().toUpperCase();

  const [checking, setChecking] = useState(true);
  const [isGone, setIsGone] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [pin, setPin] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState("");
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [decryptedFile, setDecryptedFile] = useState<DecryptedFile | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/transfers/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setIsGone(true);
          return;
        }
        const data = await res.json();
        if (data.status === "destroyed") {
          setIsGone(true);
        } else {
          setExpiresAt(data.expires_at || null);
        }
      })
      .catch(() => {
        setIsGone(true);
      })
      .finally(() => {
        setChecking(false);
      });
  }, [id]);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("Por favor ingresa el PIN de descifrado");
      return;
    }

    try {
      setIsDecrypting(true);
      setError("");

      const pinHash = await hashPin(pin);

      const response = await fetch(`/api/transfers/${id}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin_hash: pinHash }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "PIN incorrecto o transferencia no disponible");
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
      setIsDecrypting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#CCFF00] mb-4" />
        <span className="text-sm font-medium">Verificando transferencia...</span>
      </div>
    );
  }

  if (isGone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8">
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
            Este paquete ya fue autodestruido o ha alcanzado su límite de tiempo y aperturas.
          </p>
        </div>
      </div>
    );
  }

  if (decryptedText || decryptedFile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 py-16">
        <DecryptedContent
          decryptedText={decryptedText}
          decryptedFile={decryptedFile}
          expiresAt={expiresAt}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 py-16">
      <div className="w-full max-w-xl">
        <header className="flex items-start gap-5">
          <div
            className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            aria-hidden="true"
          />
          <div>
            <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
              TRANSFERENCIA CIFRADA
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
              Desbloquear paquete
            </h1>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base">
              Ingresa el PIN compartido por el remitente para descifrar en tu dispositivo.
            </p>
          </div>
        </header>

        <div className="w-full bg-[#1C1C1E] border border-white/5 rounded-[28px] p-6 sm:p-8 mt-8 shadow-2xl">
          <form onSubmit={handleDecrypt} className="flex flex-col">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-[#CCFF00] flex items-center justify-center shrink-0 mt-0.5">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  PIN de Descifrado
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  La llave nunca se transmite al servidor (Zero-Knowledge).
                </p>
              </div>
            </div>

            <input
              type="password"
              required
              placeholder="Introduce el PIN de descifrado"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-full py-3.5 px-6 text-sm text-white placeholder-zinc-500 font-mono tracking-widest outline-none focus:border-[#CCFF00]/50 transition-colors"
            />

            {error && (
              <div className="mt-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isDecrypting}
              className="w-full bg-[#CCFF00] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold text-base py-3.5 rounded-full transition-transform cursor-pointer mt-8 shadow-[0_0_20px_rgba(204,255,0,0.25)] uppercase flex items-center justify-center gap-2"
            >
              {isDecrypting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Descifrando paquete...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Verificar y descifrar</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
