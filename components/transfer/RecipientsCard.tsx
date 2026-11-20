"use client";

import React from "react";
import { ChevronDown, Plus, X } from "lucide-react";

export interface GroupOption {
  id: string;
  name: string;
  group_members?: { email: string }[];
}

interface RecipientsCardProps {
  recipients: string[];
  setRecipients: React.Dispatch<React.SetStateAction<string[]>>;
  groups: GroupOption[];
  onSelectGroup: (groupId: string) => void;
}

export function RecipientsCard({
  recipients,
  setRecipients,
  groups,
  onSelectGroup,
}: RecipientsCardProps) {
  const handleEmailChange = (index: number, value: string) => {
    const updated = [...recipients];
    updated[index] = value;
    setRecipients(updated);
  };

  const handleAddRecipient = () => {
    if (recipients.length >= 30) return;
    setRecipients([...recipients, ""]);
  };

  const handleRemoveRecipient = (index: number) => {
    if (recipients.length === 1) {
      setRecipients([""]);
      return;
    }
    const updated = recipients.filter((_, i) => i !== index);
    setRecipients(updated);
  };

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-1 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">04</span>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Destinatarios (Whitelist)
          </h2>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-zinc-400 font-medium">
              Correos autorizados ({recipients.filter((e) => e.trim()).length}/30)
            </label>
            <button
              type="button"
              onClick={handleAddRecipient}
              className="text-xs font-bold text-[#CCFF00] hover:scale-105 transition-transform flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {recipients.map((email, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(idx, e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-black/50 border border-white/5 rounded-full py-2 px-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-[#CCFF00]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRecipient(idx)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                  title="Quitar destinatario"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Añadir desde Mis grupos
          </label>
          <div className="relative">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onSelectGroup(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 px-4 pr-10 text-sm text-white font-medium cursor-pointer hover:border-white/10 transition-colors appearance-none outline-none"
            >
              <option value="" disabled className="bg-[#1C1C1E] text-zinc-400">
                Seleccionar un grupo
              </option>
              {groups.map((group) => (
                <option
                  key={group.id}
                  value={group.id}
                  className="bg-[#1C1C1E] text-white"
                >
                  {group.name} ({group.group_members?.length ?? 0} miembros)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
