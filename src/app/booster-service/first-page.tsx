"use client";

import Image from "next/image";
import { Clock, DollarSign, UserCheck } from "lucide-react";
import Logo from "../assets/Logo.png";

// theme constants unchanged...

 const pageBg =
    "min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] text-[#FFFEEF] flex items-center justify-center p-4";
  const cardBg =
    "bg-[#0b0f17]/70 backdrop-blur-xl rounded-2xl border border-[#FFFEEF]/10 shadow-2xl";
  const subtleBox =
    "bg-black/30 rounded-xl border border-[#FFFEEF]/10";
  const divider = "border-t border-[#FFFEEF]/10";
  const textMuted = "text-[#FFFEEF]/60";
  const textMuted2 = "text-[#FFFEEF]/45";
  const accent = "text-yellow-400";
  const accentBorder = "border-yellow-400";
  const cta =
    "bg-[linear-gradient(90deg,#242424_0%,#525252_100%)] hover:opacity-90";
  const ctaPrimary =
    "bg-[linear-gradient(90deg,#f5d35f_0%,#d6a532_100%)] text-black hover:opacity-90";

export default function FirstPage({
  isToggleOn,
  setIsToggleOn,
  onContinue,
}: {
  isToggleOn: boolean;
  setIsToggleOn: (v: boolean) => void;
  onContinue: () => void;
}) {
  const features = [
    { icon: <Clock size={20} />, text: "Limited time activation" },
    { icon: <DollarSign size={20} />, text: "Rewards paid in $tidy" },
    { icon: <UserCheck size={20} />, text: "Verified telegram joins" },
  ];

  return (
    <div className={pageBg}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative w-[15rem] h-[15rem] md:w-46 md:h-52">
            <Image src={Logo} alt="Logo" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FFFEEF] mb-2">
            Grow your community
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-[#FFFEEF]/10" />
            <p className={`text-sm ${textMuted}`}>Telegram booster service</p>
            <div className="h-px w-12 bg-[#FFFEEF]/10" />
          </div>
        </div>

        <div className={`${cardBg} p-6 mb-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#FFFEEF] text-lg font-semibold">
              Telegram booster service
            </h2>

            <button
              onClick={() => setIsToggleOn(!isToggleOn)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isToggleOn ? "bg-yellow-400/80" : "bg-[#FFFEEF]/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-[#FFFEEF] rounded-full shadow-md transition-transform ${
                  isToggleOn ? "right-0.5" : "left-0.5"
                }`}
              >
                {isToggleOn && (
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-black">
                    On
                  </span>
                )}
              </div>
            </button>
          </div>

          <div className={`${subtleBox} p-5 mb-6`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 mb-3 last:mb-0 ${textMuted}`}
              >
                <div className={accent}>{feature.icon}</div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          <p className={`text-center text-xs leading-relaxed ${textMuted2}`}>
            Users will be gradually invited to avoid spam or sudden influx.
          </p>
        </div>

        <button
          onClick={onContinue}
          className={`w-full ${cta} text-[#FFFEEF] font-semibold py-4 rounded-full transition-all duration-300 shadow-lg border border-[#FFFEEF]/10`}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
