import type { NextApiRequest, NextApiResponse } from "next";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN as string;
let bot: TelegramBot;

if (!global._telegramBot) {
  bot = new TelegramBot(token, { polling: true });
  global._telegramBot = bot;

  bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name ?? "there";

  bot.sendMessage(chatId, `Hello ${firstName}, you said: ${msg.text}`);
});
} else {
  bot = global._telegramBot;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { chatId, message } = req.body;
    bot.sendMessage(chatId, message);
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
}
