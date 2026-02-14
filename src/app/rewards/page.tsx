"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import TidyLoader from "../components/TidyLoader";
import Image from "next/image";
import BgCard from "../assets/card-1.png";
import { useRouter } from "next/navigation";
import Close from "../assets/close.svg";
import Modal from "../components/ui/Modal";
import ReactPaginate from "react-paginate";
import { useTelegram } from "../context/TelegramContext";
import { UserContext } from "../context/UserContext";
import { useAppStore } from "../store/useAppStore";
import {encryptData} from "./auth2/encrypt"
import { User } from "lucide-react";

type Community = {
  id: number;
  groupName: string;
  groupLink: string;
  joined: boolean;
};

type Booster = {
  id: number;
  label: string;
  price: string;
};

type Requirements1 = {
  communities: Community[];
  boosters: Booster[];
};


export default function PendingRewards() {
  const router = useRouter();
  const { getUserInfo,userInfo } = UserContext();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { setSelectedTier, setZenCode } = useAppStore();
 const [userPoints, setUserPoints] = useState<any>(null);
  // Claim modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [groupList, setgroupList] = useState([]);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isFetch, setisFetch] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [requirements1, setRequirements1] = useState<Requirements1>({
    communities: [],
    boosters: []
  });


  const [reqLoading, setReqLoading] = useState(false);
  const closeRequirementModal = () => {
    setIsRequirementModalOpen(false);
    //setRequirements(null);
  };

  const itemsPerPage = 10;

  const { telegramId, userdata, hash } = useTelegram();
  
  // const telegramId = 6195798875;
  console.log(userInfo,'userInfouserInfo',userInfo?.walletAddress)
  // useEffect(() => {
  //   async function fetchPending() {
  //     try {
  //       const res = await axiosInstance.post("/reward/pending", { telegramId });

  //       if (res.data?.status) {
  //         setRewards(res.data.rewards || []);
  //         setReferrals(res.data.referrals || []);
  //         setUser(res.data.user || null);
  //       } else {
  //         toast.error(res.data?.message || "Failed to load pending rewards");
  //       }
  //     } catch (err) {
  //       console.error("Pending fetch error:", err);
  //       toast.error("Something went wrong fetching pending rewards");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchPending();
  // }, []);
useEffect(() => {
  if (!telegramId) {
    console.warn(" Waiting for telegramId...");
    return;
  }


  async function fetchPending() {
    try {
      const res = await axiosInstance.post("/reward/pending", {
        telegramId,
      });

      if (res.data?.status) {
        setRewards(res.data.rewards || []);
        setReferrals(res.data.referrals || []);
        setUser(res.data.user || null);
      } else {
        toast.error(res.data?.message || "Failed to load pending rewards");
      }
    } catch (err) {
      console.error("Pending fetch error:", err);
      toast.error("Something went wrong fetching pending rewards");
    } finally {
      setLoading(false);
    }
  }

  fetchPending();
}, [telegramId]); // 👈 IMPORTANT
async function getRequirementList() {
  if (!telegramId) {
    toast.error("Telegram not connected");
    return;
  }

  setReqLoading(true);
  try {
    const { data } = await axiosInstance.get("/points/requirement-list");

    if (data?.success) {
      setRequirements1({
        communities: data.community_list || [],
        boosters: data.plans || []
      });

    } else {
      toast.error("Failed to load requirements");
    }
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setIsRequirementModalOpen(true)
    setReqLoading(false);
  }
}

  useEffect(() => {
    if(userInfo?.walletAddress){
        setWalletAddress(userInfo?.walletAddress)
    }
  }, [userInfo?.walletAddress]);

  if (loading) return <TidyLoader />;

  // Open claim modal
  const openClaimModal = (reward: any) => {
    // if(!walletAddress){
    //   toast.error("Please update your wallet and continue");
    //   router.push(`/settings`);
    //   return
    // }
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  const handleSpin = (reward: any) => {
  setSelectedTier(reward.tier, reward.amount);

  setZenCode(reward.zenCode);
  console.log("spinn",reward.zenCode)
  router.push(`/Tier?zen_code=${reward.zenCode}`);
};

  const handleClaim = async () => {
    if (!walletAddress) {
      toast.error("Please enter a wallet address");
      return;
    }

    setClaiming(true);
    try {
      console.log("user", user);
      let a = encryptData({
        id: selectedReward.id,
        walletAddress,
        initData:window?.Telegram?.WebApp?.initData
      })
      const res = await axiosInstance.post("/reward/claim-reward", {data:a});
      console.log("user", user);

      if (res.data?.status) {
        toast.success("Reward claimed successfully!");

        // Update UI immediately
        setRewards((prev) =>
          prev.map((r) =>
            r.id === selectedReward.id ? { ...r, isClaim: true } : r
          )
        );
        getUserInfo();
        setIsModalOpen(false);
      } else if(res?.data?.error) {
        toast.error(res?.data?.error);
      }else{
         toast.error("Try again later");
      }
    } catch (err:any) {
      console.error("Claim error:", err);
      const errorMessage = 
      err?.response?.data?.error ||           // API error message
      err?.response?.data?.message ||         // Alternative message field
      err?.message ||                          // Generic error message
      "Something went wrong while claiming";   
      toast.error(errorMessage);
      if(errorMessage=="Join our Telegram community to unlock claiming."){
        getCommunityList()
      }
    } finally {
      setClaiming(false);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentRewards = rewards.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(rewards.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  async function getCommunityList(){
    setisFetch(true)
    try{
      const {data:response} = await axiosInstance.post("/points/joined-community-list", {telegramId});
      if(response && response.list){
        setgroupList(response.list);
        setIsCommunityModalOpen(true);
      }
    }catch(err){
    
    }finally{
      setisFetch(false)
    }
    
  }

  return (
    <div className="relative bg-[#141318]/40 w-full min-h-screen flex justify-center text-[#FFFEEF] font-dm p-4 overflow-auto scrollbar-hide">
      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        priority
      />
<div className="relative w-full max-w-3xl flex flex-col space-y-4">
        <button
          onClick={() => router.back()}
          className="self-end bg-black border-2 border-[#8C6C00] p-2 rounded-full"
        >
          <Image src={Close} alt="close" width={14} height={14} />
        </button>
     
       
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
      {userPoints?.totalPoint ?? 0}
    </p>
  </div>
</div>
<div className="flex justify-center">
 <button
  onClick={getRequirementList}
  disabled={reqLoading}
  className={`px-6 py-2 rounded-full text-sm font-semibold
  bg-gradient-to-r from-[#110E05] to-[#362A02]
  border border-[#D2A100] text-[#FFFEEF]
  hover:opacity-90 transition
  ${reqLoading ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {reqLoading ? "Loading..." : "My reward requirements"}
</button>

</div>

        <div className="bg-[#141318cc] backdrop-blur-sm rounded-lg pt-4">
          <h2 className="text-md font-bold mb-3 text-[#D2A100] text-center">
            Pending Rewards
          </h2>
          {rewards.length > 0 ? (
            <>
              <table className="w-full text-xs border-collapse border border-[#695100]">
                <thead>
                  <tr className="bg-[#110E05] text-[#FFFEEF]">
                    <th className="border border-[#362A02] px-3 py-2 text-left">
                      Type
                    </th>
                    <th className="border border-[#362A02] px-3 py-2 text-left">
                      Balance
                    </th>
                    <th className="border border-[#362A02] px-3 py-2 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#110E05]">
                  {currentRewards.map((reward: any) => (
                    <tr key={reward.id} className="hover:bg-[#1f1e25]">
                      <td className="border border-[#353535] px-3 py-2">
                        {reward.type === "TOKEN"
                          ?"$TIDY"
                          : "ZEN MOMENTS"}
                      </td>
                      <td className="border border-[#353535] px-3 py-2">
                        {reward.amount?reward.amount+" "+reward.symbol:"-"}
                      </td>
                      <td className="border-b border-[#353535] px-3 py-2">
                        {!reward.isClaim ? (
                          reward.type === "TIDY_ZEN_MOMENT" ? (
                            reward.isSpin === false ? (
                              <button
                                onClick={() => handleSpin(reward)}
                                className="bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] hover:from-[#362A02] hover:to-[#110E05] text-[#FFFEEF] px-6 py-1 rounded-full text-xs"
                              >
                                Spin
                              </button>
                            ) : (
                              <button
                                className="bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#362A02] text-[#FFFEEF] px-3 py-1 rounded-full text-xs"
                                disabled
                              >
                                Claimed
                              </button>
                            )
                          ) : reward.amount>0?(
                            <button
                              onClick={() => openClaimModal(reward)}
                              className="bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] hover:from-[#362A02] hover:to-[#110E05] text-[#FFFEEF] px-5 py-1 rounded-full text-xs"
                            >
                              Claim
                            </button>
                          ):"-"
                        ) : (
                          <button
                            className="bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#362A02] text-[#FFFEEF] px-3 py-1 rounded-full text-xs"
                            disabled
                          >
                            Claimed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pageCount > 1 && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="›"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  pageCount={pageCount}
                  previousLabel="‹"
                  containerClassName="flex justify-center space-x-2 mt-4"
                  pageClassName="px-3 py-1 border border-[#362A02] rounded cursor-pointer"
                  activeClassName="bg-[#D2A100] text-black"
                  previousClassName="px-3 py-1 border border-[#362A02] rounded cursor-pointer"
                  nextClassName="px-3 py-1 border border-[#362A02] rounded cursor-pointer"
                  breakClassName="px-3 py-1"
                />
              )}
            </>
          ) : (
            <p className="text-center text-gray-300 text-sm">
              No rewards found.
            </p>
          )}
        </div>

        <div className="bg-[#141318cc] backdrop-blur-sm rounded-lg pt-4">
          <h2 className="text-lg font-bold mb-3 text-center text-[#D2A100]">
            Pending Referrals
          </h2>
          {referrals.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#110E05] text-[#D2A100]">
                  <th className="border border-[#362A02] px-3 py-2 text-left">
                    Referral ID
                  </th>
                  <th className="border border-[#362A02] px-3 py-2 text-left">
                    Played
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#110E05]">
                {referrals.map((ref: any) => (
                  <tr key={ref.id} className="hover:bg-[#1f1e25]">
                    <td className="border border-[#362A02] px-3 py-2">
                      {ref.userId}
                    </td>
                    <td className="border border-[#362A02] px-3 py-2">
                      {ref.isPlayed ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-300 text-sm">
              No referrals found.
            </p>
          )}
        </div>
      </div>




      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-3 text-center">Claim Reward</h2>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full mb-4 p-2 rounded border border-gray-600 text-black"
          readOnly
        />
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="w-full bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] text-white py-2 rounded font-semibold"
        >
          {claiming ? "Claiming..." : "Claim Reward"}
        </button>
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Join our Telegram community to unlock claiming.</p>
              
              <div className="flex flex-wrap justify-center gap-2" onClick={()=>getCommunityList()}>
                <a
                  href="javascript:void(0)"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#110E05] to-[#362A02] text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 border border-[#D2A100]/30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.20-.07-.06-.17-.04-.24-.02-.10.02-1.79 1.14-5.06 3.34-.48.33-.92.49-1.31.48-.43-.01-1.27-.24-1.89-.44-.76-.24-1.36-.37-1.31-.78.03-.24.37-.48 1.03-.74 4.05-1.66 6.77-2.76 8.14-3.31 3.92-1.61 4.73-1.89 5.26-1.9.12 0 .38.03.55.18.14.13.18.30.20.42.02.12.02.38.01.52z"/>
                  </svg>
                  <span>{isFetch?"Loading...":"Join Community"}</span>
                </a>

              </div>
            </div>
          </div>

      </Modal>

      <Modal
    isOpen={isCommunityModalOpen}
    onClose={() => setIsCommunityModalOpen(false)}
    >
    <h2 className="text-lg font-bold mb-4 text-center">
    Join Telegram Communities
    </h2>

    <div className="space-y-3">
    {groupList.map((group: any) => (
      <div
        key={group.groupId}
        className="flex items-center justify-between p-3 rounded-lg border border-[#362A02] bg-[#110E05]"
      >
        <div>
          <p className="text-sm font-semibold text-[#FFFEEF]">
            {group.groupName}
          </p>
          <a
            href={group.groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#D2A100] hover:underline break-all"
          >
            {group.groupLink}
          </a>
        </div>

        <div className="ml-3">
          {group.isJoined ? (
            <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">
              Joined
            </span>
          ) : (
            <a
              href={group.groupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] text-white hover:opacity-90"
            >
              Join
            </a>
          )}
        </div>
      </div>
    ))}

    {groupList.length === 0 && (
      <p className="text-center text-sm text-gray-400">
        No communities found
      </p>
    )}
    </div>

    <div className="mt-5 flex justify-center">
    <button
      onClick={() => setIsCommunityModalOpen(false)}
      className="px-6 py-2 rounded-lg border border-[#D2A100] bg-gradient-to-r from-[#110E05] to-[#362A02] text-white"
    >
      Close
    </button>
    </div>
    </Modal>
<Modal
  isOpen={isRequirementModalOpen}
  onClose={() => closeRequirementModal()}
>
  {/* HEADER */}
  <div className="text-center border-b border-[#362A02] pb-3 mb-4">
    <h2 className="text-lg font-bold text-[#D2A100]">
      My reward requirements
    </h2>
  </div>

  {/* ---------------- Communities ---------------- */}
  <div className="mb-6">
    <h3 className="text-sm font-semibold mb-3 text-[#FFFEEF]">
      Telegram Communities
    </h3>

    <div className="space-y-3">
      {requirements1 &&
        requirements1.communities.length > 0 &&
        requirements1.communities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#110E05] border border-[#362A02]"
          >
            <span className="text-sm text-[#FFFEEF]">
              {item.groupName}
            </span>

            <a
              href={item.groupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-1.5 rounded-full bg-gradient-to-r from-[#110E05] to-[#362A02] border border-[#D2A100] text-white hover:opacity-90 transition"
            >
              Join
            </a>
          </div>
        ))}

      <p className="text-xs text-[#FFFEEF99] text-center mt-2">
        Join our Telegram communities to qualify for claiming $TIDY and getting XP rewards.
      </p>

      {requirements1.communities.length === 0 && (
        <p className="text-xs text-gray-400 text-center">
          No community requirement
        </p>
      )}
    </div>
  </div>

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
