import { ReactNode } from "react";
import StakeButton from "../StakeButton";
import Button from "./Button";
// import Image from "next/image";
import { useRouter } from "next/navigation";
// import Tidy from "../../assets/tidy.svg";
import Image from "next/image";
import Close from "../../assets/close.svg";
import { useUI } from "../../context/closebtnContext";

interface CardProps {
  children: ReactNode;
  className?: string;
  paddingY?: string;
  bgClass?: string;
  disableOverlay?: boolean;
  variant?: "default" | "conic";
}

export default function Card({
  children,
  className = "",
  paddingY = "py-0 md:py-0",
  bgClass,
  disableOverlay = false,
  variant = "default",
}: CardProps) {
  const defaultBg = "bg-gradient-to-b from-[#0B1925] to-[#141318]";
const { setShowLogin } = useUI();

  const conicBg =
    "bg-[conic-gradient(at_top_center,#141318,#8EFFC780,#8EFFC780_50%,#BFF36D3B_75%,#BFF36D80_100%)]";

  const backgroundClass =
    bgClass || (variant === "conic" ? conicBg : defaultBg);

  const router = useRouter();

  return (
    <div
      className={`relative w-full min-h-screen md:max-w-sm ${paddingY} shadow-2xl text-center ${backgroundClass} ${className}`}
    >
      <button
   onClick={() => setShowLogin(false)}
    className="absolute top-4 right-4 z-20 bg-black border-2 border-[#8C6C00] p-2 rounded-full"
  >
    <Image src={Close} alt="close" width={14} height={14} />
  </button>
      {!disableOverlay && variant === "default" && (
        <div className="absolute inset-0 bg-[#0B1925] before:absolute before:inset-x-0 before:top-0 before:h-[40%] before:bg-[radial-gradient(ellipse_at_top,#BFF36D3B_0%,transparent_70%)] before:opacity-90 after:absolute after:inset-x-0 after:bottom-0 after:h-[40%] after:bg-[radial-gradient(ellipse_at_bottom,#BFF36D80_0%,transparent_70%)] after:opacity-90 pointer-events-none"></div>
      )}
      <div className="relative z-10 mt-8 p-4 py-2">
        <StakeButton />
        <div>
          <Button
            className="!py-1 w-full max-w-sm text-sm text-[#D2A100] px-2 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_100%)] font-semibold font-sans"
            // image={<Image src={Tidy} alt="Gift" width={18} height={18} />}
            borderColor={"#D2A100"}
            fromColor={"#110E05"}
            toColor={"#362A02"}
            onClick={() => router.push("/leaderboard")}
          >
            Leaderboard
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
