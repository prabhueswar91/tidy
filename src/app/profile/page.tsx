"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import TidyLoader from "../components/TidyLoader";
import Image from "next/image";
import BgCard from "../assets/card-1.png";
import Invite from "../components/Invite";
import { HiArrowLeft } from "react-icons/hi";
import Modal from "../components/ui/Modal";
import { useTelegram } from "../context/TelegramContext";
import { encryptData } from "../rewards/auth2/encrypt";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
    const { telegramId } = useTelegram();

  // const telegramId = 6195798875;

  useEffect(() => {
    async function fetchProfile() {
      if (!telegramId) {
        toast.error("Telegram ID not found. Please log in via Telegram.");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.post("/reward/profile", { telegramId });

        if (res.data?.status) {
          setProfile(res.data);
        } else {
          toast.error(res.data?.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Something went wrong fetching profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [telegramId]);

  if (loading) return <TidyLoader />;

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Profile not found
      </div>
    );
  }

  const { user, rewards, referrals, stats } = profile;

  // Open modal when claim clicked
  const openClaimModal = (reward: any) => {
    setSelectedReward(reward);
    setWalletAddress(user.walletAddress || "");
    setIsModalOpen(true);
  };

  const handleClaim = async () => {
    if (!walletAddress) {
      toast.error("Please enter a wallet address");
      return;
    }

    setClaiming(true);
    try {
      const res = await axiosInstance.post("/reward/claim-reward", {
          data: encryptData({
          id: selectedReward.id,
          userId: user.id,
          walletAddress,
          initData:window?.Telegram?.WebApp?.initData,
        })
      });

      if (res.data?.status) {
        toast.success("Reward claimed successfully!");
        setProfile((prev: any) => ({
          ...prev,
          rewards: prev.rewards.map((r: any) =>
            r.id === selectedReward.id ? { ...r, isClaim: true } : r
          ),
          stats: {
            ...prev.stats,
            unclaimedRewardsCount: prev.stats.unclaimedRewardsCount - 1,
          },
        }));
        setIsModalOpen(false);
      } else {
        toast.error(res.data?.message || "Failed to claim reward");
      }
    } catch (err) {
      console.error("Claim error:", err);
      toast.error("Something went wrong while claiming");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center text-[#FFFEEF] font-dm p-4 overflow-auto scrollbar-hide">
      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        priority
      />

      <div className="relative w-full max-w-md flex flex-col items-center space-y-6">
        <button
          onClick={() => router.push("/")}
          className="self-start mb-2 bg-[#D2A100] hover:bg-gradient-to-r hover:from-[#362A02] hover:to-[#110E05] text-[#FFFEEF] p-2 rounded text-sm flex items-center justify-center"
        >
          <HiArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={user.profilePhotoUrl || "/default-avatar.png"}
              alt="Profile"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <h1 className="text-xl font-bold mt-3">{user.username}</h1>
          <p className="text-sm text-gray-300">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm mt-1">
            Tier: <span className="font-semibold">{user.tier}</span>
          </p>
          <p className="text-xs mt-1 break-all">Wallet: {user.walletAddress}</p>
        </div>

        {/* Stats boxes */}
        <div className="flex w-full justify-between space-x-3">
          <div className="flex-1 bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] backdrop-blur-sm p-3 rounded-lg text-center">
            <p className="text-sm text-gray-300">Total Rewards</p>
            <p className="text-xl font-bold mt-1">{stats.totalRewardsCount}</p>
          </div>
          <div className="flex-1 bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] backdrop-blur-sm p-3 rounded-lg text-center">
            <p className="text-sm text-gray-300">Unclaimed Rewards</p>
            <p className="text-xl font-bold mt-1">{stats.unclaimedRewardsCount}</p>
          </div>
          <div className="flex-1 bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] backdrop-blur-sm p-3 rounded-lg text-center">
            <p className="text-sm text-gray-300">Referrals</p>
            <p className="text-xl font-bold mt-1">{stats.referralCount}</p>
          </div>
        </div>

        {/* Rewards */}
        <div className="w-full">
          <h2 className="text-lg font-bold mb-3 text-center">Rewards</h2>
          <div className="space-y-3 max-h-60 overflow-auto scrollbar-hide">
            {rewards.map((reward: any) => (
              <div
                key={reward.id}
                className="bg-[#141318] backdrop-blur-sm p-3 rounded-lg shadow-sm text-sm flex flex-col items-start"
              >
                <p>
                  <span className="font-semibold">{reward.type}</span> - {reward.value}
                </p>
                {reward.amount > 0 && (
                  <p className="text-green-400">Amount: {reward.amount}</p>
                )}
                {reward.txid && (
                  <p className="text-xs text-blue-400 break-all">TxID: {reward.txid}</p>
                )}
                <p className="text-xs text-gray-300 mb-2">
                  Tier: {reward.tier} | Claim: {reward.isClaim ? "✅" : "❌"}
                </p>
                {reward.type === "TOKEN" && !reward.isClaim && (
                  <button
                    onClick={() => openClaimModal(reward)}
                    className="bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] hover:from-[#362A02] hover:to-[#110E05] text-[#FFFEEF] px-3 py-1 rounded text-xs"
                  >
                    Claim
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Referrals */}
        <div className="w-full">
          <h2 className="text-lg font-bold mb-3 text-center">Referrals</h2>
          <div className="space-y-2 max-h-40 overflow-auto scrollbar-hide">
            {referrals.length > 0 ? (
              referrals.map((ref: any) => (
                <div
                  key={ref.id}
                  className="bg-[#141318cc] backdrop-blur-sm p-3 rounded-lg text-sm"
                >
                  Referral ID: {ref.referralId} | Played: {ref.isPlayed ? "Yes" : "No"}
                </div>
              ))
            ) : (
              <p className="text-gray-300 text-sm text-center">No referrals yet.</p>
            )}
          </div>
        </div>

        <Invite />
      </div>

      {/* Claim Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-3 text-center">Claim Reward</h2>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full mb-4 p-2 rounded border border-gray-600 text-black"
        />
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="w-full bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] text-white py-2 rounded font-semibold"
        >
          {claiming ? "Claiming..." : "Claim Reward"}
        </button>
      </Modal>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
