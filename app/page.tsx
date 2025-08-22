"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useAppKitWallet } from "@reown/appkit-wallet-button/react";
import { useDisconnect } from "@reown/appkit/react";
import { useWalletInfo } from '@reown/appkit/react'
import { useAppKitAccount } from "@reown/appkit/react";

export default function TidyZenApp() {
  const { walletInfo } = useWalletInfo();
  const { disconnect } = useDisconnect();
   const { address, caipAddress, isConnected } = useAppKitAccount();
  const [stage, setStage] = useState<"ui1" | "ui2">("ui1");
  const [ensoDuration, setEnsoDuration] = useState(4.2);
  const [reward, setReward] = useState<string | null>(null);

  

  const { connect, isReady } = useAppKitWallet({
    namespace: "eip155", // ✅ EVM namespace
    onSuccess: (address) => console.log("Connected:", address),
    onError: (err) => console.error("Connection error:", err),
  });

  const rewards = [
    "10 $TIDY",
    "Bronze TidyZen",
    "Silver TidyZen",
    "Gold TidyZen",
    "Zen Quote 🌿",
  ];

  const revealReward = () => {
    let i = 0;
    const interval = setInterval(() => {
      setReward(rewards[i % rewards.length]);
      i++;
      if (i > rewards.length * 5) {
        clearInterval(interval);
        const finalReward = rewards[Math.floor(Math.random() * rewards.length)];
        setReward(finalReward);
      }
    }, Math.max(100 - i * 5, 40)); // speeds up animation
  };
let defaultValue = [50], max = 100, step = 1;

async function disconnectWallet(){
disconnect()
}

console.log(isReady,'isReadyisReadyisReady')
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-100 to-white p-6">
      {/* -------- UI 1: Initiating Zen Moment -------- */}
      {stage === "ui1" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center space-y-6"
        >
          {/* Logo + Branding */}
          <div className="flex justify-center">
            <img src="/tidycoin-logo.png" alt="TidyCoin Logo" className="h-14" />
          </div>
          <h1 className="text-2xl font-bold">🪷 TidyZen Moment</h1>
          <p className="text-gray-600">Recharge, breathe, and earn rewards.</p>

            {/* <button className="m-2 p-2 bg-yellow-300 rounded" onClick={() => connect("metamask")}>Connect MetaMask (EVM)</button> */}

              {/* <div className="wallet-info">
              {walletInfo?.name && (
                <>
                  <img src={walletInfo.icon} alt={walletInfo.name} />
                  <span>{walletInfo.name}</span>
                </>
              )}
              </div> */}
              {address}
                {/* <appkit-connect-button label="Connect Wallet" /> */}
                {/* <appkit-wallet-button wallet="metamask"  /> */}

                 {address &&<button className="m-2 p-2 bg-yellow-300 rounded" onClick={() => disconnectWallet()}>Disconnect</button>}

                 <div className="">
                  <button
                    className="m-2 p-2 bg-yellow-300 rounded"
                    onClick={() => connect("metamask")}
                  // disabled={!isReady}
                  >
                    Connect MetaMask
                  </button>

                  <button
                    className="m-2 p-2 bg-yellow-300 rounded"
                    onClick={() => connect("phantom")}
                  // disabled={!isReady}
                  >
                    Phantom
                  </button>

                  <button
                    className="m-2 p-2 bg-blue-300 rounded"
                    onClick={() => connect("walletConnect")}
                    disabled={!isReady}
                  >
                    Open WalletConnect QR
                  </button>
                    <button
                   className="m-2 p-2 bg-yellow-300 rounded"
                    onClick={() => connect("coinbase")} 
                    disabled={!isReady}
                  >
                    Connect Coinbase Wallet
                  </button>
                </div>

          {/* Partner tickers (premium add-on) */}
          <div className="flex justify-center gap-4 mt-4">
            <span className="px-2 py-1 bg-gray-200 rounded text-sm">Partner1</span>
            <span className="px-2 py-1 bg-gray-200 rounded text-sm">Partner2</span>
          </div>

          {/* Spend Jungl XP */}
          <div className="space-y-3 mt-4">
            <button className="w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200">
              Spend 169 XP → Silver Enso
            </button>
            <button className="w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200">
              Spend 420 XP → Gold Enso
            </button>
          </div>

          {/* Stake $TIDY */}
          <a
            href="/staking"
            className="block text-blue-600 underline hover:text-blue-800"
          >
            Stake $TIDY for XP rewards
          </a>

          {/* Enso Duration Slider */}
          <div className="mt-4">
            <p className="mb-2">⏳ Duration: {ensoDuration.toFixed(1)} sec</p>
            <SliderPrimitive.Root
              className="relative flex w-full touch-none select-none items-center"
              defaultValue={defaultValue}
              max={max}
              step={step}
            >
              <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
                <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-white shadow" />
            </SliderPrimitive.Root>
          </div>

          {/* Start button */}
          <button
            onClick={() => setStage("ui2")}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-md hover:bg-green-700 w-full"
          >
            Begin TidyZen Moment
          </button>
        </motion.div>
      )}

      {/* -------- UI 2: Rewards -------- */}
      {stage === "ui2" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center space-y-6"
        >
          <h2 className="text-2xl font-semibold">🎁 Reveal Your Reward</h2>

          <button
            onClick={revealReward}
            className="bg-purple-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-purple-700"
          >
            Reveal Reward
          </button>

          {reward && (
            <motion.div
              key={reward}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="text-xl font-bold text-green-800 mt-6"
            >
              {reward}
            </motion.div>
          )}

          {/* Claiming options */}
          {reward && (
            <div className="mt-6 space-y-3">
              {reward.includes("$TIDY") && (
                <input
                  type="text"
                  placeholder="Enter wallet address"
                  className="border p-2 rounded w-full"
                />
              )}
              {(reward.includes("Bronze") ||
                reward.includes("Silver") ||
                reward.includes("Gold")) && (
                <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                  Claim Another Moment
                </button>
              )}
              {reward.includes("Zen Quote") && (
                <p className="italic text-gray-600">
                  "Peace comes from within. Do not seek it without."
                </p>
              )}
            </div>
          )}

          {reward && (
            <p className="mt-6 text-sm text-gray-500">
              🌿 Thank you for taking a TidyZen moment — powered by{" "}
              <b>$TIDY</b> and frens
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
