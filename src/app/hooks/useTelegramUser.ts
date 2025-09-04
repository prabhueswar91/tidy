// hooks/useTelegramUser.ts
import { useState, useEffect } from 'react';
import { TelegramUserData, UseTelegramUserResult,TelegramWebApp } from '../../types/telegram1';

const initTelegramWebApp = (): Promise<TelegramWebApp | null> => {
  return new Promise((resolve) => {
    if (window.Telegram && window.Telegram.WebApp) {
      resolve(window.Telegram.WebApp);
      return;
    }

    const existingScript = document.querySelector('script[src*="telegram-web-app.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.Telegram && window.Telegram.WebApp) {
          resolve(window.Telegram.WebApp);
        } else {
          resolve(null);
        }
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        if (window.Telegram && window.Telegram.WebApp) {
          resolve(window.Telegram.WebApp);
        } else {
          resolve(null);
        }
      }, 100);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.head.appendChild(script);
  });
};

export const useTelegramUser = (): UseTelegramUserResult => {
  const [userData, setUserData] = useState<TelegramUserData | null>(null);
  const [isFromTelegram, setIsFromTelegram] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTelegramData = async (): Promise<void> => {
      try {
        const tg = await initTelegramWebApp();
        
        if (tg) {
          setIsFromTelegram(true);
          tg.expand();
          
          const userInfo: TelegramUserData = {
            id: tg.initDataUnsafe.user?.id || null,
            firstName: tg.initDataUnsafe.user?.first_name || null,
            lastName: tg.initDataUnsafe.user?.last_name || null,
            username: tg.initDataUnsafe.user?.username || null,
            isPremium: tg.initDataUnsafe.user?.is_premium || null,
            languageCode: tg.initDataUnsafe.user?.language_code || null,
            queryId: tg.initDataUnsafe.query_id || null,
            platform: tg.platform || null,
            themeParams: tg.themeParams ? { ...tg.themeParams } : null,
            version: tg.version || null,
          };
          
          setUserData(userInfo);
        }
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getTelegramData();
  }, []);

  return { userData, isFromTelegram, isLoading };
};