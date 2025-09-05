"use client";

import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { useRouter } from "next/navigation";
import Header from "./Header";
import { useAppStore } from "../store/useAppStore";


import { useTelegramUser } from '../hooks/useTelegramUser';
import { TelegramUserData } from '../../types/telegram1';

export default function Login() {
   const { userData, isFromTelegram, isLoading } = useTelegramUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { selectedTier, setSelectedTier, walletAddress } = useAppStore();
  console.log(userData,'userDatamjuiiiiiiiiiiiii')


const handleTierSelect = (tier: string) => {
  if (tier === "Silver") {
    setSelectedTier("Silver", 169);
    setIsModalOpen(true);
  } else if (tier === "Gold") {
    setSelectedTier("Gold", 420);
    setIsModalOpen(true);
  } else {
    setSelectedTier("Bronze", 0);
  }
};


  const handleContinue = () => {
    if (!selectedTier) {
      alert("Please select a tier first!");
      return;
    }

    if ((selectedTier === "Silver" || selectedTier === "Gold") && !walletAddress) {
      alert("Please connect your wallet to continue with Silver or Gold.");
      return;
    }

    router.push("/Tier");
  };

  const tierClasses = (tier: string, base: string) =>
    `w-full flex items-center justify-between rounded px-5 py-3 font-semibold transition border ${base} 
    ${selectedTier === tier ? "ring-2 ring-yellow-400 bg-opacity-70" : ""}
    hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-400`;


   const generateTelegramUrl = () => {
    const url=`http://t.me/${process.env.NEXT_PUBLIC_CHANNEL_NAME}?start=${walletAddress}`
    const shareUrl = encodeURIComponent(url);
    return `https://t.me/share/url?url=${shareUrl}`;
  };

  const handleShare = () => {
    window.open(generateTelegramUrl(), '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex min-h-screen items-center font-dm justify-center text-[#FFFEEF] bg-gradient-to-b from-[#0a0a0a] to-[#1e293b]">
      <Card paddingY="py-16 md:py-20">
        <h1 className="text-white text-xl font-bold tracking-widest">TIDYCOIN</h1>
        <p className="mt-1 text-xl font-normal">TidyZen Moments</p>

         <button
            onClick={() => handleShare()}
            className="w-full flex items-center font-dm justify-between rounded px-5 py-3 bg-[#EBB4574D] border border-[#EBB457] text-[#EBB457] font-semibold hover:opacity-90 transition"
          >Inviteuu
          </button>

        <p className="mt-6">Choose Today’s Zen Level</p>
        <div className="mb-10 mt-1 border-b-2 border-[#FFFEEF]/10"></div>

        <div className="space-y-3">
          <button
            onClick={() => handleTierSelect("Bronze")}
            className={tierClasses("Bronze", "bg-[#AC8B8B4D] text-[#AC8B8B] border-[#AC8B8B]")}
          >
            <span className="uppercase tracking-widest">Bronze</span>
            <span className="text-sm">FREE</span>
          </button>

          <button
            onClick={() => handleTierSelect("Silver")}
            className={tierClasses("Silver", "bg-[#9292924D] text-[#929292] border-[#929292]")}
          >
            <span className="uppercase tracking-widest">Silver</span>
            <span className="text-sm">169 XP</span>
          </button>

          <button
            onClick={() => handleTierSelect("Gold")}
            className={tierClasses("Gold", "bg-[#EBB4574D] text-[#EBB457] border-[#EBB457]")}
          >
            <span className="uppercase tracking-widest">Gold</span>
            <span className="text-sm">420 XP</span>
          </button>
        </div>

        <Button onClick={handleContinue}>CONTINUE</Button>

        <p className="mt-3 text-xs text-gray-400">Your moments are a click away</p>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold my-6 text-center">Connect Wallet to Pay</h2>

        {selectedTier && (
          <div className="flex justify-between text-[#FFFEEF] items-center px-6">
            <h3 className="font-bold text-xl">Total</h3>
            <p className="font-semibold">
              <span className="text-sm font-normal">{selectedTier.toUpperCase()} TIER</span>
            </p>
          </div>
        )}

        <Header />
      </Modal>
    </div>
  );
}
