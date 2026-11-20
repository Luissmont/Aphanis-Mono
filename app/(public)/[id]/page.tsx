"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  DecryptedContent,
  type DecryptedFile,
} from "@/components/public/DecryptedContent";
import { importKeyFromPin, decryptData, hashPin } from "@/lib/crypto";
import { ShieldAlert, KeyRound, Loader2, Lock, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function DecryptPage() {
  const params = useParams();
  const id = ((params?.id as string) || "").trim().toUpperCase();

  const [checking, setChecking] = useState(true);
  const [isGone, setIsGone] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    try {
      setIsSendingOtp(true);
      setError("");

      const res = await fetch(`/api/transfers/${id}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al solicitar código de verificación.");
      }

      setOtpSent(true);
      setOtpNotice(
        data.message ||
          "Código de 6 dígitos enviado. Revisa tu bandeja de entrada."
      );
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || "";
    }
    setOtpDigits(updated);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setError("Por favor ingresa los 6 dígitos del código de verificación.");
      return;
    }

    if (!pin.trim()) {
      setError("Por favor ingresa el PIN de descifrado.");
      return;
    }

    try {
      setIsDecrypting(true);

      const pinHash = await hashPin(pin);

      const response = await fetch(`/api/transfers/${id}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp_code: fullOtp,
          pin_hash: pinHash,
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(
          resData.error || "No fue posible verificar y desencriptar el paquete."
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
              PAQUETE CIFRADO • {id}
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
              Desbloquear paquete
            </h1>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base">
              Verifica tu identidad mediante correo y descifra con tu PIN en este dispositivo.
            </p>
          </div>
        </header>

        <div className="w-full bg-[#1C1C1E] border border-white/5 rounded-[28px] p-6 sm:p-8 mt-8 shadow-2xl flex flex-col gap-6">
          <section className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Paso A: Verifica tu correo
              </h2>
            </div>

            <form onSubmit={handleSendOtp} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Introduce tu correo de destinatario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#CCFF00]/50 transition-colors"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="bg-[#CCFF00] text-black font-bold text-xs px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-transform cursor-pointer shrink-0 uppercase shadow-[0_0_15px_rgba(204,255,0,0.2)] flex items-center justify-center gap-1.5"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar código</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {otpNotice && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#CCFF00]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{otpNotice}</span>
              </div>
            )}

            {otpSent && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <label className="text-xs text-zinc-400 block mb-2 font-medium">
                  Código de verificación (6 dígitos)
                </label>
                <div className="flex items-center justify-between gap-2 max-w-sm">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-12 text-center text-lg font-bold font-mono bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-[#CCFF00] focus:shadow-[0_0_12px_rgba(204,255,0,0.2)] transition-all"
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Paso B: Introduce el PIN
              </h2>
            </div>

            <form onSubmit={handleDecrypt} className="flex flex-col">
              <div className="relative mb-2">
                <input
                  type="password"
                  required
                  placeholder="Introduce el PIN de descifrado"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-full py-3 px-5 text-sm text-white placeholder-zinc-500 font-mono tracking-widest outline-none focus:border-[#CCFF00]/50 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {error && (
                <div className="mt-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isDecrypting}
                className="w-full bg-[#CCFF00] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold text-base py-3.5 rounded-full transition-transform cursor-pointer mt-5 shadow-[0_0_20px_rgba(204,255,0,0.25)] uppercase flex items-center justify-center gap-2"
              >
                {isDecrypting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando y descifrando...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Verificar y desencriptar</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
