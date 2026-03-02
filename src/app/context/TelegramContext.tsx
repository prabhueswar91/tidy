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

  if (!getTelegramUser()) {
    const t1 = setTimeout(getTelegramUser, 500);
    const t2 = setTimeout(getTelegramUser, 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }
}, []);

  return (
    <TelegramContext.Provider value={{ telegramId, userdata, hash }}>
      {children}
    </TelegramContext.Provider>
  );
};
