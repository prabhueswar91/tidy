"use client";

import { useState } from "react";
import Card2 from "../components/ui/Card2";
import Image from "next/image";
import Logo from "../assets/logo.svg";
import Button from "../components/ui/Button";
import Icon from "../assets/icon 1.svg";
import usePartnerStore from "../store/partnerStore";
import { toast } from "react-hot-toast";

interface PartnerProps {
  onContinue?: () => void;
}
async function delay() {
  return new Promise((resolve) => setTimeout(resolve, 4000));
}



export default function Partner({ onContinue }: PartnerProps) {
  const [selected, setSelected] = useState("");
  const setTokenEnabled = usePartnerStore((state) => state.setTokenEnabled);

  const handleContinue = () => {
    if (!selected) {
      toast.error("Please select an option");
      return;
    }

    if (selected === "ownToken") setTokenEnabled(true);
    else if (selected === "withoutToken") setTokenEnabled(false);
    else setTokenEnabled(null);

    if (onContinue) onContinue();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF] md:px-4">
      <Card2>
        <div className="relative w-32 h-32 mx-auto">
          <Image src={Logo} alt="Logo" fill style={{ objectFit: "contain" }} />
        </div>
        <div className="mb-1 text-[#FFFEEF] text-[18px] uppercase text-center w-3/4">
          Become a partner Install the tidyzen bot
        </div>
        <div className="w-full bg-[#14131866] border-2 border-[#333333] p-6 mt-3 text-left shadow-[0_4px_30px_rgba(0,0,0,0.9)] flex flex-col gap-6 rounded-lg backdrop-blur-md">
          <h2 className="text-[#FFFEEF] font-light text-base text">
            Partner Sign up mode
          </h2>

          <label className="relative flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="peer absolute opacity-0"
              checked={selected === "ownToken"}
              onChange={() => setSelected("ownToken")}
            />
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 border border-[#929292] rounded-sm peer-checked:bg-[#9292924D] peer-checked:border-[#929292] flex items-center justify-center peer-checked:checkbox-checked"></div>
            <svg
              className="w-3 h-3 text-[#FFFEEF] absolute top-1.5 left-1 hidden peer-checked:block"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-[#FFFEEF] font-light flex items-start gap-1">
              Contribute with tokens & USDC
              <Image
                src={Icon}
                alt="icon"
                width={16}
                height={16}
                className="inline-block"
              />
            </span>
          </label>

          <label className="relative flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="peer absolute opacity-0"
              checked={selected === "withoutToken"}
              onChange={() => setSelected("withoutToken")}
            />
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 border border-[#929292] rounded-sm peer-checked:bg-[#9292924D] peer-checked:border-[#929292] flex items-center justify-center peer-checked:checkbox-checked"></div>
            <svg
              className="w-3 h-3 text-[#FFFEEF] absolute top-1.5 left-1 hidden peer-checked:block"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-[#FFFEEF] font-light flex items-start gap-1">
              Contribute with USDC only
              <Image
                src={Icon}
                alt="icon"
                width={16}
                height={16}
                className="inline-block"
              />
            </span>
          </label>
        </div>

        <div className="w-full mt-6">
          <Button onClick={handleContinue} className="bg-[linear-gradient(90deg,#242424_0%,#525252_100%)]">CONTINUE</Button>
        </div>
      </Card2>
    </div>
  );
}
