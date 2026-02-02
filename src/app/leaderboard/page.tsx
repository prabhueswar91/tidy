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
const { telegramId, userdata } = useTelegram();
useEffect(() => {
  console.log("Telegram userdata:", userdata);
}, [userdata]);

  // const telegramId = 6195798875;

  const [activeTab, setActiveTab] = useState("Weekly");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sValue, setsValue] = useState("");
  const [xpbalance, setxpbalance] = useState(0);

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
      const {data:response} = await axiosInstance.get(`/points/user/${userId}`);
      if (response) {
        setUserPoints(response?.totalPoints);
        getXPbalance(response?.walletAddress)
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

  async function getXPbalance(addr:string){
        try{
          const { data } = await axiosInstance.post("/auth/get-xp-balance", {
            walletAddress:addr,
            telegramId: telegramId
          });
          const bal = data?.balance ? Number(parseFloat(data.balance).toFixed(4)) : 0;
          setxpbalance(bal);
        }catch(error: unknown){
          
        }
    }

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

        {/* USER SUMMARY BAR */}
<div className="w-full bg-[#14131899]/80 border border-[#333333] rounded-xl px-4 py-3 flex items-center justify-between">
  
  {/* LEFT: Avatar + Name */}
  <div className="flex items-center gap-3">
    {userdata?.photo_url ? (
      <Image
        src={userdata.photo_url}
        alt="Profile"
        width={40}
        height={40}
        className="rounded-full object-cover"
        unoptimized
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
        <User size={16} />
      </div>
    )}

    <span className="font-medium text-sm">
      {userdata?.username
        ? `@${userdata.username}`
        : userdata?.first_name || "User"}
    </span>
  </div>

  {/* RIGHT: TOTAL XP */}
  <div className="text-right">
    <p className="text-[11px] text-[#FFFEEF99]">Total XP</p>
    <p className="text-sm font-semibold">
      {userPoints ?? 0}
    </p>
  </div>
</div>

        <div className="flex flex-col justify-center text-center">
        <h3 className="text-xl font-bold">LeaderBoard</h3>
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm font-light">
          Play and refer to climb the leaderboard
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
              placeholder="Search telegram handle"
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
  className={`text-center transition-colors ${
    user.userId === userId
      ? "bg-[#2A2414] border-l-4 border-[#D2A100]"
      : "hover:bg-[#1f1e25]"
  }`}
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
