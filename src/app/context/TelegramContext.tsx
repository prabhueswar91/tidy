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

    let retries = 0;
    const maxRetries = 20;

    const checkTelegram = () => {

      if (window.Telegram?.WebApp) {

        const tg = window.Telegram.WebApp;

        tg.ready(); // VERY IMPORTANT

        const tgUser = tg.initDataUnsafe?.user;
        const tgHash = tg.initDataUnsafe?.hash;

        if (tgUser?.id) {

          console.log("Telegram user found:", tgUser);

          setTelegramId(tgUser.id.toString());
          setUserData(tgUser);
          setHash(tgHash ?? null);

          return;

        }

      }

      retries++;

      if (retries < maxRetries) {
        setTimeout(checkTelegram, 300);
      } else {
        console.warn("Telegram WebApp not available after retries");
      }

    };

    checkTelegram();

  }, []);

  return (
    <TelegramContext.Provider value={{ telegramId, userdata, hash }}>
      {children}
    </TelegramContext.Provider>
  );
};