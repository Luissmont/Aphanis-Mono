"use client";

import React, { useState } from "react";
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
}

export function DecryptedContent({
  decryptedText,
  decryptedFile,
  expiresAt,
  onReset,
}: DecryptedContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    if (!decryptedText) return;
    navigator.clipboard.writeText(decryptedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!decryptedFile) return;
    try {
      const bytes = base64ToBytes(decryptedFile.dataBase64);
      const blob = new Blob([bytes as unknown as BlobPart], {
        type: decryptedFile.type || "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = decryptedFile.name || "archivo_descifrado";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const formatExpires = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "23:41:09";
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
            {expiresAt ? `Expira: ${formatExpires(expiresAt)}` : "DESCIFRADO"}
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
                    <span className="text-[#CCFF00]">¡Copiado!</span>
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
                Abrir otro paquete
              </button>
            )}
          </div>
        </div>

        {decryptedFile ? (
          <div className="bg-black/60 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8 text-[#CCFF00]" />
              </div>
              <div>
                <span className="font-bold text-white text-base sm:text-lg block truncate max-w-[220px] sm:max-w-md">
                  {decryptedFile.name}
                </span>
                <span className="text-xs text-zinc-400 mt-1 block">
                  {decryptedFile.type || "Documento binario descifrado"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadFile}
              className="bg-[#CCFF00] text-black font-bold px-7 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform text-sm shrink-0 cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.25)] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar archivo</span>
            </button>
          </div>
        ) : (
          <div className="bg-black/60 rounded-2xl p-6 min-h-[220px] text-white font-mono text-sm sm:text-base leading-relaxed border border-white/5 whitespace-pre-wrap break-words select-text">
            {decryptedText || "No hay contenido disponible"}
          </div>
        )}

        <span className="text-xs text-zinc-500 mt-6 block select-none">
          El contenido ha sido descifrado en memoria y no queda almacenado en ningún servidor.
        </span>
      </div>
    </div>
  );
}
