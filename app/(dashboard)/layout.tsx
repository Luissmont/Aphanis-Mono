import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#000000] text-[#FFFFFF]">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto bg-[#000000]">
        {children}
      </main>
    </div>
  );
}

