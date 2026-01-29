"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Header from "./Header";
import { useAppStore } from "../store/useAppStore";
import axiosInstance from "../utils/axiosInstance";
import TidyLoader from "./TidyLoader";
import Invite from "../components/Invite";
import { useTelegram } from "../context/TelegramContext";
import { UserContext } from "../context/UserContext";
import { useWallet } from "../hooks/useWallet";
import { User } from "lucide-react";
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

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
   const [baseAddress, setbaseAddress] = useState("");
  const router = useRouter();

  const {
      provider,
      isConnected
    } = useWallet();
  const { telegramId } = useTelegram();
  const { userInfo, getUserInfo } = UserContext();
  const searchParams = useSearchParams();
  const upgrade = searchParams.get("upgrade");
  const groupName = searchParams.get("group_name");
  const channel_id = searchParams.get("channel_id");
  const [disabled, setdisabled] = useState(channel_id?true:false);
  const [loader, setloader] = useState(false);

  const { selectedTier, setSelectedTier, walletAddress,amount } = useAppStore();
  const [isApproved, setisApproved] = useState(false);
  const [userTier, setuserTier] = useState("BRONZE");
  const [isGroupUser, setisGroupUser] = useState(false);


  useEffect(() => {
    if (telegramId) {
      try {
          checkPartner()
      } catch (err) {
        console.error("Failed to decrypt payload", err);
      }
    }
  }, [telegramId,isConnected]);

  useEffect(() => {
    if (upgrade=="true") {
      try {
          //upgradeNextPlan()
      } catch (err) {
        console.error("Failed to decrypt payload", err);
      }
    }
  }, [upgrade]);

  async function upgradeNextPlan(){
    try{
      console.log(userInfo,'userInfo900909')
      //handleTierSelect();
    }catch(err){
    }
    
  }

  async function checkPartner(){
    try{
      setLoading1(true);
      const res = await axiosInstance.post("/reward/check-partner",{channel_id:channel_id,telegramId});
      const status = res && res.data && res.data.approved?false:true;
      const currentTier=res && res.data && res.data.currentTier?res.data.currentTier:"BRONZE";
      setuserTier(currentTier);
      setdisabled(status);
      setisApproved(res.data.approved);
      setisGroupUser(res.data.isGroup);
      setLoading1(false);
    }catch(err){
      setLoading1(false);
    }
    
  }

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/tiers");
        setTiers(res.data.data);
        const currentTier =userInfo?.tier;
        if(currentTier !="GOLD" && upgrade=="true"){
          let nextTier = currentTier=="BRONZE"?"SILVER":"GOLD";
          let index = res.data.data.findIndex((val:any)=>val.name==nextTier);
          if(index !=-1){
              handleTierSelect(res.data.data[index]);
          }
        }
        
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
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

useEffect(() => {
  const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;

  if (tgUser?.photo_url) {
    setPhotoUrl(tgUser.photo_url);
  } else if (process.env.NODE_ENV === "development") {
    setPhotoUrl("https://i.pravatar.cc/150?img=3"); // DEV mock
  } else {
    setPhotoUrl(null);
  }
}, []);



const handleProfileClick = () => {
        router.push('/settings');
    };
  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier.name, tier.amount);
    console.log(userInfo,'userInfo>>>>>>>>>>>>>>')
    if((userInfo?.silverPaid && tier.name.toUpperCase() === "SILVER") || (userInfo?.goldPaid && tier.name.toUpperCase() === "GOLD")){
      return;
    }

    if (
      tier.name.toUpperCase() === "SILVER" ||
      tier.name.toUpperCase() === "GOLD"
    ) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

 async function handleContinue(){
    setloader(true)
    if (!selectedTier) {
      toast.error("Please select a tier first!", {
        id: "123",
        duration: 3000,
      });
      setloader(false)
      return;
    }
    
    if(!baseAddress){
      toast.error("Please update your wallet and continue");
      setloader(false)
      router.push(`/settings`);
      return
    }

    // if(isApproved || userTier=="GOLD" || selectedTier.toUpperCase() === userTier || selectedTier.toUpperCase() === "BRONZE"){
    //   router.push("/Tier");
    //   setloader(false)
    //   return;
    // }

    if((userInfo?.silverPaid && selectedTier.toUpperCase() === "SILVER") || (userInfo?.goldPaid && selectedTier.toUpperCase() === "GOLD") || selectedTier.toUpperCase() === "BRONZE"){
      router.push("/Tier");
      setloader(false)
      return;
    }

    if (!walletAddress) {
      setIsModalOpen(true);
      setloader(false)
      return;
    }

    try {

        const { data } = await axiosInstance.post("/auth/nonce", {
          address: walletAddress,
          telegram: telegramId,
          tier: selectedTier
        });
        const nonce = data.nonce;
        const isPay = data.isPay;
        if (!provider) {
          throw new Error("No provider found");
        }

        if (isPay) {
          setIsModalOpen(true);
          setloader(false)
          return;
        }

        const signer = await provider.getSigner();
        let signmessage = `Sign this message to log in: ${nonce}.`
        if(isPay){
          signmessage = `Sign this message to log in: ${nonce}. I confirm the deduction of ${amount} XP from my account to proceed with this purchase.`
          
        }

        const signature = await signer.signMessage(signmessage);
        
        const verifyRes = await axiosInstance.post("/auth/verify", {
          address: walletAddress,
          signature,
          tier: selectedTier,
          amount,
          telegram: telegramId,
          initData:window?.Telegram?.WebApp?.initData
          //telegram: 6195798879,
        });

        const { token,message } = verifyRes.data;
        if (token) {
          localStorage.setItem("token", token);
           getUserInfo()
          console.log("✅ Signed in successfully:", { selectedTier, amount });
          if(message=="Verified, XP deducted, and tier updated"){
            toast.success(`Successfully purchased the ${selectedTier?.toUpperCase()} package.`, {
                id: "123",
                duration: 3000,
                icon: '✅'
            });
          }
          if(message.includes("Already verified in same tier")||message.includes("Verified, XP deducted, and tier updated")){
            router.push("/Tier");
          } else {  
            setloader(false)
          }

         
          
        }else{
         // logout()
          toast.error("Insufficient XP balance.", {
              id: "123",
              duration: 5000,
              icon: '❌'
          })
          setloader(false)
        }
      }catch (error: unknown) {
          console.error("❌ Error caught:", error);

          let message = "Please try again later.";

          if (error instanceof Error) {
            const errMsg = error.message.toLowerCase();

            if (errMsg.includes("user rejected") || errMsg.includes("connection rejected")) {
              message = "Connection rejected";
            } else if (errMsg.includes("xp deduct") || errMsg.includes("xp balance")) {
              message = "Insufficient XP balance.";
            }
          }

          if (isApiError(error) && error.response?.data?.error === "XP deduct failed") {
            message = "Insufficient XP balance.";
          }

          toast.error(message, {
            id: "123",
            duration: 5000,
            icon: "❌",
          });

          setloader(false)

          //logout();
      }
  }

  function isApiError(err: unknown): err is ApiError {
    return typeof err === "object" && err !== null && "response" in err;
  }

  useEffect(() => {
    if (!userInfo?.walletAddress) return;
    setbaseAddress(userInfo?.walletAddress)
  }, [userInfo]);

  if (loading || loading1) {
    return <TidyLoader />;
  }

  return (
    <div className="flex min-h-screen items-center font-dm justify-center text-[#FFFEEF] bg-gradient-to-b from-[#0a0a0a] to-[#1e293b]">
      <Card>
        <div className="flex justify-center items-center mt-4 mb-4">
     {/* <button
                    type="button"
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#EBB457] to-[#efefef] text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={handleProfileClick}
                >
                    <User size={20} strokeWidth={2.5} />
                </button> */}
               <button
  type="button"
  onClick={handleProfileClick}
  className="flex items-center justify-center 
             w-12 h-12 rounded-full overflow-hidden
             bg-gradient-to-br from-[#EBB457] to-[#efefef]
             shadow-md hover:shadow-lg transition-all duration-200"
>
  {photoUrl ? (
    <img
      src={photoUrl}
      alt="Telegram Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <User size={18} strokeWidth={2.5} />
  )}
</button>

  </div>
        <h1 className="text-center font-dt font-[900] uppercase tracking-[0.1em] text-2xl mt-[1rem]">
          TIDYCOIN
        </h1>

        {/* Subtitle */}
        <p className="font-open font-[400] text-[32px] leading-[170%] text-[#FFFEEF] ">
          TidyZen Moments
        </p>

        {/* Section Label */}
        <p className="mt-10 text-center font-dm text-[20px] font-medium tracking-[-0.03em] text-[#FFFEEF] ">
          Choose today&apos;s zen level
        </p>
        <div className="mb-10 mt-1 border-b-2 border-[#FFFEEF]/10"></div>

        <div className="space-y-3">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => handleTierSelect(tier)}
              className={`w-full flex items-center justify-between rounded px-5 py-3 font-semibold transition border 
                ${selectedTier === tier.name
                  ? "ring-2 ring-yellow-400 bg-opacity-70"
                  : ""
                } 
                hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed
         disabled:backdrop-blur-sm`}
              style={{
                backgroundColor: tier.bgColor,
                color: tier.color,
                borderColor: tier.color,
              }}
              //disabled={tier.amount > 0 ? disabled : false}
              disabled={!isApproved && isGroupUser && tier.name!="BRONZE"?true:false}
              id="testttttt"
            >
              <span className="uppercase tracking-widest font-medium">{tier.name}</span>
              <span className="text-sm">
                {tier.amount > 0 ? `${tier.amount} XP` : "FREE"}
              </span>
            </button>
          ))}
        </div>

        <Button onClick={handleContinue} disabled={loader} className="mt-[5rem] bg-[linear-gradient(90deg,#242424_0%,#525252_100%)]">{loader?"Processing...":"CONTINUE"}</Button>
        <p className="mt-3 text-sm font-dm text-[#FFFEEF]-500" id="test">
          Your moments are a click away
        </p>
        <Invite />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="text-base font-dm font-[500] my-6 text-center uppercase">
            Connect Wallet to Pay
          </div>

          {selectedTier && (
            <div className="flex justify-between font-dm text-[#FFFEEF] items-center px-0">
              <div className="font-bold font-dm text-xl">Total</div>
              <div className="font-semibold ">
                <span className="text-xs font-medium text-[#929292]">
                  {selectedTier.toUpperCase()} TIER <span className="text-[#FFFEEF] text-base font-semibold">{tiers.find(t=>t.name===selectedTier)?.amount} XP</span>
                </span>
              </div>
            </div>
          )}

          <Header setIsModalOpen={setIsModalOpen} checkPartner={checkPartner} />
        </div>
      </Modal>
    </div>
  );
}
