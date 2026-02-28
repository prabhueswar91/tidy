"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { useRouter } from "next/navigation";
import Header from "./Header";
import { useAppStore } from "../store/useAppStore";
import axiosInstance from "../utils/axiosInstance";
import TidyLoader from "./TidyLoader";
import Invite from "../components/Invite";

interface Tier {
  id: number;
  name: string;
  amount: number;
  status: "active" | "inactive";
  color: string;
  bgColor: string;
  createdAt: string;
  updatedAt: string;
}

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { selectedTier, setSelectedTier, walletAddress } = useAppStore();

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/tiers");
        setTiers(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching tiers:", err);
      } finally {
        setTimeout(function () {
          setLoading(false);
        }, 600);
      }
    };
    fetchTiers();
  }, []);

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier.name, tier.amount);

    if (
      tier.name.toUpperCase() === "SILVER" ||
      tier.name.toUpperCase() === "GOLD"
    ) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleContinue = () => {
    if (!selectedTier) {
      toast.error("Please select a tier first!", {
        id: "123",
        duration: 3000,
      });
      return;
    }

    if (
      (selectedTier.toUpperCase() === "SILVER" ||
        selectedTier.toUpperCase() === "GOLD") &&
      !walletAddress
    ) {
      toast.error(
        "Please connect your wallet to continue with Silver or Gold.",
        {
          id: "123",
          duration: 3000,
        }
      );
      return;
    }

    router.push("/Tier");
  };

  if (loading) {
    return <TidyLoader />;
  }

  return (
    <div className="flex min-h-screen items-center font-dm justify-center text-[#FFFEEF] bg-gradient-to-b from-[#0a0a0a] to-[#1e293b]">
      <Card paddingY="py-16 md:py-20">
        <h1 className="text-white text-xl font-bold tracking-widest">
          TIDYCOIN
        </h1>
        <p className="mt-1 text-xl font-normal">TidyZen Moments</p>
        <p className="mt-6">Choose Today&apos;s Zen Level</p>
        <div className="mb-10 mt-1 border-b-2 border-[#FFFEEF]/10"></div>

        <div className="space-y-3">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => handleTierSelect(tier)}
              className={`w-full flex items-center justify-between rounded px-5 py-3 font-semibold transition border 
                ${
                  selectedTier === tier.name
                    ? "ring-2 ring-yellow-400 bg-opacity-70"
                    : ""
                } 
                hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              style={{
                backgroundColor: tier.bgColor,
                color: tier.color,
                borderColor: tier.color,
              }}
            >
              <span className="uppercase tracking-widest">{tier.name}</span>
              <span className="text-sm">
                {tier.amount > 0 ? `${tier.amount} XP` : "FREE"}
              </span>
            </button>
          ))}
        </div>

        <Button onClick={handleContinue}>CONTINUE</Button>
        <p className="mt-3 text-xs text-gray-400">
          Your moments are a click away
        </p>
        <Invite />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold my-6 text-center">
          Connect Wallet to Pay
        </h2>

        {selectedTier && (
          <div className="flex justify-between text-[#FFFEEF] items-center px-6">
            <h3 className="font-bold text-xl">Total</h3>
            <p className="font-semibold">
              <span className="text-sm font-normal">
                {selectedTier.toUpperCase()} TIER
              </span>
            </p>
          </div>
        )}

        <Header />
      </Modal>
    </div>
  );
}
