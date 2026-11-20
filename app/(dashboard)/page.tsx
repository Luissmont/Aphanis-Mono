"use client";

import React, { useEffect, useState } from "react";
import { ContentCard } from "@/components/transfer/ContentCard";
import { LimitsCard } from "@/components/transfer/LimitsCard";
import { PinCard } from "@/components/transfer/PinCard";
import {
  RecipientsCard,
  type GroupOption,
} from "@/components/transfer/RecipientsCard";
import {
  generateSecureKey,
  importKeyFromPin,
  encryptData,
  hashPin,
  bytesToBase64,
} from "@/lib/crypto";
import { CheckCircle2, Copy, AlertTriangle } from "lucide-react";

export default function Home() {
  const [contentType, setContentType] = useState<"text" | "file">("text");
  const [secretText, setSecretText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [maxOpens, setMaxOpens] = useState(3);
  const [pin, setPin] = useState("");
  const [recipients, setRecipients] = useState<string[]>([""]);
  const [groups, setGroups] = useState<GroupOption[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [createdTransfer, setCreatedTransfer] = useState<{
    accessCode: string;
    pin: string;
    warning?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/groups")
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => {
        setGroups(data);
      })
      .catch(() => {});
  }, []);

  const handleGeneratePin = async () => {
    const generated = await generateSecureKey();
    setPin(generated);
    setError("");
  };

  const handleSelectGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group || !group.group_members) return;

    const newEmails = group.group_members.map((m) =>
      m.email.trim().toLowerCase()
    );
    const existing = recipients
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const combined = Array.from(new Set([...existing, ...newEmails]));
    setRecipients(combined.length > 0 ? combined : [""]);
  };

  const handleCreateTransfer = async () => {
    setError("");

    if (contentType === "text" && !secretText.trim()) {
      setError("Por favor escribe el contenido de la transferencia.");
      return;
    }

    if (contentType === "file" && !selectedFile) {
      setError("Por favor selecciona un archivo para enviar.");
      return;
    }

    if (!pin.trim()) {
      setError("Por favor ingresa o genera un PIN de descifrado.");
      return;
    }

    if (pin.trim().length < 6) {
      setError("El PIN debe tener al menos 6 caracteres para garantizar la seguridad.");
      return;
    }

    const cleanRecipients = Array.from(
      new Set(
        recipients
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    if (cleanRecipients.length > 30) {
      setError("El límite máximo es de 30 destinatarios.");
      return;
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of cleanRecipients) {
      if (!EMAIL_REGEX.test(email)) {
        setError(`El formato de correo "${email}" no es válido.`);
        return;
      }
    }

    try {
      setIsProcessing(true);

      let payloadBytes: Uint8Array;

      if (contentType === "file") {
        const arrayBuffer = await selectedFile!.arrayBuffer();
        const base64Data = bytesToBase64(new Uint8Array(arrayBuffer));
        const filePayload = JSON.stringify({
          name: selectedFile!.name,
          type: selectedFile!.type,
          dataBase64: base64Data,
        });
        payloadBytes = new TextEncoder().encode(filePayload);
      } else {
        payloadBytes = new TextEncoder().encode(secretText);
      }

      const key = await importKeyFromPin(pin);
      const encryptedBlob = await encryptData(payloadBytes, key);
      const pinHash = await hashPin(pin);

      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encrypted_blob: encryptedBlob,
          content_type: contentType,
          max_opens: maxOpens,
          expires_in_hours: expiresInHours,
          pin_hash: pinHash,
          recipients: cleanRecipients,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al crear la transferencia");
      }

      setCreatedTransfer({
        accessCode: result.access_code,
        pin,
        warning:
          result.warning ||
          (result.email_status && !result.email_status.sent
            ? result.email_status.warning
            : undefined),
      });
    } catch (err) {
      setError((err as Error).message);
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
          Cifra texto o archivos y controla quién puede acceder mediante lista blanca y OTP.
        </p>
      </header>

      {createdTransfer ? (
        <div className="mt-8 bg-[#1C1C1E] border border-[#CCFF00]/30 rounded-[24px] p-8 max-w-2xl mx-auto flex flex-col gap-6 shadow-2xl">
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
                {origin}/{createdTransfer.accessCode}
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${origin}/${createdTransfer.accessCode}`
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

          {createdTransfer.warning && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3 text-yellow-300 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
              <div>
                <strong className="block font-bold mb-0.5 text-yellow-400">
                  Aviso sobre las notificaciones por correo:
                </strong>
                <span>{createdTransfer.warning}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setCreatedTransfer(null);
              setSecretText("");
              setSelectedFile(null);
              setPin("");
              setRecipients([""]);
            }}
            className="mt-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 px-6 rounded-full self-start transition-colors cursor-pointer"
          >
            Crear otro paquete
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <ContentCard
              contentType={contentType}
              setContentType={setContentType}
              secretText={secretText}
              setSecretText={setSecretText}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            <LimitsCard
              expiresInHours={expiresInHours}
              setExpiresInHours={setExpiresInHours}
              maxOpens={maxOpens}
              setMaxOpens={setMaxOpens}
            />
            <PinCard
              pin={pin}
              setPin={setPin}
              onGeneratePin={handleGeneratePin}
            />
            <RecipientsCard
              recipients={recipients}
              setRecipients={setRecipients}
              groups={groups}
              onSelectGroup={handleSelectGroup}
            />
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}

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
