"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { useTelegram } from "./TelegramContext"; // 👈 IMPORTANT
import {encryptData} from "../rewards/auth2/encrypt"

/* ================= TYPES ================= */

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

/* ================= CONTEXT ================= */

const UserInfoContext = createContext<UserInfoContextType>({
  userInfo: null,
  getUserInfo: async () => {},
});

export const UserContext = () => useContext(UserInfoContext);

/* ================= PROVIDER ================= */

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // ✅ SINGLE SOURCE OF TRUTH
  const { telegramId, userdata } = useTelegram();

  const getUserInfo = useCallback(async () => {
    console.log("🔄 User context called, telegramId:", telegramId);

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
        first_name: data.first_name || userdata?.first_name || null,
        tier: data.tier || null,
        silverPaid: data.silverPaid ?? false,
        goldPaid: data.goldPaid ?? false,
        walletAddress: data.walletAddress || null,
      });

      console.log("✅ User Info loaded:", data);

      // Claim old user XP bonuses on app open
      if (telegramId) {
        let a = encryptData({
          telegramId: telegramId,
          initData:window?.Telegram?.WebApp?.initData
        })
        axiosInstance
          .post("/reward/claim-old-xp", {data:a})
          .then((claimRes) => {
            console.log("✅ claim-old-xp result:", claimRes.data);
          })
          .catch((claimErr) => {
            console.error("⚠️ claim-old-xp failed:", claimErr);
          });
      }
    } catch (err) {
      console.error("❌ Failed to fetch user info:", err);
    }
  }, [telegramId, userdata]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <UserInfoContext.Provider value={{ userInfo, getUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};
