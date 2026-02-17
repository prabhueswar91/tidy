"use client";
import React from "react";
import { useState, useEffect } from "react";
import BgCard from "../assets/card-1.png";
import Search from "../assets/search.svg";
import Image from "next/image";
import Coin from "../assets/coin.png";
import Button from "../components/ui/Button";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import TidyLoader from "../components/TidyLoader";
import toast from "react-hot-toast";
import { encryptData } from "../rewards/auth2/encrypt";
import { ethers } from "ethers";
import Close from "../assets/close.svg";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useTelegram } from "../context/TelegramContext";

export default function Account() {
  const { userInfo } = UserContext();
  const { telegramId, userdata } = useTelegram();
const router = useRouter();
// const profilePic = userdata?.photo_url;
const profilePic =
  userdata?.photo_url ||
  "https://i.pravatar.cc/150?img=3";

  const telegramDisplayName =
  userdata?.username
    ? `@${userdata.username}`
    : userdata?.first_name
    ? userdata.first_name
    : "—";
const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setisSubmit] = useState(false);
  const [baseAddress, setbaseAddress] = useState("");
  const [solAddress, setsolAddress] = useState("");
  const [bnbAddress, setbnbAddress] = useState("");
  const [xpbalance, setxpbalance] = useState(0);
  const [weekPoints, setweekPoints] = useState(0);
  const [totalPoints, settotalPointss] = useState(0);

  useEffect(() => {
    if (!userInfo?.id) return;

    const fetchPoints = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/points/user/${userInfo.id}/weekly`);
        console.log("API Response:", res.data);
        setweekPoints(res.data?.weeklyPoints);
        settotalPointss(res.data?.totalPoints);
        setbaseAddress(res.data?.walletAddress)
        getXPbalance(res.data?.walletAddress)
        setbnbAddress(res.data?.bnbAddress)
        setsolAddress(res.data?.solAddress)
      } catch (err) {
        console.error("Failed to fetch points", err);
      }
      setLoading(false);
    };

    fetchPoints();
   
  }, [userInfo]);

    async function getXPbalance(addr:string){
        try{
          const { data } = await axiosInstance.post("/auth/get-xp-balance", {
            walletAddress:addr,
            telegramId: telegramId
          });
          const bal = data?.balance ? Number(parseFloat(data.balance).toFixed(4)) : 0;
          setxpbalance(bal);
        }catch(error: unknown){
          
        }
    }

  async function updateWallet() {

    if (!baseAddress) {
      toast.error("Please enter a wallet address");
      return;
    } else if (!ethers.isAddress(baseAddress)) {
      toast.error("Enter valid wallet address.", {
        id: "123",
        duration: 3000,
        icon: "❌",
      });
      return;
    }

    setisSubmit(true);
    try {
      let a = encryptData({
        baseAddress,
        bnbAddress,
        solAddress,
        initData:window?.Telegram?.WebApp?.initData
      })
      const res = await axiosInstance.post("/points/update-wallet", { data: a });

      if (res.data?.status) {
        toast.success("Wallet updated successfully!");
      } else if (res?.data?.error) {
        toast.error(res?.data?.error);
      } else {
        toast.error("Try again later");
      }
    } catch (err: any) {
      console.error("Claim error:", err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while claiming";
      toast.error(errorMessage);
    } finally {
      setisSubmit(false);
    }
  }
useEffect(() => {
  console.log("Telegram photo:", userdata?.photo_url);
}, [userdata]);

  return (
    
    <div className="relative bg-[#141318]/40 w-full min-h-screen p-4 text-[#FFFEEF] font-dm  overflow-x-hidden">

      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* <button
        onClick={() => router.push("/")}
        className="ml-auto bg-black border-2 border-[#8C6C00] p-2 rounded-full"
      >
        <Image src={Close} alt="close" width={14} height={14} />
      </button> */}

      <div className="relative w-full max-w-3xl flex flex-col items-center mx-auto space-y-4 mt-4">
        {/* <button
          onClick={() => router.push("/")}
          className="ml-auto bg-black border-2 border-[#8C6C00] p-2 rounded-full"
        >
          <Image src={Close} alt="close" width={14} height={14} />
        </button> */}
        <div className="page-title text-xl font-bold">
          Account & linked wallets
        </div>

        <div className="w-full bg-[#14131899]/6 border-[1.5px] border-[#333333] rounded-md p-4">
          {loading ? (
            <div className="flex justify-center py-6">
              <TidyLoader />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {profilePic ? (
  <Image
    src={profilePic}
    alt="Telegram Profile"
    width={36}
    height={36}
    className="rounded-full w-6 h-6 object-cover"
    unoptimized
  />
) : (
  <div className="w-6 h-6 rounded-full bg-gray-400/40 flex items-center justify-center">
    <User size={14} strokeWidth={2.5} />
  </div>
)}
 <span className="font-medium text-sm">
  {telegramDisplayName}
</span>

                </div>

                {/* <p className="text-[#FFFEEF99] text-xs font-light">
                  Total XP{" "}
                  <span className="text-[#FFFEEF] font-medium text-sm">
                    {points?.total ?? 0}
                  </span>
                </p> */}
             <p className="text-[#FFFEEF99] text-xs font-light">
  Total DUST{" "}
  <span className="text-[#FFFEEF] font-semibold text-sm">
    {totalPoints ?? 0} DUST
  </span>
</p>


              </div>

              <div className="my-3 border-t border-[#333333]" />

              {/* <div className="flex items-center justify-between">
                <p className="text-[#FFFEEF99] text-sm">REWARDS</p>
                <p className="font-semibold">
                  <span className="text-[#FFFEEF99] font-light text-xs">
                    Weekly{" "}
                  </span>
                  +{points?.point ?? 0}
                </p>
              </div> */}
              <div className="flex items-center justify-between">
                <p className="text-[#FFFEEF99] text-sm">DUST Balance</p>
                <p className="font-semibold text-[#FFFEEF]">
                  <span className="text-[#FFFEEF99] font-light text-xs">
                    Weekly{" "}
                  </span>
                  +{weekPoints ?? 0} DUST
                                 </p>
            </div>

               <div className="flex items-center justify-between">
                <p className="text-[#FFFEEF99] text-sm">XP Balance</p>
                <p className="font-semibold">
                  {xpbalance ?? 0} XP
                </p>
              </div>
            </>
          )}
        </div>

        <div className="w-full bg-[#14131899]/6 border-[1.5px] border-[#333333] rounded-lg p-4 space-y-4">
          {/* Search */}
          {/* <div className="relative flex flex-col justify-center text-center px-4">
            <div className="flex items-center bg-[#9292924D] rounded-full px-4 py-1">
              <Image
                src={Search}
                alt="Search"
                width={20}
                height={20}
                className="mr-3"
              />
              <input
                type="text"
                placeholder="Search Wallets"
                className="bg-transparent outline-none w-full text-[#D3D3C6] placeholder:text-[#D3D3C6] placeholder:text-sm"
              />
            </div>
          </div> */}

          {/* BASE (EVM) */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-[#FFFEEF] text-sm font-medium">BASE (EVM)</label>
              <input
                type="text"
                placeholder="Enter wallet address"
                className="bg-[#9292924D] border border-[#929292]/30 rounded-md px-3 py-2 text-[#FFFEEF] placeholder:text-[#FFFEEF]/60 outline-none focus:border-[#D2A100] focus:bg-[#0000004D]"
                value={baseAddress}
                onChange={(e) => setbaseAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#FFFEEF] text-sm font-medium">SOLANA</label>
            <input
              type="text"
              placeholder="Enter wallet address"
              className="bg-[#9292924D] border border-[#929292]/30 rounded-md px-3 py-2 text-[#FFFEEF] placeholder:text-[#FFFEEF]/60 outline-none focus:border-[#D2A100] focus:bg-[#0000004D]"
              value={solAddress}
              onChange={(e) => setsolAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#FFFEEF] text-sm font-medium">BNB</label>
            <input
              type="text"
              placeholder="Enter wallet address"
              className=" bg-[#9292924D] border border-[#929292]/30 rounded-md px-3 py-2 text-[#FFFEEF] placeholder:text-[#FFFEEF]/60 outline-none focus:border-[#D2A100] focus:bg-[#0000004D]"
              value={bnbAddress}
              onChange={(e) => setbnbAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full mx-4">
          <Button
            borderColor="#D2A100"
            className="w-fulltext-[#FFFEEF] bg-gradient-to-r from-[#110E05] to-[#362A02] text-[16px] font-semibold px-4 !py-2"
            onClick={() => updateWallet()}
          >
            {isSubmit ? "Updating..." : "SAVE WALLET"}
          </Button>
        </div>
      </div>
    </div>
  );
}
