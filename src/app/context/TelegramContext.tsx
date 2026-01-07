"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
  telegramId: string | null;
}

const TelegramContext = createContext<TelegramContextType>({
  telegramId: null,
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telegramId, setTelegramId] = useState<string | null>(null);

  useEffect(() => {
    const getTelegramUser = () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (tgUser) {
          setTelegramId(tgUser.id.toString());
        } else {
          console.warn("⚠️ Telegram WebApp exists, but user not ready yet");
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
    <TelegramContext.Provider value={{ telegramId }}>
      {children}
    </TelegramContext.Provider>
  );
};
