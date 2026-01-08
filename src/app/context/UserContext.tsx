"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../utils/axiosInstance";

interface UserInfo {
  id: number,
  telegram_id: string | null;
  first_name: string | null;
  tier: string | null;
  silverPaid: boolean | false;
  goldPaid: boolean | false;
  walletAddress: string | null;
}


interface UserInfoContextType {
  userInfo: UserInfo | null;
  getUserInfo: () => Promise<void>;
}


const UserInfoContext = createContext<UserInfoContextType>({
  userInfo: null,
  getUserInfo: async () => {},
});

export const UserContext = () => useContext(UserInfoContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  
  const getUserInfo = useCallback(async () => {
    console.log("context called");

    // if (typeof window === "undefined" || !window.Telegram?.WebApp) {
    //   console.warn("⚠️ Telegram WebApp not found");
    //   return;
    // }

    // const tgUser = window?.Telegram?.WebApp.initDataUnsafe?.user;
    
    // if (!tgUser || !tgUser.id) {
    //   console.warn("⚠️ Telegram WebApp exists, but user not ready yet");
    //   return;
    // }

    try {
      const res = await axiosInstance.post("/auth/getUserIdByTelegram", {
       //telegramId: tgUser.id,
       telegramId: "956672855",
      });

      const data = res.data.userInfo;

      setUserInfo({
        id: data.id,
        telegram_id: "956672855",
        first_name: "Prabhu",
        tier: data.tier || null,
        silverPaid: data.silverPaid || false,
        goldPaid: data.goldPaid || false,
        walletAddress: data.walletAddress || "",
      });

      console.log("✅ User Info:", data);
    } catch (err) {
      console.error("❌ Failed to fetch user info:", err);
    }
  }, []);

  
  useEffect(() => {
    getUserInfo();
    const timer = setTimeout(getUserInfo, 500);
    return () => clearTimeout(timer);
  }, [getUserInfo]);

  return (
    <UserInfoContext.Provider value={{ userInfo, getUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};
