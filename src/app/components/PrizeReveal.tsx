"use client";

import { useEffect, useState } from "react";
import Card3 from "../components/ui/Card3";
import Image from "next/image";
import CircleImg from "../assets/circle.svg";
import Button from "./ui/Button";
import Gift from "../assets/gift-icon.svg";
import Done from "../assets/tik.svg";
import axios from "axios";
import ShuffleCard from "./ui/SuffleLoader";
import Price from "../assets/price.svg";
import GoodLuck from "../assets/goodluck.svg";

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
  const [timeLeft, setTimeLeft] = useState(duration);
  const [rangeValue, setRangeValue] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true);
      setReward(null);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reward/play`,
        {
          userId: 1,
          tier: "BRONZE",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF] md:px-4">
      <Card3>
        <div className="w-full flex flex-col items-center gap-6 sm:gap-8">
          {/* Timer / Completed Message */}
          {!isCompleted ? (
            <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded-xl px-2 sm:px-6 py-8 text-center">
              <div className="mx-auto max-w-[180px] h-40 md:h-60 relative">
                <div className="w-full h-full animate-spin-slow">
                  <Image
                    src={CircleImg}
                    alt="Circle"
                    fill
                    style={{ objectFit: "contain" }}
                  />
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

          {/* Reveal Button */}
          {!loading && !reward && (
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

          {loading && <ShuffleCard />}

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

        {reward && reward.type === "TIDY_ZEN_MOMENT" && (
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

        {reward && reward.type === "QUOTE" && (
          <div className="flex flex-col mt-16 items-center gap-3 w-full max-w-sm">
            <Image
              src={GoodLuck}
              alt="Gift"
              width={18}
              height={18}
              className="w-20 h-20"
            />

            <div className="flex flex-col items-center gap-1 text-lg text-gray-400">
              <p className="cursor-pointer">Good Luck</p>
            </div>
          </div>
        )}

        {reward && reward.type === "TOKEN" && (
          <div className="flex flex-col mt-20 items-center gap-3 w-full max-w-sm">
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
        )}
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
