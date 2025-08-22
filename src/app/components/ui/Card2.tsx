"use client";

import React from "react";

export default function Card2({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/90 p-6">
      <div
        className="relative w-full max-w-sm overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/10 flex flex-col items-center justify-start p-6 py-20"
        style={{
          background: `
            radial-gradient(70% 55% at 0% 0%, #141318 0%, transparent 60%),
            radial-gradient(70% 55% at 100% 0%, #141318 0%, transparent 60%),
            radial-gradient(75% 55% at 50% 18%, #222a27 0%, transparent 60%),
            radial-gradient(70% 55% at 50% 65%, #1f2523 0%, transparent 60%),
            radial-gradient(90% 70% at 50% 100%, rgba(191,243,109,0.35) 0%, rgba(191,243,109,0.12) 35%, transparent 65%),
            linear-gradient(180deg, #0d1411 0%, #0b1210 60%, #0a0f0d 100%)
          `,
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(0,0,0,0.4)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:4px_4px]" />

        <div className="relative z-10 w-full flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
