import React from "react";
import { useState, useEffect } from "react";
import BgCard from "../assets/card-1.png";
import Search from "../assets/search.svg";
import Image from "next/image";
import Coin from "../assets/coin.png";
import Button from "./ui/Button";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import TidyLoader from "./TidyLoader";

export default function Account() {
  const { userInfo } = UserContext();

  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo?.id) return;

    const fetchPoints = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/points/user/${userInfo.id}/weekly`);
        setPoints(res.data);
      } catch (err) {
        console.error("Failed to fetch points", err);
      }
      setLoading(false);
    };

    fetchPoints();
  }, [userInfo]);

  return (
    <div className="relative bg-[#141318]/40 w-full min-h-screen flex justify-center text-[#FFFEEF] font-dm p-4 overflow-auto scrollbar-hide">
      <Image
        src={BgCard}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="relative w-full max-w-3xl flex flex-col items-center mx-auto space-y-4 mt-4">
        <div className="page-title text-xl font-bold">
          Account & Linked Wallets
        </div>

        <div className="w-full bg-[#14131899]/6 border-[1.5px] border-[#333333] rounded-md p-4">
          {loading ? (
            <div className="flex justify-center py-6">
              <TidyLoader />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {points?.avatar ? (
                    <Image
                      src={points.avatar}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full w-6 h-6"
                      unoptimized
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-400/40" />
                  )}

                  <span className="font-medium text-sm">
                    @{points?.username || "—"}
                  </span>
                </div>

                <p className="text-[#FFFEEF99] text-xs font-light">
                  IPSM{" "}
                  <span className="text-[#FFFEEF] font-medium text-sm">
                    {points?.total ?? 0}
                  </span>
                </p>
              </div>

              <div className="my-3 border-t border-[#333333]" />

              <div className="flex items-center justify-between">
                <p className="text-[#FFFEEF99] text-sm">Weekly</p>
                <p className="font-semibold">
                  <span className="text-[#FFFEEF99] font-light text-xs">
                    Weekly{" "}
                  </span>
                  +{points?.point ?? 0}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="w-full bg-[#14131899]/6 border-[1.5px] border-[#333333] rounded-lg p-4 space-y-4">
          {/* Search */}
          <div className="relative flex flex-col justify-center text-center px-4">
            <div className="flex items-center bg-[#9292924D] rounded-full px-4 py-1">
              <Image
                src={Search}
                alt="Search"
                width={20}
                height={20}
                className="mr-3"
              />
              <input
                type="text"
                placeholder="Search Wallets"
                className="bg-transparent outline-none w-full text-[#D3D3C6] placeholder:text-[#D3D3C6] placeholder:text-sm"
              />
            </div>
          </div>

          {/* BASE (EVM) */}
          <div className="flex flex-col gap-2">
            <label className="text-[#FFFEEF] text-sm font-medium">
              BASE (EVM)
            </label>

            <select className="bg-[#9292924D] border border-[#929292]/30 text-sm rounded-md px-3 py-2 text-[#FFFEEF99] outline-none focus:border-[#D2A100] focus:bg-[#0000004D]">
              <option value="" className="bg-[#929292] text-black">
                Select Wallet
              </option>
              <option value="wallet1" className="bg-[#929292] text-black">
                Wallet 1
              </option>
              <option value="wallet2" className="bg-[#929292] text-black">
                Wallet 2
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#FFFEEF] text-sm font-medium">SOLANA</label>
            <input
              type="text"
              placeholder="Enter wallet address"
              className="bg-[#9292924D] border border-[#929292]/30 rounded-md px-3 py-2 text-[#FFFEEF] placeholder:text-[#FFFEEF]/60 outline-none focus:border-[#D2A100] focus:bg-[#0000004D]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#FFFEEF] text-sm font-medium">BNB</label>
            <input
              type="text"
              placeholder="Enter wallet address"
              className=" bg-[#9292924D] border border-[#929292]/30 rounded-md px-3 py-2 text-[#FFFEEF] placeholder:text-[#FFFEEF]/60 outline-none focus:border-[#D2A100] focus:bg-[#0000004D]"
            />
          </div>
        </div>
        <div className="w-full mx-4">
          <Button
            borderColor="#D2A100"
            className="w-fulltext-[#FFFEEF] bg-gradient-to-r from-[#110E05] to-[#362A02] text-[16px] font-semibold px-4 !py-2"
            onClick={() => alert("Wallets linked!")}
          >
            SAVE WALLET
          </Button>
        </div>
      </div>
    </div>
  );
}
