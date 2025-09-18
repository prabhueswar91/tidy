"use client";

import { useEffect, useState } from "react";
import Card3 from "../components/ui/Card3";
import Invite from "../components/Invite";
import Image from "next/image";
import CircleImg from "../assets/circle.svg";
import Button from "./ui/Button";
import Gift from "../assets/gift-icon.svg";
import Done from "../assets/tik.svg";
import axios from "axios";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import Price from "../assets/price.svg";
import GoodLuck from "../assets/goodluck.svg";
import { useAppStore } from "../store/useAppStore";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { useTelegram } from "../context/TelegramContext";
import TidyLoader from "../components/TidyLoader";
import { useRouter } from "next/navigation";

export type Reward = {
  id: number;
  userId: number;
  tier: string;
  type: string;
  value: string;
  probability: number | null;
  spinDate: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function PrizeReveal({ duration }: { duration: number }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [rangeValue, setRangeValue] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);
  // const telegramId = useAppStore((state) => state.telegramId);
  const selectedTier = useAppStore((state) => state.selectedTier);
  const [userId, setUserId] = useState<number | null>(1);
  const [isClaim, setisClaim] = useState<boolean>(false);
  const [claimed, setclaimed] = useState<boolean>(false);
  const [walletAddress, setwalletAddress] = useState<string>("");
  const { telegramId } = useTelegram();

  useEffect(() => {
    if (!telegramId) return;

    const fetchUserId = async () => {
      try {
        const res = await axiosInstance.post("/auth/getUserIdByTelegram", {
          telegramId,
        });
        setUserId(res.data.userId);
        console.log("✅ User ID:", res.data.userId);
      } catch (err) {
        console.error("❌ Failed to fetch user ID:", err);
      }
    };

    fetchUserId();
  }, [telegramId]);

  useEffect(() => {
    setTimeLeft(duration);
    setRangeValue(0);
    setIsCompleted(false);
    setReward(null);

    if (duration > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });

        setRangeValue((prev) => {
          if (prev >= duration) return duration;
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [duration]);

  const handleReveal = async () => {
    if (!userId) {
      console.log("userId", userId);
      return;
    }

    try {
      setLoading(true);
      console.log("reward", reward);
      let newtier = null;

      if (reward && reward.value === "Higher Tier Access") {
        console.log("123");
        if (selectedTier === "BRONZE") {
          newtier = "SILVER";
        } else if (selectedTier === "SILVER") {
          newtier = "GOLD";
        }
      }
      setReward(null);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reward/play`,
        {
          userId,
           tier: newtier !== null ? newtier : selectedTier,
          durationSeconds: duration,
        }
      );

      setTimeout(() => {
        setReward(res.data.reward);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("❌ API Error:", err);
      setLoading(false);
    }
  };

  async function claimToken() {
    if (!userId) return;

    if (!ethers.isAddress(walletAddress)) {
      toast.error("Enter valid wallet address.", {
        id: "123",
        duration: 3000,
        icon: "❌",
      });
      return;
    }

    try {
      setisClaim(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reward/claim-reward`,
        {
          userId,
          id: reward?.id || 0,
          walletAddress,
        }
      );

      if (res && res.data && res.data.status) {
        toast.success("Successfully claimed TIDY tokens.", {
          id: "123",
          duration: 3000,
          icon: "✅",
        });
        setTimeout(() => {
          setclaimed(true);
          setisClaim(false);
        }, 1500);
      } else {
        toast.error("Failed to claim.", {
          id: "123",
          duration: 3000,
          icon: "❌",
        });
        setisClaim(false);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      toast.error("Failed to claim.", {
        id: "123",
        duration: 3000,
        icon: "❌",
      });
      setisClaim(false);
    }
  }
   const navigatehome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF] md:px-4">
      <Card3>
        <div className="w-full flex flex-col items-center gap-6 sm:gap-8">
          {!isCompleted ? (
            <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded-xl px-2 sm:px-6 py-8 text-center">
              <div className="mx-auto max-w-[180px] h-40 md:h-60 relative">
                <div className="w-full h-full">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      repeat: Infinity,
                      ease: "linear",
                      duration: 10,
                    }}
                    className="w-full h-full"
                  >
                    <Image
                      src={CircleImg}
                      alt="Circle"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </motion.div>
                </div>
              </div>
              <h1 className="mt-2 md:mt-6 text-xl sm:text-3xl font-bold">
                {timeLeft}
              </h1>
              <p className="text-xs sm:text-sm tracking-widest">SECONDS</p>
              <input
                type="range"
                min={0}
                max={duration}
                value={rangeValue}
                readOnly
                className="w-full mt-6 accent-[#737157]"
              />
              <p className="mt-4 text-[10px] sm:text-xs">
                YOUR PRIZE WILL BE REVEALED AFTER.....
              </p>
            </div>
          ) : (
            !reward &&
            !loading && (
              <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded sm:px-6 py-14 text-center">
                <div className="my-20 md:my-36 flex flex-col items-center gap-4">
                  <Image src={Done} alt="Done" width={50} height={50} />
                  <h1 className="text-xl sm:text-3xl font-bold">
                    Moment Completed!
                  </h1>
                </div>
              </div>
            )
          )}

          {isCompleted && !reward && (
            <Button
              image={<Image src={Gift} alt="Gift" width={18} height={18} />}
              className="w-full max-w-sm"
              borderColor={isCompleted ? "#D2A100" : "#695204ff"}
              fromColor={isCompleted ? "#110E05" : "#0b0903ff"}
              toColor={isCompleted ? "#362A02" : "#211a02ff"}
              marginTop="mt-10"
              disabled={!isCompleted}
              onClick={handleReveal}
            >
              REVEAL YOUR PRIZE
            </Button>
          )}

          {loading && <TidyLoader />}

          {reward && !loading && (
            <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded px-6 py-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              <div className="relative h-36 mx-auto flex items-center justify-center">
                <Image
                  src={Price}
                  alt="price"
                  fill
                  className="object-contain"
                />

                <div className="absolute -top-[10%] inset-0 flex flex-col items-center justify-center">
                  <p className="text-black font-semibold text-md text-center leading-tight">
                    {reward.tier} <br />
                    <span className="text-xs">PRIZE</span>
                  </p>
                </div>
              </div>

              <h2 className="mt-2 tracking-[0.3em] text-xs text-[#cbd5e1]">
                {reward.type}
              </h2>

              {reward.type === "QUOTE" && (
                <pre className="my-6 text-sm text-[#d1d5db] italic px-4 leading-relaxed whitespace-pre-wrap font-sans">
                  {reward.value}
                </pre>
              )}

              {reward.type === "TIDY_ZEN_MOMENT" && (
                <>
                  <p className="mt-16 mb-12 text-sm text-[#d1d5db]">
                    🌿 You unlocked another spin! Click reveal again.
                  </p>
                </>
              )}

              {reward.type === "TOKEN" && (
                <>
                  <p className="mt-6 text-sm text-[#d1d5db]">
                    🎉 You won {reward.value} tokens!
                  </p>
                  <input
                    type="text"
                    placeholder="ENTER RECEIVING WALLET..."
                    value={walletAddress}
                    onChange={(e) => setwalletAddress(e.target.value)}
                    className="w-full mt-8 px-4 py-3 bg-[#9292924D] border border-[#929292] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-[#CFCFCF] placeholder:text-xs"
                  />
                  <p className="mt-2 text-[11px]">
                    For Tokens Enter Base Wallet
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {reward &&
          reward.type === "TIDY_ZEN_MOMENT" &&
          reward.value !== "Higher Tier Access" && (
            <>
              <Button
                className="w-full mt-6"
                borderColor="#D2A100"
                fromColor="#110E05"
                toColor="#362A02"
                onClick={handleReveal}
              >
                Reveal Again
              </Button>
            </>
          )}

        {reward &&
          reward.type === "TIDY_ZEN_MOMENT" &&
          reward.value === "Higher Tier Access" && (
            <>
              <Button
                className="w-full mt-6"
                borderColor="#D2A100"
                fromColor="#110E05"
                toColor="#362A02"
                onClick={handleReveal}
              >
                Higher Tier Unlocked
              </Button>
            </>
          )}

        {reward && reward.type === "QUOTE" && (
          <div className="flex flex-col mt-16 items-center gap-3 w-full max-w-sm">
            <Image
              src={GoodLuck}
              alt="Gift"
              width={18}
              height={18}
              className="w-20 h-20"
            />

            <div className="flex flex-col items-center gap-1 text-lg text-gray-400" onClick={()=>navigatehome()}>
              <p className="cursor-pointer">Good Luck</p>
            </div>
          </div>
        )}

        {reward && reward.type === "TOKEN" && (
          <div className="flex flex-col mt-20 items-center gap-3 w-full max-w-sm">
            <button
              disabled={isClaim || claimed}
              onClick={() => claimToken()}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] py-3 font-semibold text-yellow-400 shadow-[0_0_15px_rgba(210,161,0,0.4)] hover:from-[#362A02] hover:to-[#110E05] hover:text-yellow-300 transition"
            >
              <Image src={Gift} alt="Gift" width={18} height={18} />
              {isClaim
                ? "Processing"
                : claimed
                ? "CLAIMED"
                : "CLAIM YOUR PRIZE"}
            </button>

           <div className="flex flex-col items-center gap-1 text-xs text-gray-400" onClick={()=>navigatehome()}>
              <p>or</p>
              <p className="underline cursor-pointer hover:text-white">
                DO IT LATER
              </p>
            </div>
          </div>
        )}
        <Invite />
      </Card3>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin-reverse 2s linear infinite;
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
