"use client";

import Button from "./ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Tidy from "../assets/tidy.svg";
import Gift from "../assets/gift-icon.svg";
import { User } from "lucide-react";

export default function StakeButton() {
    const router = useRouter();
    const handleProfileClick = () => {
        router.push('/settings');
    };

  return (
    <div className="flex items-center justify-between w-full max-w-md gap-2">
        <div className="absolute top-1 right-0 z-10">
            <button
                type="button"
                className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#EBB457] to-[#efefef] text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={handleProfileClick}
            >
                <User size={14} strokeWidth={2.5} />
            </button>
        </div>


        <Button
            className="!py-1 w-full max-w-sm text-sm text-[#77EBFF] px-2 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_100%)] font-semibold  font-sans"
           // image={<Image src={Tidy} alt="Tidy" width={18} height={18} />}
            borderColor={"#045867"}
            onClick={() =>
            window.open(
                "https://staking.bitcoinderby.live/staking/0xC220AA403Ee2134D8B2d82b07F41eFC440A41db4",
                "_blank"
            )
            }
        >
            STAKE $TIDY,EARN XP
        </Button>
        <Button
            className="!py-1 w-full max-w-sm text-sm text-[#D2A100] px-2 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_100%)] font-semibold font-sans"
            image={<Image src={Gift} alt="Gift" width={18} height={18} />}
            borderColor={"#D2A100"}
            fromColor={"#110E05"}
            toColor={"#362A02"}
            onClick={() => router.push("/rewards")}
        >
            VIEW REWARDS
        </Button>
    </div>
  );
}
