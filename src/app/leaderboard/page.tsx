"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import TidyLoader from "../components/TidyLoader";
import toast from "react-hot-toast";
import Image from "next/image";
import BgCard from "../assets/card-1.png";
import Close from "../assets/close.svg";
import { useRouter } from "next/navigation";
import Search from "../assets/search.svg";
import Star from "../assets/star-arrow.svg";
import Button from "../components/ui/Button";
import { useTelegram } from "../context/TelegramContext";
import { Info,User } from "lucide-react";


const tabs = ["Weekly", "Monthly", "Overall"];

const TAB_TYPE_MAP: Record<string, number> = {
  Weekly: 1,
  Monthly: 2,
  Overall: 3,
};

export default function Leaderboard() {
  const router = useRouter();
  const { telegramId } = useTelegram();
  // const telegramId = 6195798875;

  const [activeTab, setActiveTab] = useState("Weekly");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sValue, setsValue] = useState("");

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
    if (!userId) return;

    fetchUserPoints();
    fetchLeaderboard(activeTab,"");
    setsValue("")
  }, [userId, activeTab]);

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
  const fetchLeaderboard = async (type: string,search:string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/points/leaderboard?type=${type.toLowerCase()}&search=${search}`
      );
      setLeaderboard(res.data);
    } catch (err) {
      toast.error("Failed to load leaderboard");
    }
    setLoading(false);
  };

  if (loading) return <TidyLoader />;

  function handleSearch(){
    fetchLeaderboard(activeTab,sValue)
  }

  function onchangeSearch(e:any){
    setsValue(e.target.value)
    console.log(e.target.value)
  }

  const generateTelegramUrl = () => {
    const url = `http://t.me/${process.env.NEXT_PUBLIC_CHANNEL_NAME}?start=${telegramId}`
    const shareUrl = encodeURIComponent(url);
    return `https://t.me/share/url?url=${shareUrl}`;
  };

  const handleShare = () => {
    if (!telegramId) return
    window.open(generateTelegramUrl(), '_blank', 'width=600,height=400');
  };

  return (
    <div className="relative bg-[#141318]/40 w-full min-h-screen flex justify-center text-[#FFFEEF] font-dm p-4 overflow-auto scrollbar-hide">
      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="relative w-full max-w-3xl flex flex-col space-y-4">
        <button
          onClick={() => router.push("/")}
          className="self-end bg-black border-2 border-[#8C6C00] p-2 rounded-full"
        >
          <Image src={Close} alt="close" width={14} height={14} />
        </button>

        {/* USER SCORE BAR */}
        {/* <div className="bg-[#110E05] p-4 rounded-lg border border-[#362A02]">
          <p className="text-center text-sm text-[#D2A100] font-semibold">
            Your Stats
          </p>
          <div className="flex justify-between mt-2">
            <span>Total Points: </span>
            <span className="text-[#D2A100] font-bold">
              {userPoints?.totalPoint || 0}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Latest Earned: </span>
            <span className="text-[#D2A100] font-bold">
              {userPoints?.point || 0}
            </span>
          </div>
        </div> */}
        <div className="flex flex-col justify-center text-center">
        <h3 className="text-xl font-bold">LeaderBoard</h3>
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm font-light">
          Play And Refer To Climb The Leaderboard
          </p>
        <Info size={12} onClick={() => router.push("/leader-info")}/>
        </div>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex justify-between md:w-[40%] space-x-3 bg-[#110E05B2] p-2 rounded align-middle mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-xs rounded-md border-0 ${
                activeTab === tab
                  ? "bg-[#8C6C00] text-black"
                  : " text-[#FFFEEF]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex flex-col justify-center text-center px-4">
          {/* Input Wrapper */}
          <div className="flex items-center bg-[#9292924D] rounded-full px-4 py-3">
            {/* Icon / Image */}
            <Image
              src={Search}
              alt="Telegram"
              width={20}
              height={20}
              className="mr-3"
            />

            {/* Input */}
            <input
              type="text"
              placeholder="Search Telegram Handle"
              className="bg-transparent outline-none text-[#D3D3C6] placeholder:text-[#D3D3C6] w-full"
              onChange={onchangeSearch}
              value={sValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#14131899] rounded-lg p-4">
          {/* <h2 className="text-md font-bold mb-3 text-[#D2A100] text-center">
            {activeTab} Leaderboard
          </h2> */}
          {leaderboard.length > 0 ? (
            <div className="w-full bg-[#14131899]/60 border-[1.5px] border-[#333333] rounded-md overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-[#FFFFFF33]">
                  {leaderboard.map((user, index) => (
                    <tr
                      key={user.userId ?? index}
                      className="text-center hover:bg-[#1f1e25] transition-colors"
                    >
                      <td className="px-3 py-3">{index + 1}</td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          {/* {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.username || "User"}
                              width={28}
                              height={28}
                              className="rounded-full w-6 h-6 object-cover border border-[#FFFFFF33]"
                              unoptimized
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#FFFFFF33]" />
                          )} */}
                          {/* <div className="w-6 h-6 rounded-full bg-[#FFFFFF33]" /> */}
                          <User size={8} strokeWidth={2.5} className="rounded-full w-4 h-4 object-cover border border-[#FFFFFF33]"/>

                          <span className="truncate max-w-[120px]">
                            {user.username || "User"}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-[#D2A100] font-bold">
                        {user.totalPoint ?? user.point ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-sm text-[#FFFEEF99]">
              No leaderboard data yet.
            </p>
          )}
        </div>
        <div className="mt-0 mx-6">
          <Button
            image={<Image src={Star} alt="Plus" width={18} height={18} />}
            borderColor="#7C7C7C"
            className="text-white bg-gradient-to-r from-[#242424] to-[#525252] text-[16px] font-semibold"
            onClick={() => handleShare()}
          >
            INVITE FRIENDS +250XP
          </Button>
        </div>
      </div>
    </div>
  );
}
