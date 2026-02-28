"use client";

import Card from "./ui/Card";

export default function TidyLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center font-dm text-[#FFFEEF] bg-gradient-to-b from-[#0a0a0a] to-[#1e293b]">
      <Card paddingY="py-16 md:py-20" className="min-h-[500px] flex flex-col items-center justify-center">
        {/* Coin Animation */}
        <div className="flex justify-center mb-8">
          <div className="coin animate-spin-slow">
            <div className="coin-face">₮</div>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-white text-xl font-bold tracking-widest">
          Loading TidyCoin...
        </h1>
        <p className="mt-3 text-xs text-gray-400">
          Please wait while we prepare your experience
        </p>
      </Card>
    </div>
  );
}
