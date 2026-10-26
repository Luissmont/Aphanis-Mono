import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row bg-black bg-no-repeat bg-left bg-cover"
      style={{ backgroundImage: "url('/auth-bg.png')" }}
    >
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 select-none">
        <div className="relative w-36 h-32 mb-6">
          <div className="w-12 h-12 bg-black rotate-45 rounded-sm absolute top-0 left-1/2 -translate-x-1/2" />
          <svg viewBox="0 0 24 24" className="w-14 h-14 fill-black absolute bottom-0 left-0" aria-hidden="true">
            <polygon points="12,2 22,22 2,22" />
          </svg>
          <div className="w-12 h-12 bg-black rounded-full absolute bottom-0 right-0" aria-hidden="true" />
        </div>
        <h1 className="text-6xl font-black tracking-widest text-black uppercase font-sans text-center">
          APHANIS
        </h1>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-[#1C1C1E] rounded-[36px] p-8 sm:p-10 border border-white/5 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
