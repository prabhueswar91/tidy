"use client";

import { useState,useEffect } from "react";
import Card2 from "../components/ui/Card2";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Plus from "../assets/plus.svg";
import Star from "../assets/star-arrow.svg";
import Button from "../components/ui/Button";
import Image from "next/image";
import PrizeReveal from "../components/PrizeReveal";
import { useAppStore } from "../store/useAppStore";
import { useTelegram } from "../context/TelegramContext";
import { useRouter,usePathname } from "next/navigation";
import { UserContext } from "../context/UserContext";

export default function TierPage() {
  const [duration, setDuration] = useState(20);
  const [showPrizeReveal, setShowPrizeReveal] = useState(false);
  const [loading, setloading] = useState(false);
  const searchParams = useSearchParams();
  const { telegramId } = useTelegram();
  // const telegramId = 6195798875;
  const { selectedTier, zenCode } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo, getUserInfo } = UserContext();
  const zen_code = searchParams.get("zen_code");

  console.log(zen_code,'zenCodezenCodezenCode',zenCode)

  useEffect(() => {
    if (zen_code) {
      try {
          checkCode()
      } catch (err) {
        console.error("Failed to decrypt payload", err);
      }
    }
  }, [zen_code]);

  function checkCode(){
    setShowPrizeReveal(false);
    setDuration(20);
  }

  const handleStart = async () => {
      // setShowPrizeReveal(true);
    if (!telegramId) {
      toast.error("Telegram ID not found");
      return;
    }
    try {
      setloading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reward/check-play`,
        {
          telegramId,
          tier: selectedTier,
          zenCode: zen_code ? zen_code : null,
        }
      );
      setloading(false);
      if (res && res.data && res.data.error) {
        toast.error(res.data.error, {
          id: "123",
          duration: 5000,
          icon: "❌",
        });
        return;
      } else if (res && res.data && res.data.status) {
        toast.error("You have used your daily Zen moment. Please come back tomorrow or upgrade your tier to continue", {
          id: "123",
          duration: 5000,
          icon: "❌",
        });
        return;
      }
      
      setShowPrizeReveal(true);
    } catch (err) {
      setloading(false);
    }
  };

  if (showPrizeReveal) {
    return <PrizeReveal duration={duration} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF]">
      <Card2>
        <div className="relative w-full max-w-sm bg-[#14131899] border border-[#333333] rounded px-6 text-center shadow-[0_4px_30px_rgba(0,0,0,0.9)] mt-10">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#AC8B8B4D] border border-[#AC8B8B] px-4 py-1 rounded text-[10px] font-dm font-[600] shadow-md uppercase text-[#AC8B8B]">
            CURRENT TIER{" "}
            <span className="ml-1 text-[20px] font-semibold font-dm text-[#AC8B8B]">
              {selectedTier ? selectedTier.toUpperCase() : "None"}
            </span>
          </div>

          <p className="mt-14 font-open font-normal text-[18px] leading-[170%] tracking-[-0.06em] text-[#FFFEEF]">
            Customize Your
          </p>
          <p className="font-open font-semibold text-[26px] leading-[170%] tracking-[-0.05em] text-[#FFFEEF]">
            TidyZen Moments
          </p>

          <div className="mt-0">
            <Button
              image={<Image src={Plus} alt="Plus" width={18} height={18} />}
              borderColor="#43411D"
              className="text-[#43411D] bg-[#FFFEEF] text-[16px] font-semibold"
              onClick={() => router.push("/?upgrade=true")}
              disabled={userInfo?.tier=="GOLD"?true:false}
            >
              UPGRADE TIER
            </Button>
            <p className="mt-2 font-dm text-sm font-[500]">
              More Time, Increased odds
            </p>
          </div>

          <h3 className="mt-14 text-[18px] font-open  font-[400] leading-[170%] tracking-[0.16em]">
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
          image={<Image src={Star} alt="Star" width={20} height={20} />}
          className="w-full font-open fs-[18px] leading-[170%] font-[600] max-w-xs bg-[linear-gradient(90deg,#242424_0%,#525252_100%)]"
          marginTop="mt-10"
          disabled={loading}
          onClick={handleStart}
        >
          {loading ? "Loading" : "START YOUR MOMENT"}
        </Button>
      </Card2>
    </div>
  );
}
