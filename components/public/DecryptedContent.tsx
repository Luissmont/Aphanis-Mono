"use client";

import React, { useEffect, useState } from "react";
import { Copy, Check, Download, FileText, Lock } from "lucide-react";
import { base64ToBytes } from "@/lib/crypto";

export interface DecryptedFile {
  name: string;
  type: string;
  dataBase64: string;
}

interface DecryptedContentProps {
  decryptedText?: string | null;
  decryptedFile?: DecryptedFile | null;
  expiresAt?: string | null;
  onReset?: () => void;
  onExpired?: () => void;
}

export function DecryptedContent({
  decryptedText,
  decryptedFile,
  expiresAt,
  onReset,
  onExpired,
}: DecryptedContentProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("00:00:00 — EXPIRADO");
        onExpired?.();
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      setTimeLeft(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const handleCopyText = () => {
    if (!decryptedText) return;
    navigator.clipboard.writeText(decryptedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!decryptedFile) return;
    try {
      const sanitizedName = (
        decryptedFile.name || "archivo_descifrado"
      ).replace(/[^a-zA-Z0-9._-]/g, "_");
      const isDangerousExt = /\.(svg|html|htm|js|xml)$/i.test(sanitizedName);
      const mimeType = isDangerousExt
        ? "application/octet-stream"
        : decryptedFile.type || "application/octet-stream";

      const bytes = base64ToBytes(decryptedFile.dataBase64);
      const blob = new Blob([bytes as unknown as BlobPart], {
        type: mimeType,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = sanitizedName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div
            className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            aria-hidden="true"
          />
          <div>
            <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
              CONTENIDO DESBLOQUEADO
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
              Transferencia segura
            </h1>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 text-white font-bold text-sm sm:text-base tracking-wider shrink-0 self-start sm:self-auto select-none flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#CCFF00]" />
          <span>
            {timeLeft
              ? timeLeft.includes("EXPIRADO")
                ? timeLeft
                : `Expira: ${timeLeft}`
              : "DESCIFRADO"}
          </span>
        </div>
      </header>

      <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 sm:p-8 mt-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase text-zinc-400 font-medium tracking-wider block mb-1">
              CONTENIDO DESCIFRADO
            </span>
            <h2 className="text-lg font-bold text-white">
              Disponible en este dispositivo
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {decryptedText && (
              <button
                type="button"
                onClick={handleCopyText}
                className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span className="text-[#CCFF00]">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>
            )}

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>

        {decryptedText && (
          <div className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 sm:p-6 font-mono text-sm sm:text-base text-zinc-200 leading-relaxed whitespace-pre-wrap break-words select-text">
            {decryptedText}
          </div>
        )}

        {decryptedFile && (
          <div className="bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#CCFF00] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-base font-bold text-white truncate">
                  {decryptedFile.name}
                </h3>
                <span className="text-xs text-zinc-400 block mt-0.5 truncate">
                  {decryptedFile.type || "Archivo binario"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadFile}
              className="bg-[#CCFF00] text-black font-bold text-sm px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
            >
              <Download className="w-4 h-4" />
              <span>Descargar archivo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
