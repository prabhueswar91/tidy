"use client";

import React from "react";

export default function NeonLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1e293b]">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 border-b-pink-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-pink-500 rounded-full animate-ping animation-delay-200"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-cyan-400 rounded-full animate-ping animation-delay-400"></div>
        </div>
      </div>
      <p className="absolute bottom-10 text-white font-semibold text-lg animate-pulse">
        Loading your Zen...
      </p>
    </div>
  );
}
