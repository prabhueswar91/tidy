"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TidyZenApp() {
  const [stage, setStage] = useState<"moment" | "reward">("moment");
  const [reward, setReward] = useState<string | null>(null);
  const rewards = ["10 $TIDY", "Bronze TidyZen", "Silver TidyZen", "Gold TidyZen", "Zen Quote 🌿"];

  const revealReward = () => {
    let i = 0;
    const interval = setInterval(() => {
      setReward(rewards[i % rewards.length]);
      i++;
      if (i > rewards.length * 4) {
        clearInterval(interval);
        const finalReward = rewards[Math.floor(Math.random() * rewards.length)];
        setReward(finalReward);
      }
    }, 200 - i * 10); // faster each cycle
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-100 to-white p-4">
      {stage === "moment" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">🪷 TidyZen Moment</h1>
          <p className="mb-4">Breathe in... breathe out... relax 🌿</p>
          <button
            onClick={() => setStage("reward")}
            className="bg-green-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-green-700"
          >
            Complete Session
          </button>
        </motion.div>
      )}

      {stage === "reward" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">🎁 Reveal Your Reward</h2>
          <button
            onClick={revealReward}
            className="bg-purple-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-purple-700 mb-6"
          >
            Reveal Reward
          </button>

          {reward && (
            <motion.div
              key={reward}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="text-xl font-bold text-green-800"
            >
              {reward}
            </motion.div>
          )}

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
              Thank you for taking a TidyZen moment — powered by <b>$TIDY</b> and frens
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
