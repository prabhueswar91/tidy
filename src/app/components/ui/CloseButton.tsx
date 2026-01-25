"use client";

import { useRouter } from "next/navigation";

export default function CloseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 right-4 w-9 h-9 z-50 bg-black text-[#8c6c00] border border-[#8C6C00] rounded-full hover:text-[#FFFEEF] text-md"
      aria-label="Close"
    >      ✕
    </button>
  );
}
