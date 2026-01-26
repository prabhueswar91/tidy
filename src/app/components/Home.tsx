"use client";

import { useState,useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion"; 
import BgCard from "../assets/card-1.png";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTelegram } from "../context/TelegramContext";
import Button from "./ui/Button";
import Logo from "../assets/Logo.png";
import SmallLogo from "../assets/wizards.svg";
import Star from "../assets/star.svg";
import JunglLogo from "../assets/jungl.webp";
import toast from "react-hot-toast";
import TidyLoader from "./TidyLoader";

interface HomeProps {
  onStart: () => void;
}

interface Partner {
  id: number;
  logo: string | null;
  url: string | null;
  groupName?: string;
}

export default function Home({ onStart }: HomeProps) {

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setshowUpgrade] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);

  const { telegramId } = useTelegram();
  
  // const telegramId = 6195798875;
  const router = useRouter();
  const channelId = searchParams.get("channel_id");
  const upgrade = searchParams.get("upgrade");
  const start = searchParams.get("start");
  console.log(start,'startstartstart')
  if(upgrade=="true"){
    onStart();
  }

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get(
          `https://tidyzen.tidyonchain.com/api/public/partner/approved-list`
        );
        if (res.data.success) {
          setPartners(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching partners:", err);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    console.log(telegramId,'telegramIdtelegramId')
    if(telegramId){
      checkBoosterService()
    }
    
  }, [telegramId]);

  async function checkBoosterService() {
    const res = await axiosInstance.post("/reward/check-booster-service",{channel_id:channelId,telegramId});
    if(res?.data?.isAdmin){
      setshowUpgrade(true)
    }
  }


  async function navPartner(){
     console.log(channelId,telegramId,"navPartner")
    if(!telegramId) {
      toast.error("Telegram ID not found");
      console.log("id not found")
      return;
    }
    const res = await axiosInstance.post("/reward/check-partner",{channel_id:channelId,telegramId});
    const approved = res?.data?.approved ? "true" : "false";
    const isGroup = res?.data?.isGroup ?? false;

    if(isGroup){
      router.push(`/partner?channel_id=${channelId}&approved=${approved}`);
    } else {
      router.push(channelId ? `/partner?channel_id=${channelId}` : `/partner`);
    }
  }

  if(loading) {
    return <TidyLoader />
  }

  async function navService(){
    console.log(channelId,telegramId,"navService")
    if(!telegramId || !showUpgrade) {
      toast.error("Please try again later");
      console.log("id not found")
      return;
    }
    router.push(`/booster-service?channel_id=${channelId}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, ease: "easeOut" }} 
      className="relative w-full max-w-lg min-h-screen flex flex-col justify-between items-center text-[#FFFEEF] overflow-hidden"
    >
      <Image src={BgCard} alt="Card background" fill className="object-cover -z-10" />

      {/* <div 
        className="absolute top-4 right-4 z-20 border border-white rounded-full p-2 cursor-pointer text-white text-2xl"
        onClick={() => router.push("/profile")}
      >
        <FiUser />
      </div> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10 flex flex-col items-center mt-5 w-full px-[25px]"
      >
        <div className="relative w-[15rem] h-[15rem] md:w-46 md:h-52">
          <Image src={Logo} alt="Logo" fill style={{ objectFit: "contain" }} />
        </div>

        <Button
          onClick={onStart}
          marginTop="mt-0"
          className="uppercase px-0 py-3 md:px-8 md:py-3 text-base font-medium bg-[linear-gradient(90deg,#242424_0%,#525252_100%)]"
          icon={<Image src={Star} alt="star" className="h-[24px]"/>}
        >
          START YOUR MOMENT
        </Button>
      </motion.div>

      <div>
        <div className="text-xl font-medium mb-3 uppercase font-dm text-center">Partners</div>

        <div className="flex justify-center items-center gap-[20px] flex-wrap">
          {partners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              className="relative w-20 h-16"
            >
              {partner.logo ? (
                <>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/partner_logos/${partner.logo}`}
                  alt={partner.groupName || "Partner Logo"}
                  fill
                  style={{ objectFit: "contain" }}
                />
                {!partner.groupName && <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/partner_logos/star.png`}
                  alt={"star"}
                  style={{ objectFit: "contain" }}
                  className="absolute top-[40px] left-[50px]"
                  height={24}
                  width={24}
                />}
                </>
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                  No Logo
                </div>
              )}
            </motion.a>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 w-full text-center mb-2"
      >

        <button
          className="inline-block text-[#FFFEEF] font-semibold text-base px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] font-dm underline"
          style={{
            fontSize: "16px",
            lineHeight: "170%",
            letterSpacing: "-0.03em",
          }}
          onClick={()=>navPartner()}
        >
          BECOME A PARTNER AND ACCESS OUR TELEGRAM BOOSTER SERVICE
        </button>
        {showUpgrade &&<button
          className="inline-block text-[#FFFEEF] font-semibold text-base px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] font-dm underline"
          style={{
            fontSize: "16px",
            lineHeight: "170%",
            letterSpacing: "-0.03em",
          }}
          onClick={()=>navService()}
        >
          BOOSTER SERVICE
        </button>}
        <div className="text-xs mt-4 font-open">Powered by JunglCorp & TidyCoin</div>
      </motion.div>
    </motion.div>
  );
}
