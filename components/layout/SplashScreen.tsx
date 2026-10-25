import React from "react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#CCFF00]">
      <div className="flex items-center gap-6 mb-6">
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-12 fill-black animate-[spin_3s_linear_infinite]"
          aria-hidden="true"
        >
          <polygon points="12,2 22,22 2,22" />
        </svg>

        <div
          className="w-10 h-10 bg-black rotate-45 animate-[spin_3s_linear_infinite]"
          aria-hidden="true"
        />

        <div
          className="w-12 h-12 bg-black rounded-full animate-[spin_3s_linear_infinite]"
          aria-hidden="true"
        />
      </div>

      <h1 className="text-6xl font-black tracking-widest text-black uppercase font-sans select-none">
        APHANIS
      </h1>
    </div>
  );
}

export default SplashScreen;
