"use client";

import React, { useEffect, useState } from "react";
import { X, Users, Mail, Plus } from "lucide-react";

interface GroupMember {
  email: string;
}

interface GroupItem {
  id: string;
  name: string;
  created_at?: string;
  group_members?: GroupMember[];
}

export default function GruposPage() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);
  const [name, setName] = useState("");
  const [emailsText, setEmailsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(Array.isArray(data) ? data : []);
      }
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingGroup(null);
    setName("");
    setEmailsText("");
    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group: GroupItem) => {
    setEditingGroup(group);
    setName(group.name);
    setEmailsText((group.group_members ?? []).map((m) => m.email).join(", "));
    setError("");
    setIsModalOpen(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del grupo es requerido.");
      return;
    }

    const emails = Array.from(
      new Set(
        emailsText
          .split(",")
          .map((em) => em.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    try {
      setSubmitting(true);
      setError("");

      const url = editingGroup
        ? `/api/groups/${editingGroup.id}`
        : "/api/groups";
      const method = editingGroup ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, emails }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al procesar la solicitud");
      }

      setIsModalOpen(false);
      await loadGroups();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este grupo?")) {
      return;
    }

    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al eliminar el grupo");
        return;
      }

      await loadGroups();
    } catch {
      alert("Error al eliminar el grupo");
    }
  };

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
          onClick={handleOpenCreateModal}
          className="bg-[#CCFF00] text-black font-bold px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform shrink-0 self-start sm:self-auto cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.25)] text-sm uppercase flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO GRUPO</span>
        </button>
      </header>

      {loading ? (
        <div className="mt-8 py-16 text-center text-zinc-500 text-sm">
          Cargando grupos...
        </div>
      ) : groups.length === 0 ? (
        <div className="mt-12 bg-[#1C1C1E] border border-white/5 rounded-[24px] p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">No tienes grupos aún</h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Crea tu primer grupo para enviar paquetes cifrados a múltiples
            personas rápidamente.
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="mt-6 bg-[#CCFF00] text-black font-bold px-6 py-2.5 rounded-full text-xs uppercase hover:scale-105 transition-transform cursor-pointer"
          >
            Crear mi primer grupo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {groups.map((group) => {
            const members = group.group_members ?? [];
            const membersCount = members.length;
            const previewEmails = members.slice(0, 3);
            const remaining = membersCount - previewEmails.length;

            return (
              <div
                key={group.id}
                className="bg-[#1C1C1E] border border-white/5 rounded-[24px] p-6 flex flex-col justify-between h-72 hover:border-white/10 transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-bold text-white truncate max-w-[200px]">
                      {group.name}
                    </h2>
                  </div>
                  <span className="text-xs text-[#CCFF00] font-medium block mb-4">
                    {membersCount} {membersCount === 1 ? "miembro" : "miembros"}
                  </span>

                  <div className="flex flex-col gap-2">
                    {previewEmails.length > 0 ? (
                      <>
                        {previewEmails.map((member) => (
                          <div
                            key={member.email}
                            className="flex items-center gap-2 text-xs text-zinc-300 truncate"
                          >
                            <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        ))}
                        {remaining > 0 && (
                          <span className="text-xs text-zinc-500 font-medium pl-5">
                            ... y {remaining} más
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-zinc-500 font-medium">
                        Sin correos asignados
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(group)}
                    className="text-xs font-semibold text-white/80 hover:text-white px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-white/10 rounded-[28px] w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingGroup ? "Editar Grupo" : "Nuevo Grupo"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Nombre del grupo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Contabilidad, Proveedores..."
                  className="w-full bg-black/50 border border-white/10 rounded-full py-3 px-5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#CCFF00]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Correos electrónicos
                </label>
                <textarea
                  value={emailsText}
                  onChange={(e) => setEmailsText(e.target.value)}
                  placeholder="Ingresa correos separados por comas (ej. ana@empresa.com, luis@empresa.com)"
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#CCFF00]/50 resize-none transition-colors"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Separa múltiples correos con comas.
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#CCFF00] text-black font-bold px-7 py-2.5 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-transform cursor-pointer text-sm uppercase shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
