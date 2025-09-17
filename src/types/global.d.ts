import TelegramBot from "node-telegram-bot-api";

declare global {
  // allow global._telegramBot to exist
  var _telegramBot: TelegramBot | undefined;

    interface Window {
    eruda?: {
      init: () => void;
      show: () => void;
      hide: () => void;
      destroy: () => void;
      [key: string]: unknown;
    };
  }

   interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export {};
