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

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [userdata, setUserData] = useState<any | null>(null);
  const [hash, setHash] = useState<string | null>(null);

 useEffect(() => {
  const tg = window?.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;
  const tgHash = tg?.initDataUnsafe?.hash;

  // ✅ FALLBACK: Telegram exists but user NOT available
  if (!tgUser) {
    console.warn("⚠️ Using STATIC telegramId (local testing)");

    setTelegramId("956672855");
    setUserData({
      id: 956672855,
      first_name: "Dev User",
      username: "dev_user",
    });
    setHash("static-dev-hash");
    return;
  }

  // ✅ REAL TELEGRAM MINI APP
  setTelegramId(tgUser.id.toString());
  setUserData(tgUser);
  setHash(tgHash || null);
}, []);


  return (
    <TelegramContext.Provider value={{ telegramId, userdata, hash }}>
      {children}
    </TelegramContext.Provider>
  );
};
