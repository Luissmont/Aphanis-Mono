"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export interface GroupOption {
  id: string;
  name: string;
  group_members?: { email: string }[];
}

interface RecipientsCardProps {
  recipientsText: string;
  setRecipientsText: (val: string) => void;
  groups: GroupOption[];
  onSelectGroup: (groupId: string) => void;
}

export function RecipientsCard({
  recipientsText,
  setRecipientsText,
  groups,
  onSelectGroup,
}: RecipientsCardProps) {
  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 lg:col-span-1 flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <span className="text-xs text-zinc-400 block">04</span>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Destinatarios
          </h2>
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Correos electrónicos
          </label>
          <input
            type="text"
            value={recipientsText}
            onChange={(e) => setRecipientsText(e.target.value)}
            placeholder="ejemplo@correo.com, otro@correo.com"
            className="w-full bg-black/50 border border-white/5 rounded-full py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
            Mis grupos
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
