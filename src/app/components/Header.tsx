"use client";

import { useEffect, useState, useCallback } from "react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { useWallet } from "../hooks/useWallet";
import { useAppStore } from "../store/useAppStore";
import axios from "axios";

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

  const { setWalletAddress, selectedTier, amount } = useAppStore();
  const [telegramId, setTelegramId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tgId = params.get("tgId");
    if (tgId) {
      setTelegramId(Number(tgId));
      console.log("✅ Telegram ID from URL:", tgId);
    }
  }, []);

  // useEffect(() => {
  //   const getTelegramUser = () => {
  //     if (
  //       typeof window !== "undefined" &&
  //       window.Telegram &&
  //       window.Telegram.WebApp
  //     ) {
  //       const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
  //       if (tgUser) {
  //         setTelegramId(tgUser.id);
  //         console.log("✅ Telegram User:", tgUser);
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

  console.log("telegramId data", telegramId);

  const handleSignIn = useCallback(
    async (walletAddress: string) => {
      try {
        console.log("telegramId", telegramId);
        const { data } = await axios.post(
          `http://localhost:5000/api/auth/nonce`,
          { address: walletAddress }
        );
        const nonce = data.nonce;

        if (!provider) throw new Error("No provider found");

        const signer = await provider.getSigner();
        const signature = await signer.signMessage(
          `Sign this message to log in: ${nonce}`
        );

        const verifyRes = await axios.post(
          `http://localhost:5000/api/auth/verify`,
          {
            address: walletAddress,
            signature,
            tier: selectedTier,
            amount,
            // telegram: 6195798875,
            telegram: telegramId,
          }
        );

        const { token } = verifyRes.data;
        localStorage.setItem("auth_token", token);

        console.log("✅ Signed in successfully:", { selectedTier, amount });
      } catch (error) {
        console.error("❌ Wallet sign-in failed", error);
      }
    },
    [telegramId, provider, selectedTier, amount]
  );

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      handleSignIn(address);
    } else {
      setWalletAddress(null);
    }
  }, [isConnected, address, setWalletAddress, handleSignIn]);

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
          onClick={() => setIsWalletOpen(true)}
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

          <Button
            borderColor="#797979"
            fromColor="#EBB457"
            toColor="#efefef"
            marginTop="mt-6"
            onClick={() => connect("walletConnect")}
            disabled={!isReady}
          >
            Trust Wallet
          </Button>
        </div>
      </Modal>
    </div>
  );
}
