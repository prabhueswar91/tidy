"use client";

import React from "react";
import BgCard from "../assets/card-1.png";
import Image from "next/image";
import Trophy from "../assets/trophy.svg";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation";
import Close from "../assets/close.svg";

export default function XP() {
  const router = useRouter();
  return (
    <div className="relative bg-[#141318]/40 w-full min-h-screen flex justify-center text-[#FFFEEF] font-dm p-4 overflow-auto scrollbar-hide">
      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="relative w-full max-w-3xl flex flex-col items-center mx-auto space-y-4 mt-4">
        <div className="page-title text-xl font-semibold">
          XP & Leaderboards
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 w-[120] h-[2px] bg-gradient-to-r from-[#765F0F00] to-[#DCB11C]" />

          <span className="text-xs font-medium text-[#FFFEEF] tracking-wide">
            How It Works
          </span>

          <div className="flex-1 h-[2px] bg-gradient-to-l from-[#765F0F00] to-[#DCB11C]" />
        </div>

        <div className="w-full bg-[#14131866]/40 border-[1.5px] border-[#333333] rounded-md p-4">
          <ul className="list-disc list-outside pl-5 flex flex-col gap-2 text-sm text-[#FFFEEF]">
            <li>
              <span className="font-medium">Win $TIDY</span> →
              <span className="text-xs font-light">
                {" "}
                Earn XP (10 $TIDY = 1 XP)
              </span>
            </li>
            <li>
              <span className="font-medium">Invite Friends</span> →
              <span className="text-xs font-light"> 750 XP</span>
            </li>
            
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="border border-[#765F0F] bg-[#0000004D]/30 rounded-md p-4 text-center">
            <span className="relative inline-block text-sm font-light text-[#FFFEEF]">
              Weekly
              <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-gradient-to-r from-[#7E7E7E4D]/30 via-[#7E7E7E4D]/80 to-[#7E7E7E4D]/30" />
            </span>

            <p className="mt-4 text-xs text-[#FFFEEF99]">resets weekly</p>
          </div>
          <div className="border border-[#765F0F] bg-[#0000004D]/30 rounded-md p-4 text-center">
            <span className="relative inline-block text-sm font-light text-[#FFFEEF]">
              Monthly
              <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-gradient-to-r from-[#7E7E7E4D]/30 via-[#7E7E7E4D]/80 to-[#7E7E7E4D]/30" />
            </span>

            <p className="mt-4 text-xs text-[#FFFEEF99]">resets monthly</p>
          </div>
          <div className="border border-[#765F0F] bg-[#0000004D]/30 rounded-md p-4 text-center">
            <p className="text-sm font-light text-[#FFFEEF] mb-2">All Time</p>

            <div className="h-[2px] w-full bg-gradient-to-r from-[#7E7E7E4D]/30 via-[#7E7E7E4D]/80 to-[#7E7E7E4D]/30" />

            <p className="mt-2 text-xs text-[#FFFEEF99]">never resets</p>
          </div>
        </div>
        <div className="w-full flex bg-[#DCB11C33]/20 border-[1px] border-[#DCB11C] rounded-md p-4">
          <div className="flex justify-center items-center ml-4 font-semibold text-lg text-[#FFFEEF]">
            <Image
              src={Trophy}
              alt="Search"
              width={20}
              height={20}
              className="mr-3 w-8 h-8"
            />
            Rewards for top ranks Coming soon
          </div>
        </div>
        {/* <div className="w-full mx-4 !mt-12">
          <Button 
            borderColor="#D2A100"
            className="w-fulltext-[#FFFEEF] bg-gradient-to-r from-[#110E05] to-[#362A02] text-[16px] font-semibold px-4 !py-2"
            onClick={() => alert("Wallets linked!")}
          >
            SAVE WALLET
          </Button>
        </div> */}
      </div>
    </div>
  );
}
