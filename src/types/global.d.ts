import TelegramBot from "node-telegram-bot-api";

declare global {
  // allow global._telegramBot to exist
  // (use `var` here so TS knows it's a global variable)
  // eslint-disable-next-line no-var
  var _telegramBot: TelegramBot | undefined;
}

export {};
