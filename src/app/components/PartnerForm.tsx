"use client";

import { useState,useEffect } from "react";
import Card2 from "../components/ui/Card2";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import Logo from "../assets/logo.svg";
import Button from "../components/ui/Button";
import { useTelegram } from "../context/TelegramContext";
import usePartnerStore from "../store/partnerStore";
import axios from "axios";
import Dot from "../assets/dot.svg";
import { useRouter } from "next/navigation";
import TidyLoader from "./TidyLoader";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import ApprovalStatus from "../components/approvalStatus";

export default function TokenForm() {
  const router = useRouter();
  const { telegramId } = useTelegram();
  const tokenEnabled = usePartnerStore((state) => state.tokenEnabled);
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const approved = searchParams.get("approved");
  const group_name = searchParams.get("group_name");
  const channel_id = searchParams.get("channel_id");
  //const channel_id = -4976454003;

  
  const [selectedUsage, setSelectedUsage] = useState("1month");
  const [projectHandle, setProjectHandle] = useState("");
  const [baseToken, setBaseToken] = useState("");
  const [contactHandle, setContactHandle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showApprove, setshowApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [featured, setFeatured] = useState<"yes" | "no">("no");

  useEffect(() => {
      fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const { data:response } = await axiosInstance.post("/public/partner/check-approve-status",{telegramId});
      if (response.isList) {
          setSubmitted(true);
          setshowApprove(response.isApprove);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async () => {
    if (!telegramId) return;

    
    if (!projectHandle.trim()) {
      toast.error("Please enter your project telegram handle!");
      return;
    }

    if (baseToken) {
      if (!ethers.isAddress(baseToken)) {
        toast.error("Please enter a valid token contract address!");
        return;
      } 
    }

    if (!contactHandle.trim()) {
      toast.error("Please enter your contact telegram handle!");
      return;
    }

    if (!websiteUrl.trim() || !websiteUrl.startsWith("http")) {
      toast.error("Please enter a valid Website URL!");
      return;
    }

    if (!logoFile) {
      toast.error("Please upload a project logo (PNG or JPG)!");
      return;
    }

    setLoading1(true);
    try {
      const formData = new FormData();
      formData.append("project", projectHandle);
      formData.append("telegramId", telegramId);
      formData.append("channelId", channel_id || "");
      formData.append("tokenAddress", baseToken);
      formData.append("contact", contactHandle);
      formData.append("duration", selectedUsage);
      formData.append("url", websiteUrl);
      formData.append("logo", logoFile);
      formData.append("data", decodeURIComponent(data || ""));
      formData.append("featured", featured);

      const {data:response} = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/public/partner`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Partner created:", response);
      let pId = response?.data.id;
      //toast.success("Application submitted successfully!");
      router.push(`/booster-service?id=${pId}`);
    } catch (error) {
      console.error("❌ Error creating partner:", error);
      toast.error("Failed to submit. Please try again!");
    } finally {
      setLoading1(false);
    }
};


  const handleReset = () => {
    if(group_name){
      router.push(`/?group_name=${group_name}&approved=${approved}`);
    }else{
       router.push(`/`);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] font-dm text-[#FFFEEF] md:px-4">
      {loading ? (
        <TidyLoader />
      ) : (
        <Card2>
          <div className="w-full flex flex-col items-center">
            <div className="relative w-36 h-36 mb-1">
              <Image
                src={Logo}
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className="mb-1 text-[#FFFEEF]">
              {submitted
                ? "Status of your application"
                : "BECOME A PARTNER"}
            </div>

            <div className="relative w-full max-w-sm h-full max-h-[120vh] flex flex-col justify-center">
              {/* {!submitted && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 
                    px-4 py-2 rounded-full text-[10px] font-dm font-[600] 
                    shadow-md uppercase z-20
                    ${
                      tokenEnabled
                        ? "bg-[#0F6372] border border-[#0F6372] text-[#77EBFF] -top-[0.3rem] xs:-top-1 sm:top-0"
                        : "bg-[#514E06] border border-[#514E06] text-[#FFFA77] -top-0"
                    }`}
                >
                  {tokenEnabled ? "WITH TOKEN" : "WITHOUT TOKEN"}
                </div>
              )} */}

              <div className="bg-[#141318cc] border border-[#333333] rounded px-6 py-8 shadow-[0_4px_30px_rgba(0,0,0,0.9)] flex flex-col gap-6 overflow-y-auto text-center">
                {!submitted ? (
                  <>
                    <label className="flex flex-col text-sm font-light text-[#FFFEEF] text-left">
                      Enter your project telegram handle
                      <input
                        type="text"
                        value={projectHandle}
                        onChange={(e) => setProjectHandle(e.target.value)}
                        className="mt-1 p-2 rounded bg-[#1a1a1a] border border-[#333] text-[#FFFEEF] placeholder:text-[#888]"
                        placeholder="@yourproject"
                      />
                    </label>

                   
                    <label className="flex flex-col text-sm font-light text-[#FFFEEF] text-left">
                      Enter your Token or NFT address
                      <input
                        type="text"
                        value={baseToken}
                        onChange={(e) => setBaseToken(e.target.value)}
                        className="mt-1 p-2 rounded bg-[#1a1a1a] border border-[#333] text-[#FFFEEF] placeholder:text-[#888]"
                        placeholder="0x..."
                      />
                    </label>
                    

                    {/* <div className="flex flex-col gap-2 my-3 text-left">
                      <span className="text-sm font-light text-[#FFFEEF]">
                        Select usage duration
                      </span>
                      <div className="flex items-center gap-4 flex-wrap">
                        {["1month", "3month", "6month"].map((month) => (
                          <label
                            key={month}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-yellow-400 flex-shrink-0"
                              checked={selectedUsage === month}
                              onChange={() => setSelectedUsage(month)}
                            />
                            <span className="text-sm text-[#FFFEEF] font-light">
                              {month === "1month"
                                ? "1 Month"
                                : month === "3month"
                                ? "3 Months"
                                : "6 Months"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div> */}
                    <div className="flex flex-col gap-3 text-left mt-4">
                      <span className="text-sm font-light text-[#FFFEEF]">
                        Contribute $100 in your native token to be featured in our leaderboard competitions and get your logo on our front page
                      </span>

                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="featured"
                            value="yes"
                            checked={featured === "yes"}
                            onChange={() => setFeatured("yes")}
                            className="accent-yellow-400"
                          />
                          <span className="text-sm font-light">Yes</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="featured"
                            value="no"
                            checked={featured === "no"}
                            onChange={() => setFeatured("no")}
                            className="accent-yellow-400"
                          />
                          <span className="text-sm font-light">No</span>
                        </label>
                      </div>
                    </div>

                    <label className="flex flex-col text-sm font-light text-[#FFFEEF] text-left">
                      Enter your contact telegram handle
                      <input
                        type="text"
                        value={contactHandle}
                        onChange={(e) => setContactHandle(e.target.value)}
                        className="mt-1 p-2 rounded bg-[#1a1a1a] border border-[#333] text-[#FFFEEF] placeholder:text-[#888]"
                        placeholder="@yourcontact"
                      />
                    </label>
                    <p className="text-xs font-extralight text-[#FFFEEF] text-left">
                      This is how we will get in touch with you.
                    </p>

                <label className="flex flex-col text-sm font-light text-[#FFFEEF] text-left mt-3">
                  Enter your project website url
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="mt-1 p-2 rounded bg-[#1a1a1a] border border-[#333] text-[#FFFEEF] placeholder:text-[#888]"
                    placeholder="https://yourproject.com"
                  />
                </label>

                <label className="flex flex-col text-sm font-light text-[#FFFEEF] text-left mt-3">
                  Upload your project logo (PNG or JPG)
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 text-xs text-[#FFFEEF]"
                  />
                </label>

                  </>
                ) : (
                 <ApprovalStatus showApprove={showApprove}/>
                )
                }
              </div>

              <div className="w-full mt-4">
                {!submitted ? (
                  <Button onClick={handleSubmit} disabled={loading1} className="bg-[linear-gradient(90deg,#242424_0%,#525252_100%)]">
                    {loading1?"Processing":"CONTINUE TO OUR TELEGRAM BOOSTER SERVICE"}
                  </Button>
                ) : (
                  <Button onClick={handleReset}>START AGAIN</Button>
                )}
              </div>
            </div>
          </div>
        </Card2>
      )}
    </div>
  );
}
