"use client";

import { X, ChevronDown, Info } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Contract, parseUnits, formatUnits } from "ethers";
import { toast } from "react-hot-toast";
import {Plan} from "./page";
import axiosInstance from "../utils/axiosInstance";
import { useWallet } from "../hooks/useWallet";
import {encryptData} from "../rewards/auth2/encrypt"
import Modal from "../components/ui/Modal";
import PayBoosterModal from "./PayBoosterModal";
import { useRouter } from "next/navigation";

const textMuted = "text-[#FFFEEF]";


export const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
];


export default function SecondPage({
  onClose,
  plans,
  selectedPlanId,
  setSelectedPlanId,
  expandedSection,
  setExpandedSection,
  selectedPlan,
  setshowApprove
}: {
  onClose: () => void;
  plans: Plan[];
  selectedPlanId: number | null;
  setSelectedPlanId: (id: number) => void;
  expandedSection: string | null;
  setExpandedSection: (v: string | null) => void;
  selectedPlan: Plan | null;
 setshowApprove: Dispatch<SetStateAction<boolean>>;
}) {

const { provider, address, isConnected, connect, logout, formatAddress } = useWallet();
const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [usdcBalance, setUsdcBalance] = useState<string>("0");
const [decimals, setDecimals] = useState<number>(6);
const [balLoading, setBalLoading] = useState(false);


  const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as string;
  const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET as string;


  const includes = [
    "TidyZen users must join your Telegram to qualify for $TIDY claims, XP rewards and XP boosts",
    "User growth spread out over time",
  ];

  const fundsUsage = [
    "User must join our telegram",
    "Rewards unlocked via tidyzen",
    "Traffic spread over time",
  ];

  function closePopup(){
      setshowApprove(true)
  }

  return (
    <div className={"min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] text-[#FFFEEF] flex items-center justify-center p-4"}>
      <div className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border border-[#FFFEEF]/10 transition-colors"
        >
          <X size={20} className="text-[#FFFEEF]" />
        </button>

        <h1 className="text-[26px] font-semibold text-[#FFFEEF]  font-open mb-6 text-center">
          Activate Telegram Booster
        </h1>

        <div className={`bg-[#141318]/40 backdrop-blur-md rounded-2xl border-2 border-[#333333] shadow-2xl p-5 mb-6`}>
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`w-full text-left p-4 rounded-xl mb-3 last:mb-0 transition-all border ${
                selectedPlanId === plan.id
                  ? "bg-[#141318] border-[linear-gradient(105.65deg,#FFD563_0%,#B47E00_104.27%)] ring-2 ring-[#D7AE1C]/40"
                  : "bg-[#141318]/60 border-[#333333] hover:border-[#FFFEEF]/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlanId === plan.id
                      ? `border-[linear-gradient(105.65deg,#FFD563_0%,#B47E00_104.27%)]`
                      : "border-[#FFFEEF]/30"
                  }`}
                >
                  {selectedPlanId === plan.id && (
                    <div className="w-3 h-3 rounded-full bg-[#D7AE1C]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-[#FFFEEF] text-[20px] font-medium font-sans">{plan.label}</div>
                  <div className={`text-[16px] font-normal font-sans ${textMuted}`}>{plan.price} USDC</div>
                </div>
              </div>
            </button>
          ))}

          <div className="mt-6">
            <h3 className="text-[#FFFEEF] text-sm font-semibold mb-3">
              What this includes :
            </h3>
            <div className="p-[2px] rounded-full mb-2
            bg-[linear-gradient(90deg,rgba(126,126,126,0.3)_0%,rgba(126,126,126,0.8)_50%,rgba(126,126,126,0.3)_100%)]" />
            {/* <ul className="space-y-2">
              {includes.map((item, index) => (
                <li key={index} className={`flex items-start gap-2 font-medium font-sans text-[16px] ${textMuted}`}>
                  <span className="text-[#D3D3C6]  mt-0.5">•</span>
                  <span className="flex-1 text-[#D3D3C6] text-[12px] font-medium">{item}</span>
                </li>
              ))}
            </ul> */}
            <ul className="space-y-2 list-disc pl-5">
  {includes.map((item, index) => (
    <li
      key={index}
      className="text-[#D3D3C6] text-[12px] font-medium font-sans"
    >
      {item}
    </li>
  ))}
</ul>

          </div>

          {/* <div className="mt-6">
            <button
              onClick={() =>
                setExpandedSection(expandedSection === "funds" ? null : "funds")
              }
              className={`w-full flex items-center justify-between text-sm font-semibold pt-4 border-t border-[#FFFEEF]/10`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[#FFFEEF]">How funds are used?</span>
                <Info size={14} className={textMuted} />
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform text-[#FFFEEF] ${
                  expandedSection === "funds" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection === "funds" && (
              <ul className="mt-3 space-y-2">
                {fundsUsage.map((item, index) => (
                  <li key={index} className={`flex items-start gap-2 text-xs ${textMuted}`}>
                    <span className="text-[#D3D3C6] mt-0.5">•</span>
                    <span className="flex-1 text-[#D3D3C6] text-[12px] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
        </div>

      <button
        className="w-full bg-[linear-gradient(90deg,#110e05_0%,#362a02_100%)] font-open text-[18px]  text-[#FFFEEF] hover:opacity-90 font-bold py-4 rounded-full transition-all duration-300 shadow-lg mb-3 border border-[#D2A100] disabled:opacity-50"
        disabled={!selectedPlan}
        // onClick={() => setIsModalOpen(true)}
        onClick={() => {
    if (!isConnected) {
      router.push("/partner");  // 👈 redirect here
    } else {
      setIsModalOpen(true);     // open payment modal
    }
  }}
      >
        {isConnected ? "PAY & ACTIVATE BOOSTER" : "APPLY NOW"}
      </button>

      <PayBoosterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
        onSuccess={() => closePopup()}
      />
        <p className={`text-center text-[#FFFEEF] font-semibold font-sans text-[16px] ${textMuted}`}>
          Activation starts after approval and payment
        </p>
      </div>

    </div>
  );
}
