import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex w-full">
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-[#CCFF00] p-12 relative select-none">
        <div className="flex items-center gap-6 mb-8">
          <svg viewBox="0 0 24 24" className="w-14 h-14 fill-black" aria-hidden="true">
            <polygon points="12,2 22,22 2,22" />
          </svg>
          <div className="w-12 h-12 bg-black rotate-45 rounded-sm" aria-hidden="true" />
          <div className="w-14 h-14 bg-black rounded-full" aria-hidden="true" />
        </div>
        <h1 className="text-7xl font-black tracking-widest text-black uppercase font-sans">
          APHANIS
        </h1>
      </div>

      <div className="w-full lg:w-1/2 bg-[#1C1C1E] sm:bg-transparent flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}

