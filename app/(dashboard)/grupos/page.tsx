"use client";

import React, { useEffect, useState } from "react";

interface GroupItem {
  id: string;
  name: string;
  membersCount: number;
  emails?: string[];
  remainingCount?: number;
}

export default function GruposPage() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div
            className="w-14 h-14 bg-[#CCFF00] rounded-sm shrink-0 mt-1 shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            aria-hidden="true"
          />
          <div>
            <span className="text-[#CCFF00] font-bold text-xs uppercase tracking-wider block mb-1">
              GESTIÓN DE DESTINATARIOS
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-wide">
              Mis grupos
            </h1>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base">
              Crea y administra listas de correos para tus envíos frecuentes.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="bg-[#CCFF00] text-black font-bold px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform shrink-0 self-start sm:self-auto cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.25)] text-sm uppercase"
        >
          NUEVO GRUPO
        </button>
      </header>

      {loading ? (
        <div className="mt-8 py-12 text-center text-zinc-500 text-sm">
          Cargando grupos...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 flex flex-col justify-between h-64"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">{group.name}</h2>
                </div>
                <span className="text-xs text-zinc-400 font-medium block mb-4">
                  {group.membersCount} miembros
                </span>

                <div className="flex flex-col gap-1.5">
                  {group.emails && group.emails.length > 0 ? (
                    <>
                      {group.emails.map((email) => (
                        <span
                          key={email}
                          className="text-xs text-zinc-400 truncate"
                        >
                          {email}
                        </span>
                      ))}
                      {group.remainingCount ? (
                        <span className="text-xs text-zinc-500 font-medium">
                          ... y {group.remainingCount} más
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-xs text-zinc-500 font-medium">
                      Lista sincronizada con la API
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  className="text-xs font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-400/80 hover:text-red-400 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
