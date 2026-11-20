"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Inbox, Users, History, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Crear envío", href: "/", icon: Plus },
  { label: "Recibir", href: "/recibir", icon: Inbox },
  { label: "Mis grupos", href: "/grupos", icon: Users },
  { label: "Estado 410", href: "/estado-410", icon: History },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className={`h-full p-4 flex flex-col shrink-0 select-none transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div
        className={`relative w-full h-full bg-[#1C1C1E] rounded-[32px] flex flex-col justify-between border border-white/5 shadow-2xl transition-all duration-300 ${
          isCollapsed ? "p-3 items-center" : "p-6"
        }`}
      >
        <div className="w-full">
          <div
            className={`relative flex items-center mb-10 pt-2 transition-all duration-300 ${
              isCollapsed ? "justify-center" : "justify-between px-1"
            }`}
          >
            {!isCollapsed && (
              <h1 className="text-4xl font-black tracking-wider text-white uppercase font-sans truncate">
                APHANIS
              </h1>
            )}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-8 h-8 bg-[#CCFF00] rounded-md shrink-0 shadow-[0_0_16px_rgba(204,255,0,0.35)] hover:scale-110 active:scale-95 transition-transform duration-500 ease-in-out cursor-pointer ${
                isCollapsed ? "rotate-45" : "rotate-[225deg] -mr-3"
              }`}
              aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            />
          </div>

          <nav className="flex flex-col gap-4 w-full" aria-label="Menú principal">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full py-3.5 rounded-full backdrop-blur-md flex items-center transition-all duration-300 cursor-pointer ${
                    isCollapsed
                      ? "justify-center px-0"
                      : "justify-center px-6 gap-3"
                  } ${
                    isActive
                      ? "bg-white/15 border border-white/30 text-[#CCFF00] font-semibold"
                      : "bg-white/5 border border-white/10 text-zinc-400 font-medium hover:text-white hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 w-full">
          <button
            type="button"
            onClick={handleSignOut}
            className={`w-full py-3.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold text-sm flex items-center transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 active:scale-[0.98] cursor-pointer ${
              isCollapsed
                ? "justify-center px-0"
                : "justify-center px-4 text-center"
            }`}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <span className="ml-2 truncate">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
