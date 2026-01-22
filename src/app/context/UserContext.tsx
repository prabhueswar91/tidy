"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { useTelegram } from "../context/TelegramContext";

interface UserInfo {
  id: number;
  telegram_id: string | null;
  first_name: string | null;
  tier: string | null;
  silverPaid: boolean;
  goldPaid: boolean;
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

  // ✅ ONLY source of truth
  const { telegramId } = useTelegram();

  const getUserInfo = useCallback(async () => {
    console.log("👤 UserContext called");

    // ✅ Wait until telegramId is ready (static or real)
    if (!telegramId) {
      console.warn("⚠️ telegramId not ready yet");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/getUserIdByTelegram", {
        telegramId,
      });

      const data = res.data.userInfo;

      setUserInfo({
        id: data.id,
        telegram_id: data.telegram_id || telegramId,
        first_name: data.first_name || null,
        tier: data.tier || null,
        silverPaid: data.silverPaid ?? false,
        goldPaid: data.goldPaid ?? false,
        walletAddress: data.walletAddress || null,
      });

      console.log("✅ User Info loaded:", data);
    } catch (err) {
      console.error("❌ Failed to fetch user info:", err);
    }
  }, [telegramId]);

  useEffect(() => {
    if (!telegramId) return;

    getUserInfo();

    const timer = setTimeout(getUserInfo, 500);
    return () => clearTimeout(timer);
  }, [getUserInfo, telegramId]);

  return (
    <UserInfoContext.Provider value={{ userInfo, getUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};
