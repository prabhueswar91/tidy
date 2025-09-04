"use client";

import { useState,useEffect } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

import Header from "./Header";

import { TelegramUserData, UseTelegramUserResult,TelegramWebApp } from '../../../telegram';


interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
}

const initTelegramWebApp = (): Promise<TelegramWebApp | null> => {
  return new Promise((resolve) => {
    if (window.Telegram && window.Telegram.WebApp) {
      resolve(window.Telegram.WebApp);
      return;
    }

    const existingScript = document.querySelector('script[src*="telegram-web-app.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.Telegram && window.Telegram.WebApp) {
          resolve(window.Telegram.WebApp);
        } else {
          resolve(null);
        }
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.Telegram && window.Telegram.WebApp) {
          resolve(window.Telegram.WebApp);
        } else {
          resolve(null);
        }
      }, 100);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.head.appendChild(script);
  });
};

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<{
    name: string;
    price: string;
  } | null>(null);
  
  const [url, setUrl] = useState('http://t.me/Tidycoin_bot?start=0x209D0beeE1c4b795097924d22d4BAca427B393B0');
  const [text, setText] = useState('Check out this amazing article!');
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
   const [userData, setUserData] = useState<TelegramUserData | null>(null);
  const [isFromTelegram, setIsFromTelegram] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const openModal = (tier: { name: string; price: string }) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };


  useEffect(() => {
    const getTelegramData = async (): Promise<void> => {
      try {
        const tg = await initTelegramWebApp();
        
        if (tg) {
          setIsFromTelegram(true);
          tg.expand();
          console.log(tg.initDataUnsafe,'tg.initDataUnsafe>>>>>>>>>>>>....')
          const userInfo: TelegramUserData = {
            id: tg.initDataUnsafe.user?.id || null,
            firstName: tg.initDataUnsafe.user?.first_name || null,
            lastName: tg.initDataUnsafe.user?.last_name || null,
            username: tg.initDataUnsafe.user?.username || null,
            isPremium: tg.initDataUnsafe.user?.is_premium || null,
            languageCode: tg.initDataUnsafe.user?.language_code || null,
            queryId: tg.initDataUnsafe.query_id || null,
            platform: tg.platform || null,
            themeParams: tg.themeParams ? { ...tg.themeParams } : null,
            version: tg.version || null,
          };
          
          setUserData(userInfo);
        }
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getTelegramData();
  }, []);

  
useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const tgUserId = urlParams.get('tg_user_id');

      console.log(urlParams,'urlParamsurlParamsurlParams',tgUserId,urlParams.get('first_name'),urlParams.get('username'))
      
      
  }, []);



   const generateTelegramUrl = () => {
    const shareText = encodeURIComponent(text);
    const shareUrl = encodeURIComponent(url);
    return `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
  };

  // Function to handle the share action
  const handleShare = () => {
    window.open(generateTelegramUrl(), '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex min-h-screen items-center font-dm justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1e293b] px-6">
      
      <Header />
      
      <Card paddingY="py-16 md:py-20">
        <h1 className="text-white text-xl font-bold tracking-widest">
          TIDYCOIN
        </h1>
        <p className="mt-1 text-xl font-normal text-[#FFFEEF]">
          TidyZen Moments
        </p>

         <button
            onClick={() => handleShare()}
            className="w-full flex items-center font-dm justify-between rounded px-5 py-3 bg-[#EBB4574D] border border-[#EBB457] text-[#EBB457] font-semibold hover:opacity-90 transition"
          >Invite{userData?.firstName}
          </button>

          {user ? (
        <p>
          Hello {user.first_name} {user.last_name} (@{user.username})
        </p>
      ) : (
        <p>Loading user info...</p>
      )}

        <p className="mt-6 text-gray-300">Choose Today’s Zen Level</p>
        <div className="mb-10 mt-1 border-b-2 border-[#FFFEEF]/10"></div>

        <div className="space-y-3">
          <button
            onClick={() => openModal({ name: "Bronze", price: "FREE" })}
            className="w-full flex items-center font-dm justify-between rounded px-5 py-3 bg-[#AC8B8B4D] text-[#AC8B8B] font-semibold hover:opacity-90 transition border border-[#AC8B8B]"
          >
            <span className="uppercase tracking-widest">Bronze</span>
            <span className="text-sm">FREE</span>
          </button>

          <button
            onClick={() => openModal({ name: "Silver", price: "169 XP" })}
            className="w-full flex items-center font-dm justify-between rounded px-5 py-3 bg-[#9292924D] text-[#929292] font-semibold hover:opacity-90 transition border border-[#929292]"
          >
            <span className="uppercase tracking-widest">Silver</span>
            <span className="text-sm">169 XP</span>
          </button>

          <button
            onClick={() => openModal({ name: "Gold", price: "420 XP" })}
            className="w-full flex items-center font-dm justify-between rounded px-5 py-3 bg-[#EBB4574D] border border-[#EBB457] text-[#EBB457] font-semibold hover:opacity-90 transition"
          >
            <span className="uppercase tracking-widest">Gold</span>
            <span className="text-sm">420 XP</span>
          </button>
        </div>

        <Button>CONTINUE</Button>

        <p className="mt-3 text-xs text-gray-400">
          Your moments are a click away
        </p>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold my-6 text-center">
          Connect Wallet to Pay
        </h2>

        {selectedTier && (
          <div className="flex justify-between text-[#FFFEEF] items-center px-6">
            <h3 className="font-bold text-xl">Total</h3>
            <p className="font-semibold">
              <span className="text-sm font-normal">
                {selectedTier.name.toUpperCase()} TIER
              </span>{" "}
              <span className="text-xl">{selectedTier.price}</span>
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            borderColor="#EBB457"
            fromColor="#efefef"
            toColor="#797979"
            onClick={() => alert("Proceed to Payment")}
            className="w-30"
          >
            PAY NOW
          </Button>
        </div>
      </Modal>
    </div>
  );
}
