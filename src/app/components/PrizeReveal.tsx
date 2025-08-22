"use client";

import Card3 from "../components/ui/Card3";
import Image from "next/image";
import CircleImg from "../assets/circle.svg";
import Button from "./ui/Button";
import Gift from "../assets/gift-icon.svg";

export default function PrizeReveal() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF] px-4">
      <Card3>
        <div className="w-full flex flex-col items-center gap-6 sm:gap-8">
          {/* inner card */}
          <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded-xl px-4 sm:px-6 py-2 text-center shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            <Image
              src={CircleImg}
              alt="Circle"
              className="mx-auto max-w-[180px] sm:max-w-[220px] h-60"
              width={220}
              height={220}
            />
            <h1 className="mt-6 text-2xl sm:text-3xl font-bold">12:10</h1>
            <p className="text-xs sm:text-sm tracking-widest text-[#cbd5e1]">
              SECONDS
            </p>

            <input
              type="range"
              min="4"
              max="42"
              defaultValue="12"
              className="w-full mt-6 accent-[#737157]"
            />

            <p className="mt-4 text-[10px] sm:text-xs">
              YOUR PRIZE WILL BE REVEALED AFTER.....
            </p>
          </div>

          {/* button below */}
          <Button
            image={<Image src={Gift} alt="Gift" width={18} height={18} />}
            className="w-full max-w-sm"
            borderColor="#D2A100"
            fromColor="#110E05"
            toColor="#362A02"
          >
            REVEAL YOUR PRIZE
          </Button>
        </div>
      </Card3>
    </div>
  );
}
