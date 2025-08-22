"use client";

import Card3 from "../components/ui/Card3";
import Image from "next/image";
import Gift from "../assets/gift-icon.svg";
import Price from "../assets/price.svg";

export default function ClaimReward() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF] px-4">
      <Card3>
        <div className="w-full flex flex-col items-center gap-10">
          <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded px-6 py-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            <div className="relative h-36 mx-auto flex items-center justify-center">
              <Image src={Price} alt="price" fill className="object-contain w-20 h-20" />
              <span className="absolute top-[35%] text-black font-semibold text-lg">
                Prize 1
              </span>
            </div>
            <h2 className="mt-2 tracking-[0.3em] text-xs text-[#cbd5e1]">
              DESCRIPTION OF PRIZE
            </h2>
            <p className="mt-6 text-sm text-[#d1d5db] px-10 leading-relaxed">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout.
            </p>

            <input
              type="text"
              placeholder="ENTER RECEIVING WALLET..."
              className="w-full mt-8 px-4 py-3 bg-[#9292924D] border border-[#929292] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-[#CFCFCF]"
            />

            <p className="mt-2 text-[11px] text-gray-400">
              For Tokens Enter Base Wallet
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full max-w-sm">
            <button className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] py-3 font-semibold text-yellow-400 shadow-[0_0_15px_rgba(210,161,0,0.4)] hover:from-[#362A02] hover:to-[#110E05] hover:text-yellow-300 transition">
              <Image src={Gift} alt="Gift" width={18} height={18} />
              CLAIM YOUR PRIZE
            </button>

            <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
              <p>or</p>
              <p className="underline cursor-pointer hover:text-white">
                DO IT LATER
              </p>
            </div>
          </div>
        </div>
      </Card3>
    </div>
  );
}
