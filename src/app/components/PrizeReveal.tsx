"use client";

import { useEffect, useRef, useState } from "react";
import Card3 from "../components/ui/Card3";
import { useSearchParams } from "next/navigation";
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
import { useTelegram } from "../context/TelegramContext";
import { UserContext } from "../context/UserContext";
// import TidyLoader from "../components/TidyLoader";
import { useRouter,usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StakeButton from "./StakeButton";
import { encryptData } from "../rewards/auth2/encrypt";
import Modal from "../components/ui/Modal";

export type Reward = {
  id: number;
  userId: number;
  tier: string;
  type: string;
  value: string;
  amount: string;
  symbol: string;
  zenCode?: string | null;
  probability: number | null;
  spinDate: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function PrizeReveal({ duration }: { duration: number }) {
   const { getUserInfo, userInfo } = UserContext();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [rangeValue, setRangeValue] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);
  const { selectedTier, zenCode } = useAppStore();
  const [userId, setUserId] = useState<number | null>(1);
  const [isClaim, setisClaim] = useState<boolean>(false);
  const [claimed, setclaimed] = useState<boolean>(false);
  const [walletAddress, setwalletAddress] = useState<string>("");
  const { telegramId } = useTelegram();
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [finalReward, setFinalReward] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isFetch, setisFetch] = useState(false);
  const [groupList, setgroupList] = useState([]);

  const router = useRouter();
   const pathname = usePathname();
  const searchParams = useSearchParams();
  const zen_code = searchParams.get("zen_code");
  console.log(userInfo,'userInfouserInfo11112')
  // const telegramId = 6195798875;

  const intervalAni: any = useRef(null);

  useEffect(() => {
    if (!telegramId) {
      toast.error("Telegram ID not found. Please log in via Telegram.");
      setLoading(false);
      return;
    }

    const fetchUserId = async () => {
      try {
        const res = await axiosInstance.post("/auth/getUserIdByTelegram", {
          telegramId,
        });
        if(res.data.userId){
          setUserId(res.data.userId);
          setwalletAddress(res?.data?.userInfo?.walletAddress);
          console.log("✅ User ID:", res.data.userId);
        }
        
      } catch (err) {
        console.error("❌ Failed to fetch user ID:", err);
      }
    };

    fetchUserId();
  }, [userInfo]);

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
  const rewards = ["🎁 Zen Moment", "💎 $TIDY", "🌱 Quote", "🔥 Partner Token"];

  useEffect(() => {
    // if (finalReward === null) return; // don't run until finalReward is set

    let i = 0;
    intervalAni.current = setInterval(() => {
      setHighlighted(i);
      i = (i + 1) % rewards.length; // cycle around
    }, 300);

    return () => {
      if (intervalAni.current) clearInterval(intervalAni.current);
    };
  }, [rewards.length]);

  useEffect(() => {
    if (!loading && !reward && isCompleted) {
      setTimeout(()=>{
        handleReveal()
      }, 100)
    }
  }, [loading, reward, isCompleted])
  const handleReveal = async () => {
    if (!userId) {
      console.log("userId", userId);
      return;
    }

    try {
      setLoading(true);
      let newtier = null;
      const code = reward?.zenCode || zenCode || null;

      if (reward && reward.value === "Higher Tier Access") {
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
          zenCode: zen_code || null,
          initData:window?.Telegram?.WebApp.initData
        }
      );

      const chkCode = searchParams.get("zen_code");
      if (chkCode) {
        router.replace(pathname);
      }
     
        
      setTimeout(() => {
        setReward(res.data.reward);
        setLoading(false);
        getUserInfo();
        if (intervalAni.current) clearInterval(intervalAni.current);
        // setHighlighted(res.data.reward);
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
        {data: encryptData({
          userId,
          id: reward?.id || 0,
          walletAddress,
          initData:window?.Telegram?.WebApp?.initData,
        })}
      );

      if (res && res.data && res.data.status) {
        let symbol = res.data.symbol?res.data.symbol:"$TIDY"
        toast.success(`Successfully claimed ${symbol} tokens.`, {
          id: "123",
          duration: 3000,
          icon: "✅",
        });
        setTimeout(() => {
          setclaimed(true);
          setisClaim(false);
        }, 1500);
      }else if(res?.data?.error) {
        toast.error(res?.data?.error);
      } else {
        toast.error("Failed to claim.", {
          id: "123",
          duration: 3000,
          icon: "❌",
        });
        setisClaim(false);
      }
    } catch (err:any) {
      console.error("Claim error:", err);
      const errorMessage = 
      err?.response?.data?.error ||           // API error message
      err?.response?.data?.message ||         // Alternative message field
      err?.message ||                          // Generic error message
      "Something went wrong while claiming";   
      toast.error(errorMessage);
      if(errorMessage=="Join our Telegram community to unlock claiming."){
        getCommunityList()
      }
    }finally {
      setisClaim(false);
    }
  }

  async function getCommunityList(){
    setisFetch(true)
    try{
      const {data:response} = await axiosInstance.post("/points/joined-community-list", {telegramId});
      if(response && response.list){
        setgroupList(response.list);
        setIsCommunityModalOpen(true);
      }
    }catch(err){
    
    }finally{
      setisFetch(false)
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF] md:px-4">
      <Card3>
        <div className="w-full flex flex-col items-center gap-6 sm:gap-8">
          <StakeButton />
          {!isCompleted ? (
            <div className="w-full max-w-md bg-[#14131899] border-2 border-[#333333] rounded-xl px-2 sm:px-6 py-8 text-center backdrop-blur-md shadow-[0_0_20.9px_0_#000000]">
              <div className="absolute inset-0 before:block before:absolute before:inset-0 before:bg-[url('/spingreenbg.png')] before:bg-cover before:bg-center before:opacity-80"></div>
              <div className="mx-auto w-[244px] min-h-[260px] h-40 md:h-60 relative">
                <div className="w-full h-full">
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      repeat: Infinity,
                      duration: 10,
                      ease: "linear",
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
              {/* <motion.div
                key={timeLeft}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-[40px] font-bold"
              >
                {timeLeft}
              </motion.div>

              <p className="text-[14px] font-dm sm:text-sm leading-[170%] tracking-[0.24em]">
                SECONDS
              </p> */}

              <motion.input
                type="range"
                min={0}
                max={duration}
                value={rangeValue}
                readOnly
                className="w-full mt-6 accent-[#737157]"
                transition={{ ease: "linear", duration: 0.05 }}
              />

              <p className="mt-4 text-[14px] font-dm text-[#FFFEEF] leading-[170%] tracking-[-0.03em]">
                YOUR PRIZE WILL BE REVEALED AFTER.....
              </p>
            </div>
          ) : (
            !reward &&
            !loading && (
              <div className="w-full max-w-md border-2 border-[#333333] rounded sm:px-6 py-14 text-center backdrop-blur-md shadow-[0_0_20.9px_0_#000000] bg-[#14131899]">
                <div className="absolute inset-0 before:block before:absolute before:inset-0 before:bg-[url('/spingreenbg.png')] before:bg-cover before:bg-center before:opacity-80"></div>
                <div className="flex flex-col items-center gap-4 min-h-[260px] justify-center">
                  <Image src={Done} alt="Done" width={50} height={50} />
                  <p className="text-[26px] font-open sm:text-3xl font-[600] leading-[102%] tracking-[-0.05em]">
                    Moment <br /> Completed
                  </p>
                </div>
              </div>
            )
          )}

          {/* {!loading && !reward && (
            <Button
              className="w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
              image={<Image src={Gift} alt="Gift" width={18} height={18} />}
              // className="w-full max-w-sm"
              borderColor={isCompleted ? "#D2A100" : "#695204ff"}
              fromColor={isCompleted ? "#110E05" : "#0b0903ff"}
              toColor={isCompleted ? "#362A02" : "#211a02ff"}
              disabled={!isCompleted}
              onClick={handleReveal}
            >
              REVEAL YOUR PRIZE
            </Button>
          )} */}

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
                    <span className="text-[24px] font-open font-[600] leading-[102%] tracking-[-0.05em]">
                      PRIZE
                    </span>
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
                    🌿 You unlocked another moment. Click to claim.
                  </p>
                </>
              )}

              {reward.type === "TOKEN" && (
                <>
                  <p className="mt-6 text-sm text-[#d1d5db]">
                    🎉 You won {reward.amount} {reward.symbol} tokens!
                  </p>
                  <input
                    type="text"
                    placeholder="ENTER RECEIVING WALLET..."
                    value={walletAddress}
                    readOnly
                    className="w-full mt-8 px-4 py-3 bg-[#9292924D] border border-[#929292] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-[#CFCFCF] placeholder:text-xs"
                  />
                  <p className="mt-2 text-[11px]">
                    For Tokens Enter Base Wallet
                  </p>
                  <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Join our Telegram community to unlock claiming.</p>
              
              <div className="flex flex-wrap justify-center gap-2" onClick={()=>getCommunityList()}>
                <a
                  href="javascript:void(0)"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#110E05] to-[#362A02] text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 border border-[#D2A100]/30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.20-.07-.06-.17-.04-.24-.02-.10.02-1.79 1.14-5.06 3.34-.48.33-.92.49-1.31.48-.43-.01-1.27-.24-1.89-.44-.76-.24-1.36-.37-1.31-.78.03-.24.37-.48 1.03-.74 4.05-1.66 6.77-2.76 8.14-3.31 3.92-1.61 4.73-1.89 5.26-1.9.12 0 .38.03.55.18.14.13.18.30.20.42.02.12.02.38.01.52z"/>
                  </svg>
                  <span>{isFetch?"Loading...":"Join Community"}</span>
                </a>

              </div>
            </div>
          </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* {loading && <TidyLoader />} */}
        {/* Shuffle reward animation */}
        {/* Shuffle all rewards inside ONE main card */}

        {loading && (
          <div className="mt-10 w-full max-w-md">
            <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded sm:px-6 py-14 text-center">
              {/* <div className="rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow-2xl border border-gray-700 p-8 text-center"> */}
              <div className="grid grid-cols-1 gap-4">
                {rewards.map((r, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: highlighted === i || finalReward === i ? 1 : 0.1, // fade in/out
                      scale: finalReward === i ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border p-4 shadow-md transition ${
                      finalReward === i
                        ? "bg-yellow-900/40 border-yellow-400"
                        : "bg-gray-800/30 border-gray-600"
                    }`}
                  >
                    <div className="text-3xl mb-2 text-white">
                      {r.split(" ")[0]}
                    </div>
                    <h2
                      className={`text-lg font-bold ${
                        finalReward === i ? "text-yellow-300" : "text-gray-400"
                      }`}
                    >
                      {r.replace(/^[^\s]+\s/, "")}
                    </h2>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showMessage && finalReward !== null && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex flex-col items-center w-[90%] max-w-md"
              >
                <div className="w-full max-w-sm bg-[#14131899] border border-[#333333] rounded sm:px-6 py-14 text-center">
                  <div className="w-full rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow-2xl border border-gray-700 p-8 text-center">
                    {finalReward !== null && rewards[finalReward] && (
                      <>
                        <div className="text-6xl mb-4">
                          <span>{rewards[finalReward].split(" ")[0]}</span>
                        </div>
                        <h2 className="text-xl font-bold text-yellow-300">
                          {rewards[finalReward].replace(/^[^\s]+\s/, "")}
                        </h2>
                      </>
                    )}

                    <div className="mt-8">
                      <h3 className="text-sm tracking-widest text-white font-semibold">
                        THANK YOU
                      </h3>
                      <p className="text-xs italic text-gray-300 mt-1">
                        FOR TAKING A TIDYZEN MOMENT
                      </p>
                      <p className="text-[11px] text-gray-400 mt-4">
                        Powered by{" "}
                        <span className="font-semibold text-yellow-400">
                          TidyCoin
                        </span>{" "}
                        and JUNGL
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 w-full flex flex-col items-center gap-4">
                    <button
                      onClick={() => {
                        setFinalReward(null);
                        setShowMessage(false);
                      }}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold shadow-md hover:from-gray-700 hover:to-gray-600 transition"
                    >
                      START AGAIN
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setInviteOpen(true)}
                        className="text-white font-semibold hover:text-yellow-300"
                      >
                        INVITE A FRIEND
                      </button>
                      <p className="text-xs text-gray-400">
                        And Win Extra Zen Moments
                      </p>
                    </div>
                    {/* Modal */}
                    <Invite />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {reward &&
          reward.type === "TIDY_ZEN_MOMENT" &&
          reward.value !== "Higher Tier Access" && (
            <>
              <Button
                className="w-full mt-6 max-w-md bg-[linear-gradient(90deg,#110E05_0%,#362A02_100%)]"
                borderColor="#D2A100"
                fromColor="#110E05"
                toColor="#362A02"
                //onClick={() => router.push("/Tier")}
                onClick={() => {
                  router.push(`/Tier?zen_code=${reward?.zenCode}`);
                  router.refresh(); // ✅ Forces revalidation / refresh
                }}
              >
                Claim Your Moment
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
                //onClick={handleReveal}
                //onClick={() => router.push(`/Tier?zen_code=${reward?.zenCode}`)}
                onClick={() => {
                  router.push(`/Tier?zen_code=${reward?.zenCode}`);
                  router.refresh(); // ✅ Forces revalidation / refresh
                }}
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

            <div className="flex flex-col items-center gap-1 text-lg text-gray-400">
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

            <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
              <p>or</p>
              <button className="underline cursor-pointer hover:text-white" onClick={() => router.push("/")}>
            
                DO IT LATER
              </button>
            </div>
          </div>
        )}
        {reward && !loading && (
        <div className="flex items-center justify-between w-full max-w-md gap-2">
        <Button
            className="!py-1 w-full max-w-sm text-sm text-[#D2A100] px-2 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_100%)] font-semibold font-sans"
            borderColor={"#045867"}
            onClick={() =>
            window.open(
                "https://t.me/+CDA1mBAvkTI4MjI1",
                "_blank"
            )
            }
        >
           JOIN TIDYZEN'S TG COMMUNITY
        </Button>
        <Button
            className="!py-1 w-full max-w-sm text-sm text-[#D2A100] px-2 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_100%)] font-semibold font-sans"
            borderColor={"#D2A100"}
            fromColor={"#110E05"}
            toColor={"#362A02"}
            onClick={() =>
            window.open(
                "https://discord.gg/3hES55jtsj",
                "_blank"
            )
            }
        >
            JOIN JUNGL'S DISCORD
        </Button>
      </div> )}
        <Invite />
      </Card3>

      <Modal
    isOpen={isCommunityModalOpen}
    onClose={() => setIsCommunityModalOpen(false)}
    >
    <h2 className="text-lg font-bold mb-4 text-center">
    Join Telegram Communities
    </h2>

    <div className="space-y-3">
    {groupList.map((group: any) => (
      <div
        key={group.groupId}
        className="flex items-center justify-between p-3 rounded-lg border border-[#362A02] bg-[#110E05]"
      >
        <div>
          <p className="text-sm font-semibold text-[#FFFEEF]">
            {group.groupName}
          </p>
          <a
            href={group.groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#D2A100] hover:underline break-all"
          >
            {group.groupLink}
          </a>
        </div>

        <div className="ml-3">
          {group.isJoined ? (
            <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">
              Joined
            </span>
          ) : (
            <a
              href={group.groupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] text-white hover:opacity-90"
            >
              Join
            </a>
          )}
        </div>
      </div>
    ))}

    {groupList.length === 0 && (
      <p className="text-center text-sm text-gray-400">
        No communities found
      </p>
    )}
    </div>

    <div className="mt-5 flex justify-center">
    <button
      onClick={() => setIsCommunityModalOpen(false)}
      className="px-6 py-2 rounded-lg border border-[#D2A100] bg-gradient-to-r from-[#110E05] to-[#362A02] text-white"
    >
      Close
    </button>
    </div>
    </Modal>

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
