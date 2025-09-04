import TelegramBot from "node-telegram-bot-api";

declare global {
  // allow global._telegramBot to exist
  var _telegramBot: TelegramBot | undefined;
}

export {};
