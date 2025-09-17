"use client";

import { useState } from "react";
import Card2 from "../components/ui/Card2";
import axios from "axios";
import toast from "react-hot-toast";
import Plus from "../assets/plus.svg";
import Star from "../assets/star-arrow.svg";
import Button from "../components/ui/Button";
import Image from "next/image";
import PrizeReveal from "../components/PrizeReveal";
import { useAppStore } from "../store/useAppStore";
import { useTelegram } from "../context/TelegramContext";

export default function TierPage() {
  //const telegramId = useAppStore((state) => state.telegramId);
  const [duration, setDuration] = useState(20);
  const [showPrizeReveal, setShowPrizeReveal] = useState(false);
   const [loading, setloading] = useState(false);
   const { telegramId } = useTelegram();
  const { selectedTier } = useAppStore();
  

const handleStart = async () => {

  // if(!telegramId) return
      try{
        setloading(true)
        const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reward/check-play`,
        {
          telegramId
        }
        );
        setloading(false)
        if(res && res.data && res.data.status){
        toast.error("You have already spun today. Please try again tomorrow.", {
          id: "123",
          duration: 5000,
          icon: '❌'
        })
        return
        }
        setShowPrizeReveal(true);
      }catch(err){
        setloading(false)
      }
      
  };

  if (showPrizeReveal) {
    return <PrizeReveal duration={duration} />; 
  }

  // console.log("selectedTier", selectedTier)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF]">
      <Card2>
        <div className="relative w-full max-w-sm bg-[#14131899] border border-[#333333] rounded px-6 text-center shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#AC8B8B4D] border border-[#AC8B8B] px-4 py-1 rounded text-xs font-thin shadow-md">
            CURRENT TIER{" "}
            <span className="ml-1 text-lg font-semibold text-[#AC8B8B]">
               {selectedTier ? selectedTier.toUpperCase() : "None"}
            </span>
          </div>

          <h2 className="mt-14 text-lg">Customize Your</h2>
          <h1 className="text-2xl font-bold">TidyZen Moments</h1>

          <div className="mt-0">
            <Button
              image={<Image src={Plus} alt="Plus" width={18} height={18} />}
              borderColor="#43411D"
              fromColor="#FFFEEF"
              toColor="#FFFEEF"
              className="text-[#43411D]"
              marginTop="mt-10"
            >
              UPGRADE TIER
            </Button>
            <p className="mt-2 text-xs">More Time, Increased odds</p>
          </div>

          <h3 className="mt-14 text-lg tracking-widest text-open font-thin">
            CHOOSE DURATION
          </h3>

          <div className="m-4 flex flex-col items-center">
            <span className="px-3 py-1 bg-[#737157] text-sm font-semibold rounded-md">
              {duration}s
            </span>
            <input
              type="range"
              min="4"
              max="42"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full mt-3 accent-[#737157]"
            />
            <div className="flex justify-between w-full text-sm mt-1">
              <span>4.2s</span>
              <span>42s</span>
            </div>
          </div>
        </div>

        <Button
          image={<Image src={Star} alt="Star" width={18} height={18} />}
          className="w-full max-w-xs"
          marginTop="mt-10"
          disabled={loading}
          onClick={handleStart}
        >
          {loading?"Loading":"START YOUR MOMENT"}
        </Button>
      </Card2>
    </div>
  );
}
