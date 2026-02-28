"use client";

import { useEffect, useState, useCallback } from "react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { useAppStore } from "../store/useAppStore";
import axiosInstance from "../utils/axiosInstance";
import { useTelegram } from "../context/TelegramContext";
import { UserContext } from "../context/UserContext";
import { useAppKit } from '@reown/appkit/react';


interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface HeaderProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  checkPartner: () => Promise<void>;
}

export default function Header({ setIsModalOpen, checkPartner }: HeaderProps) {
  const {
    address,
    isConnected,
    connect,
    logout,
    isWalletOpen,
    setIsWalletOpen,
    formatAddress,
    provider
  } = useWallet();

  const isTelegramWebView = /Telegram/i.test(navigator.userAgent);

  const { setWalletAddress, selectedTier, amount, setTelegramId } = useAppStore();
  const { telegramId } = useTelegram();
 const { open } = useAppKit();
  const [loader, setloader] = useState(false);
  const [xpbalance, setxpbalance] = useState(0);
  const { getUserInfo } = UserContext();
  const appkit = useAppKit();
console.log("APPKIT OBJECT:", appkit);
  // ---- Type guard to check ApiError ----
function isApiError(err: unknown): err is ApiError {
  return typeof err === "object" && err !== null && "response" in err;
}

  // useEffect(() => {
  //   if (isConnected && address) {
  //     setWalletAddress(address);
  //     getXPbalance(address);
  //     //handleSignIn(address);
  //   } else {
  //     setWalletAddress(null);
  //   }
  // }, [isConnected, address, setWalletAddress]);
  useEffect(() => {
  if (isConnected && address) {
    setWalletAddress(address);
    getXPbalance(address);

    // ✅ Force Telegram to regain focus
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

  } else {
    setWalletAddress(null);
  }
}, [isConnected, address]);

  async function getXPbalance(addr:any){
      try{
        const { data } = await axiosInstance.post("/auth/get-xp-balance", {
          walletAddress:addr,
          telegramId: telegramId
        });
        const bal = data && data.balance? data.balance:0;
        setxpbalance(bal);
      }catch(error: unknown){
        
      }
  }

  // async function connectWallet(){
  //   await close();
  //   await logout();
  //   await new Promise(resolve => setTimeout(resolve, 200));
  //   await open();
  // }
// async function connectWallet() {
//   try {
//     const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//     if (isMobile && !window.ethereum) {
//       window.location.href =
//         "https://metamask.app.link/dapp/" + window.location.host;
//       return;
//     }

    
//   } catch (error) {
//     console.error("Wallet connection failed:", error);
//   }
// }
async function connectWallet() {
  try {
    await open()
  } catch (err) {
    console.error('Wallet connection failed:', err)
  }
}
  async function payNow(){

    if (!isConnected || !address) {
      toast.error("Please connect wallet and continue", {
        id: "123",
        duration: 5000,
        icon: "❌",
      });
      return;
    }

    setloader(true)

    try {
        console.log("telegramId", telegramId);

        const { data } = await axiosInstance.post("/auth/nonce", {
          address,
          telegram: telegramId,
          tier: selectedTier
        });
        const nonce = data.nonce;
        const isPay = data.isPay;
        console.log(isPay,'isPayisPay',data)
        if (!provider) {
          throw new Error("No provider found");
        }

        const signer = await provider.getSigner();
        let signmessage = `Sign this message to log in: ${nonce}.`
        if(isPay){
           console.log('isPayisPay11')
          signmessage = `Sign this message to log in: ${nonce}. I confirm the deduction of ${amount} XP from my account to proceed with this purchase.`
          
        }

        const signature = await signer.signMessage(signmessage);
        
        const verifyRes = await axiosInstance.post("/auth/verify", {
          address,
          signature,
          tier: selectedTier,
          amount,
          telegram: telegramId,
          initData:window?.Telegram?.WebApp?.initData
          //telegram: 6195798879,
        });

        const { token,message } = verifyRes.data;
        if (token) {
          
          localStorage.setItem("token", token);
          console.log("✅ Signed in successfully:", { selectedTier, amount });
          if(message=="Verified, XP deducted, and tier updated"){
            toast.success(`Successfully purchased the ${selectedTier?.toUpperCase()} package.`, {
                id: "123",
                duration: 3000,
                icon: '✅'
            });
            
          }
          getUserInfo()
          setloader(false);
          setIsModalOpen(false);
          await checkPartner();
          
        }else{
         // logout()
          toast.error("Insufficient XP balance.", {
              id: "123",
              duration: 5000,
              icon: '❌'
          })
          setloader(false)
        }
      }catch (error: unknown) {
          console.error("❌ Error caught:", error);

          let message = "Please try again later.";

          if (error instanceof Error) {
            const errMsg = error.message.toLowerCase();

            if (errMsg.includes("user rejected") || errMsg.includes("connection rejected")) {
              message = "Connection rejected";
            } else if (errMsg.includes("xp deduct") || errMsg.includes("xp balance")) {
              message = "Insufficient XP balance.";
            }
          }

          if (isApiError(error) && error.response?.data?.error === "XP deduct failed") {
            message = "Insufficient XP balance.";
          }

          toast.error(message, {
            id: "123",
            duration: 5000,
            icon: "❌",
          });

          setloader(false)

          //logout();
      }
  }

  return (
    <div>
      {isConnected ? (
        <div>
          <span>{formatAddress(address || "")}</span>
           <div className="text-[#FFFEEF] text-sm font-dm">
            Balance: <span className="font-semibold">{xpbalance} XP</span>
          </div>
          <Button className="text-[#43411D] uppercase font-bold bg-[#FFFEEF]" onClick={() => payNow()} disabled={loader}>
            {loader?"Processing":"PAY NOW"}
          </Button>
          <Button onClick={logout}>Disconnect</Button>
        </div>
      ) : (
        <Button className="text-[#43411D] uppercase font-bold bg-[#FFFEEF]" onClick={connect}>
          Connect Walletpppp
        </Button>
      )}

      <Modal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)}>
        <h2>Connect Wallet</h2>
        <div>
         <Button
          className="text-[#43411D] uppercase font-bold bg-[#FFFEEF]"
          onClick={connect}
        >
          Connect Walletaaa
        </Button>
        </div>
      </Modal>
    </div>
  );
}
