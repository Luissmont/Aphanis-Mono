"use client";

import React, { useState } from "react";
import { ContentCard } from "@/components/transfer/ContentCard";
import { LimitsCard } from "@/components/transfer/LimitsCard";
import { PinCard } from "@/components/transfer/PinCard";
import { RecipientsCard } from "@/components/transfer/RecipientsCard";
import { generateSecureKey, importKeyFromPin, encryptData } from "@/lib/crypto";
import { CheckCircle2, Copy } from "lucide-react";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdTransfer, setCreatedTransfer] = useState<{
    accessCode: string;
    pin: string;
  } | null>(null);

  const handleCreateTransfer = async () => {
    try {
      setIsProcessing(true);

      const pin = await generateSecureKey();
      const key = await importKeyFromPin(pin);
      const data = new TextEncoder().encode("Mensaje de prueba");
      const encryptedBlob = await encryptData(data, key);

      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encrypted_blob: encryptedBlob,
          content_type: "text",
          max_opens: 3,
          expires_in_hours: 24,
        }),
      });

      const result = await response.json();

      setCreatedTransfer({
        accessCode: result.access_code || "APH-1234",
        pin,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      <header>
        <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
          NUEVA TRANSFERENCIA
        </span>
        <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
          Crear envío seguro
        </h1>
        <p className="text-zinc-400 mt-2 text-sm sm:text-base">
          Cifra texto o archivos y controla quién puede acceder.
        </p>
      </header>

      {createdTransfer ? (
        <div className="mt-8 bg-[#1C1C1E] border border-[#CCFF00]/30 rounded-[24px] p-8 max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#CCFF00]" />
            <h2 className="text-xl font-bold text-white">
              ¡Transferencia cifrada creada con éxito!
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
              Enlace de descarga
            </span>
            <div className="bg-black/50 border border-white/5 rounded-full py-2.5 px-4 flex items-center justify-between text-sm text-zinc-300">
              <span className="truncate">
                {origin}/t/{createdTransfer.accessCode}
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${origin}/t/${createdTransfer.accessCode}`
                  )
                }
                className="text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
              PIN de Descifrado (Zero-Knowledge)
            </span>
            <div className="bg-black/50 border border-white/5 rounded-full py-2.5 px-4 flex items-center justify-between text-sm font-mono text-[#CCFF00]">
              <span className="truncate">{createdTransfer.pin}</span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(createdTransfer.pin)
                }
                className="text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Guarda este PIN. Nunca se almacena en el servidor y es necesario
              para desbloquear el paquete.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreatedTransfer(null)}
            className="mt-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 px-6 rounded-full self-start transition-colors cursor-pointer"
          >
            Crear otro paquete
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <ContentCard />
            <LimitsCard />
            <PinCard />
            <RecipientsCard />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleCreateTransfer}
              className="bg-[#CCFF00] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-black font-bold px-8 py-3.5 rounded-full transition-transform cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.3)] text-sm uppercase tracking-wide"
            >
              {isProcessing ? "Procesando..." : "Crear Enlace Mágico"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
