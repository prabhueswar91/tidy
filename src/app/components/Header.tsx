"use client";

import { useEffect, useState, useCallback } from "react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { useAppStore } from "../store/useAppStore";
import axiosInstance from "../utils/axiosInstance";
import { useTelegram } from "../context/TelegramContext";
import { useAppKit } from '@reown/appkit/react';


interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function Header() {
  const {
    address,
    isConnected,
    connect,
    logout,
    isWalletOpen,
    setIsWalletOpen,
    formatAddress,
    isReady,
    provider,
  } = useWallet();

  const isTelegramWebView = /Telegram/i.test(navigator.userAgent);

  const { setWalletAddress, selectedTier, amount, setTelegramId } = useAppStore();
  //const [telegramId, setLocalTelegramId] = useState<unknown>(null);
  const { telegramId } = useTelegram();
  const { open } = useAppKit();

  // useEffect(() => {
  //   const getTelegramUser = () => {
  //     if (
  //       typeof window !== "undefined" &&
  //       window.Telegram &&
  //       window.Telegram.WebApp
  //     ) {
  //       const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
  //       if (tgUser) {
  //         setLocalTelegramId(tgUser.id);  
  //       setTelegramId(tgUser.id.toString());
  //       } else {
  //         console.warn("⚠️ Telegram WebApp exists, but user not ready yet");
  //       }
  //     } else {
  //       console.warn("⚠️ Telegram WebApp not found");
  //     }
  //   };

  //   getTelegramUser();
  //   const timer = setTimeout(getTelegramUser, 500);

  //   return () => clearTimeout(timer);
  // }, []);

  const handleSignIn = useCallback(
    async (walletAddress: string) => {
      try {
        console.log("telegramId", telegramId);

        const { data } = await axiosInstance.post("/auth/nonce", {
          address: walletAddress,
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
          address: walletAddress,
          signature,
          tier: selectedTier,
          amount,
          telegram: telegramId,
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
        }else{
          logout()
          toast.error("Insufficient XP balance.", {
              id: "123",
              duration: 5000,
              icon: '❌'
          })
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

          logout();
      }
    },
    [telegramId, provider, selectedTier, amount]
  );

  // ---- Type guard to check ApiError ----
function isApiError(err: unknown): err is ApiError {
  return typeof err === "object" && err !== null && "response" in err;
}

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      handleSignIn(address);
    } else {
      setWalletAddress(null);
    }
  }, [isConnected, address, setWalletAddress, handleSignIn]);

  function connectWallet(){
    logout();
    setTimeout(function(){
      console.log("open")
        open();
    },200)
    
  }

  return (
    <div>
      {isConnected ? (
        <div>
          <span>{formatAddress(address || "")}</span>
          <Button onClick={logout}>Disconnect</Button>
        </div>
      ) : (
        <Button
          borderColor="#EBB457"
          fromColor="#efefef"
          toColor="#797979"
          // onClick={() => {
          //  // if (isTelegramWebView) {
          //     //alert("Please open in a browser to connect your wallet.");
          //    // window.open("https://test.bloxio.co/", "_blank");
          //   //} else {
          //     open(); // AppKit modal
          //  // }
          // }}
         onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      )}

      <Modal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)}>
        <h2>Connect Wallet</h2>
        <div>
          <Button
            borderColor="#797979"
            fromColor="#EBB457"
            toColor="#efefef"
            onClick={() => connect("metamask")}
          >
            Connect MetaMask
          </Button>
          {/* <Button
            borderColor="#797979"
            fromColor="#EBB457"
            toColor="#efefef"
            onClick={() => connect("coinbase")}
          >
           Coin Base
          </Button>
          <Button
            borderColor="#797979"
            fromColor="#EBB457"
            toColor="#efefef"
            onClick={() => connect("phantom")}
          >
            Phantom
          </Button>
          <appkit-button /> */}
          
        </div>
      </Modal>
    </div>
  );
}
