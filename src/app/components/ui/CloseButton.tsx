"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "../../context/closebtnContext";

export default function CloseButton() {
  const router = useRouter();
  const { showClose,setShowLogin } = useUI();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  if (showClose || !visible) return null;

  function navRoute() {
  setShowLogin(false);

  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/"); // fallback route
  }
}


  return (
    <button
      onClick={() => navRoute()}
      className="absolute top-4 right-4 w-9 h-9 z-50 bg-black text-[#8c6c00] border border-[#8C6C00] rounded-full hover:text-[#FFFEEF] text-md"
      aria-label="Close"
    >      ✕
    </button>
  );
}
