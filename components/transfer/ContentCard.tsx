"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

interface ContentCardProps {
  contentType: "text" | "file";
  setContentType: (type: "text" | "file") => void;
  secretText: string;
  setSecretText: (val: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export function ContentCard({
  contentType,
  setContentType,
  secretText,
  setSecretText,
  selectedFile,
  setSelectedFile,
}: ContentCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleTabChange = (type: "text" | "file") => {
    setFileError("");
    setContentType(type);
  };

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-2 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-zinc-400 block">01</span>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Contenido
          </h2>
        </div>

        <div className="bg-black/60 p-1 rounded-full border border-white/5 flex gap-1">
          <button
            type="button"
            onClick={() => handleTabChange("text")}
            className={`py-1 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              contentType === "text"
                ? "bg-white/10 text-white shadow-sm"
                : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Texto plano
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("file")}
            className={`py-1 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              contentType === "file"
                ? "bg-white/10 text-white shadow-sm"
                : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Archivo
          </button>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        {contentType === "text" ? (
          <textarea
            value={secretText}
            onChange={(e) => setSecretText(e.target.value)}
            className="w-full h-full bg-black/50 rounded-2xl border border-white/5 p-4 text-sm text-white placeholder-zinc-500 resize-none outline-none focus:border-white/20 transition-colors"
            placeholder="Escribe o pega aquí la información confidencial..."
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-between">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (file.size > 10 * 1024 * 1024) {
                  setFileError("El archivo excede el límite máximo permitido de 10 MB.");
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  return;
                }

                setFileError("");
                setSelectedFile(file);
              }}
              className="hidden"
            />

            {selectedFile ? (
              <div className="w-full h-full bg-black/50 rounded-2xl border border-white/10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-[#CCFF00]" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block truncate max-w-[200px] sm:max-w-xs">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-zinc-400 mt-1 block">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileError("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="p-2 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Quitar archivo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setFileError("");
                  fileInputRef.current?.click();
                }}
                className="w-full h-full bg-black/50 rounded-2xl border border-dashed border-white/10 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-colors group"
              >
                <Upload className="w-12 h-12 text-white/90 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-sm font-semibold text-white">
                  Subir Archivo
                </span>
                <span className="text-xs text-zinc-500 mt-1">
                  Máximo 10 MB. Haz clic para seleccionar cualquier documento
                </span>
              </div>
            )}

            {fileError && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                {fileError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
