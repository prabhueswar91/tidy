"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Close from "./assets/close.svg";

export default function GlobalCloseButton() {
  const router = useRouter();
  const pathname = usePathname();
if (pathname === "/loading") return null;
  // 🔥 Hide Telegram default back button
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  }, []);

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="fixed top-4 right-4 z-50 bg-black border-2 border-[#8C6C00] p-2 rounded-full"
    >
      <Image src={Close} alt="close" width={14} height={14} />
    </button>
  );
}
