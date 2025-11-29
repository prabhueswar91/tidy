"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import TidyLoader from "../components/TidyLoader";
import toast from "react-hot-toast";
import Image from "next/image";
import BgCard from "../assets/card-1.png";
import Close from "../assets/close.svg";
import { useRouter } from "next/navigation";
import { useTelegram } from "../context/TelegramContext";

const tabs = ["Weekly", "Monthly", "Overall"];

export default function Leaderboard() {
  const router = useRouter();
  const { telegramId } = useTelegram();
//   const telegramId = 6195798875;

  const [activeTab, setActiveTab] = useState("Weekly");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<any>(null);
    const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!telegramId) {
        toast.error("Telegram ID not found. Please log in via Telegram.");
        setLoading(false);
        return;
      }
  
      const fetchUserId = async () => {
        try {
          const res = await axiosInstance.post("/auth/getUserIdByTelegram", {
            telegramId,
          });
          setUserId(res.data.userId);
          console.log("✅ User ID:", res.data.userId);
        } catch (err) {
          console.error("❌ Failed to fetch user ID:", err);
        }
      };
  
      fetchUserId();
    }, [telegramId]);

  useEffect(() => {
    if (!telegramId) return;

    fetchUserPoints();
    fetchLeaderboard(activeTab);
  }, [telegramId, activeTab]);

  // Get current user points
  const fetchUserPoints = async () => {
    try {
      const res = await axiosInstance.get(`/points/user/${userId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setUserPoints(res.data[0]);
      }
    } catch (err) {
      toast.error("Error loading user points");
    }
  };

  // Fetch leaderboard based on tab
  const fetchLeaderboard = async (type: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/points/leaderboard?type=${type.toLowerCase()}`
      );
      setLeaderboard(res.data);
    } catch (err) {
      toast.error("Failed to load leaderboard");
    }
    setLoading(false);
  };

  if (loading) return <TidyLoader />;

  return (
    <div className="relative bg-[#141318]/40 w-full min-h-screen flex justify-center text-[#FFFEEF] font-dm p-4 overflow-auto scrollbar-hide">
      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="relative w-full max-w-3xl flex flex-col space-y-6">
        <button
          onClick={() => router.push("/")}
          className="self-end bg-black border border-[#D2A100] p-2 rounded-full"
        >
          <Image src={Close} alt="close" width={14} height={14} />
        </button>

        {/* USER SCORE BAR */}
        <div className="bg-[#110E05] p-4 rounded-lg border border-[#362A02]">
          <p className="text-center text-sm text-[#D2A100] font-semibold">Your Stats</p>
          <div className="flex justify-between mt-2">
            <span>Total Points: </span>
            <span className="text-[#D2A100] font-bold">{userPoints?.totalPoint || 0}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Latest Earned: </span>
            <span className="text-[#D2A100] font-bold">{userPoints?.point || 0}</span>
          </div>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex justify-center space-x-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-xs rounded-full border ${
                activeTab === tab
                  ? "bg-[#D2A100] text-black"
                  : "border-[#D2A100] text-[#FFFEEF]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-[#141318cc] backdrop-blur-sm rounded-lg">
          <h2 className="text-md font-bold mb-3 text-[#D2A100] text-center">
            {activeTab} Leaderboard
          </h2>
          {leaderboard.length > 0 ? (
            <table className="w-full text-xs border-collapse border border-[#695100]">
              <thead>
                <tr className="bg-[#110E05] text-[#FFFEEF]">
                  <th className="px-3 py-2 border">Rank</th>
                  <th className="px-3 py-2 border">User</th>
                  <th className="px-3 py-2 border">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <tr key={user.id} className="text-center hover:bg-[#1f1e25]">
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{user.username || "User"}</td>
                    <td className="border px-3 py-2 text-[#D2A100] font-bold">
                      {user.totalPoint || user.point || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-sm">No leaderboard data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
