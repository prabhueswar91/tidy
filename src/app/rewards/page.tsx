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

export default function PendingRewards() {
  const router = useRouter();
  const { getUserInfo,userInfo } = UserContext();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { setSelectedTier, setZenCode } = useAppStore();

  // Claim modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const { telegramId, userdata, hash } = useTelegram();
  
  // const telegramId = 6195798875;
  console.log(userInfo,'userInfouserInfo',userInfo?.walletAddress)
  useEffect(() => {
    async function fetchPending() {
      try {
        const res = await axiosInstance.post("/reward/pending", { telegramId });

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
  }, []);

  useEffect(() => {
    if(userInfo?.walletAddress){
        setWalletAddress(userInfo?.walletAddress)
    }
  }, [userInfo?.walletAddress]);

  if (loading) return <TidyLoader />;

  // Open claim modal
  const openClaimModal = (reward: any) => {
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

  return (
    <div className="relative bg-[#141318]/40 w-full min-h-screen flex justify-center text-[#FFFEEF] font-dm p-4 overflow-auto scrollbar-hide">
      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        priority
      />

      <div className="relative w-full max-w-3xl flex flex-col space-y-6">
        <button
          onClick={() => router.push("/")}
          className="self-end mb-2 bg-[#000] border border-[#D2A100] hover:bg-gradient-to-r hover:from-[#362A02] hover:to-[#110E05] text-[#FFFEEF] p-2 rounded-full text-sm flex items-center justify-center"
        >
          <Image src={Close} alt="close icon" className="w-4 h-4" />
        </button>

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
