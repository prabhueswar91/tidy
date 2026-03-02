"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
  telegramId: string | null;
  userdata: any | null;
  hash: string | null;
}

// 🔹 Static Telegram ID (DEV ONLY)
const STATIC_TELEGRAM_ID = "956672855";

const TelegramContext = createContext<TelegramContextType>({
  telegramId: null,
  userdata: null,
  hash: null,
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [userdata, setUserData] = useState<any | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const getTelegramUser = () => {
      // ✅ Telegram WebApp available
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        const tgUser = tg.initDataUnsafe?.user;
        const tgHash = tg.initDataUnsafe?.hash;

        if (tgUser?.id && tgHash) {
          setTelegramId(tgUser.id.toString());
          setUserData(tgUser);
          setHash(tgHash);
          return;
        }
      }

      // ⚠️ DEV fallback only
      // if (process.env.NODE_ENV !== "production") {
      //   console.warn("⚠️ Using static Telegram ID (DEV mode)");
      //   setTelegramId(STATIC_TELEGRAM_ID);
      //   setUserData(null);
      //   setHash(null);
      // }
      if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ DEV MODE: Using static Telegram user");

      setTelegramId(STATIC_TELEGRAM_ID);
      setUserData({
        id: STATIC_TELEGRAM_ID,
        first_name: "Sandeep",
        username: "dev_user",
      });
      setHash("dev_static_hash");
      return;
    }
    };

    getTelegramUser();

    // 🔁 Retry once (Telegram init delay fix)
    const timer = setTimeout(getTelegramUser, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TelegramContext.Provider value={{ telegramId, userdata, hash }}>
      {children}
    </TelegramContext.Provider>
  );
};
