"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
  telegramId: string | null;
  userdata: any | null;
  hash: string | null;
}

const TelegramContext = createContext<TelegramContextType>({
  telegramId: null,
  userdata: null,
  hash: null,
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [userdata, setUserData] = useState<any | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const getTelegramUser = () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        const tgUser = tg.initDataUnsafe?.user;
        const tgHash = tg.initDataUnsafe?.hash;

        if (tgUser && tgHash) {
          setTelegramId(tgUser.id.toString());
          setUserData(tgUser);
          setHash(tgHash);
        } else {
          console.warn("⚠️ Telegram WebApp exists, but user or hash not ready yet");
        }
      } else {
        console.warn("⚠️ Telegram WebApp not found");
      }
    };

    getTelegramUser();
    const timer = setTimeout(getTelegramUser, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TelegramContext.Provider value={{ telegramId, userdata, hash }}>
      {children}
    </TelegramContext.Provider>
  );
};
