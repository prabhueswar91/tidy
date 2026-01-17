"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Clock, DollarSign, UserCheck, ChevronDown, Info } from "lucide-react";
import Logo from "../assets/Logo.png";

export default function TelegramBoosterUI() {
  const [showBooster, setShowBooster] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("week");
  const [isToggleOn, setIsToggleOn] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const plans = [
    { id: "day", duration: "1 Day activation", price: "49 USDC" },
    { id: "week", duration: "1 Week activation", price: "49 USDC" },
    { id: "month", duration: "1 Month activation", price: "49 USDC" },
  ];

  const features = [
    { icon: <Clock size={20} />, text: "Limited time activation" },
    { icon: <DollarSign size={20} />, text: "Rewards paid in $tidy" },
    { icon: <UserCheck size={20} />, text: "Verified telegram joins" },
  ];

  const includes = [
    "Tidyzen users must join your telegram to qualify for $TIDY, claims, xp rewards and xp boosts",
    "Rewards unlocked via tidyzen",
    "Traffic spread over time",
  ];

  const fundsUsage = [
    "User must join our telegram",
    "Rewards unlocked via tidyzen",
    "Traffic spread over time",
  ];

  // Shared theme (matching your TIDYCOIN/TidyZen view)
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

  if (!showBooster) {
    return (
      <div className={pageBg}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-[15rem] h-[15rem] md:w-46 md:h-52">
          <Image src={Logo} alt="Logo" fill style={{ objectFit: "contain" }} />
        </div>
          </div>

          {/* Title */}
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

          {/* Main Card */}
          <div className={`${cardBg} p-6 mb-6`}>
            {/* Toggle Section */}
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

            {/* Features Box */}
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

            {/* Info Text */}
            <p className={`text-center text-xs leading-relaxed ${textMuted2}`}>
              Users will be gradually invited to avoid spam or sudden influx.
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => setShowBooster(true)}
            className={`w-full ${cta} text-[#FFFEEF] font-semibold py-4 rounded-full transition-all duration-300 shadow-lg border border-[#FFFEEF]/10`}
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageBg}>
      <div className="w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={() => setShowBooster(false)}
          className="absolute -top-2 right-0 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center border border-[#FFFEEF]/10 transition-colors"
        >
          <X size={20} className="text-[#FFFEEF]" />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#FFFEEF] mb-6 text-center">
          Activate telegram booster
        </h1>

        {/* Plans Card */}
        <div className={`${cardBg} p-5 mb-6`}>
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left p-4 rounded-xl mb-3 last:mb-0 transition-all border ${
                selectedPlan === plan.id
                  ? "bg-yellow-400/10 border-yellow-400 ring-2 ring-yellow-400/40"
                  : "bg-black/25 border-[#FFFEEF]/10 hover:border-[#FFFEEF]/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? `${accentBorder}`
                      : "border-[#FFFEEF]/30"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[#FFFEEF] font-medium">{plan.duration}</div>
                  <div className={`text-sm ${textMuted}`}>{plan.price}</div>
                </div>
              </div>
            </button>
          ))}

          {/* What this includes */}
          <div className="mt-6">
            <h3 className="text-[#FFFEEF] text-sm font-semibold mb-3">
              What this includes :
            </h3>
            <ul className="space-y-2">
              {includes.map((item, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-2 text-xs ${textMuted}`}
                >
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable Section */}
          <div className="mt-6">
            <button
              onClick={() =>
                setExpandedSection(expandedSection === "funds" ? null : "funds")
              }
              className={`w-full flex items-center justify-between text-sm font-semibold pt-4 ${divider}`}
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
                  <li
                    key={index}
                    className={`flex items-start gap-2 text-xs ${textMuted}`}
                  >
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full ${ctaPrimary} font-bold py-4 rounded-full transition-all duration-300 shadow-lg mb-3 border border-yellow-400/40`}
        >
          PAY & ACTIVATE BOOSTER
        </button>

        {/* Footer Text */}
        <p className={`text-center text-sm ${textMuted}`}>
          Activation starts after approval
        </p>
      </div>
    </div>
  );
}
