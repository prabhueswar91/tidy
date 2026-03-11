"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
  telegramId: string | null;
  userdata: any | null;
  hash: string | null;
}

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
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();

        const tgUser = tg.initDataUnsafe?.user;
        const tgHash = tg.initDataUnsafe?.hash;

        if (tgUser?.id && tgHash) {
          setTelegramId(tgUser.id.toString());
          setUserData(tgUser);
          setHash(tgHash);
          return true;
        }
      }

      return false;
    };

    const isTelegram = getTelegramUser();

    // 🔹 DEV fallback for localhost
    if (!isTelegram && process.env.NODE_ENV === "development") {
      console.log("Using static Telegram ID for development");
      setTelegramId(STATIC_TELEGRAM_ID);
      setUserData({ id: STATIC_TELEGRAM_ID });
    }

  }, []);

  return (
    <TelegramContext.Provider value={{ telegramId, userdata, hash }}>
      {children}
    </TelegramContext.Provider>
  );
};