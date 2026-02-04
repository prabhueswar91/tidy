"use client";

import Image from "next/image";
import { Clock, DollarSign, UserCheck } from "lucide-react";
import Logo from "../assets/Logo.png";
import { useRouter } from "next/navigation";
// theme constants unchanged...

 const pageBg =
    "min-h-screen bg-gradient-to-b from-[#0B1925] to-[#141318] text-[#FFFEEF] flex items-center justify-center p-4";
  const cardBg =
    "bg-[#141318] backdrop-blur-xl rounded-2xl border-2 border-[#333333] shadow-2xl";
  const subtleBox =
    "bg-[#141318]/60 rounded-xl border border-[#333333]";
  const divider = "border-t border-[#FFFEEF]/10";
  const textMuted = "text-[#FFFEEF]/60";
  const textMuted2 = "text-[#FFFEEF]/45";
  const accent = "text-[#D7AE1C]";
  const accentBorder = "border-[#D7AE1C]";
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
  const router = useRouter();
  const features = [
    { icon: <Clock size={20} />, text: "Time activation" },
    // { icon: <DollarSign size={20} />, text: "Rewards paid in $tidy" },
    { icon: <UserCheck size={20} />, text: "Verified telegram joins" },
  ];

  return (
    <>
    <div className={pageBg}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-2">
          <div className="relative w-[6.65rem] h-[6.65rem]">
            <Image src={Logo} alt="Logo" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[26px] font-semibold font-open text-[#FFFEEF] mb-2">
            Grow your community
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-0 w-12 p-[2px] rounded-lg 
            bg-[linear-gradient(90deg,rgba(118,95,15,0)_0%,#DCB11C_100%)] " />
            <p className="text-[16px] text-[#FFFEEF] font-sans ">Telegram booster service</p>
           <div className="h-0 w-12 p-[2px] rounded-lg 
            bg-[linear-gradient(90deg,#DCB11C_0%,rgba(118,95,15,0)_100%)]"></div>
          </div>
          <p className="text-[13px] text-[#FFFEEF] font-normal font-sans">Get TidyZen users to join your Telegrampowered by $TIDY & XP incentives</p>
        </div>

        <div className={`${cardBg} p-6 mb-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#FFFEEF] text-[20px] font-medium font-sans">
              Telegram booster service
            </h2>

                  <button
          onClick={() => setIsToggleOn(!isToggleOn)}
          className="relative w-14 h-7 rounded-full p-[2px] bg-[#DCB11c]/10"
        >
          {/* Track */}
          <div
            className={`relative w-full h-full rounded-full ${isToggleOn ? "bg-[#1b1b1b]" : "bg-[#FFFEEF]/20"}`}
          >
            {/* ON text – LEFT side */}
            {isToggleOn && (
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-[14px] font-medium font-sans tracking-wide text-[#FFFEEF]"
              >
                On
              </span>
            )}

            {/* OFF text – RIGHT side */}
            {!isToggleOn && (
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[14px] font-medium font-sans tracking-wide text-[#FFFEEF]"
              >
                Off
              </span>
            )}

            {/* Knob */}
            <div
              className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-[#DCB11C] shadow-[0_0_6px_rgba(220,177,28,0.6)] transition-all duration-300 ${isToggleOn ? "right-0.5" : "left-0.5"}`}
            />
          </div>
        </button>



          </div>

          <div className={`${subtleBox} p-5 mb-6`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 mb-3 last:mb-0"
              >
                <div className={accent}>{feature.icon}</div>
                <span className="text-sm font-sans font-light text-[16px] text-[#FFFEEF] ">{feature.text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-[16px] font-sans font-light text-[#FFFEEF] leading-relaxed">
            Users will be gradually invited to avoid spam or sudden influx.
          </p>
        </div>

        {isToggleOn?<button
          onClick={()=>router.push("/partner")}
          className={`w-full ${cta} text-[#FFFEEF] text-[18p] font-semibold py-4  rounded-full transition-all duration-300 shadow-lg border border-[#FFFEEF]/10`}
        >
          CONTINUE
        </button>:
        <button
          onClick={onContinue}
          className={`w-full ${cta} text-[#FFFEEF] text-[18p] font-semibold py-4  rounded-full transition-all duration-300 shadow-lg border border-[#FFFEEF]/10`}
        >
          SUBMIT
        </button>}
      </div>
    </div>
    </>
  );
}
