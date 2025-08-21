// pages/api/telegram.js
import TelegramBot from "node-telegram-bot-api";

const token = "8265666505:AAHfXKdJWMRch9H5sgD6pl-Prc4rut9ZtCc";

// ✅ Create bot instance
const bot = new TelegramBot(token, { polling: true });

// ✅ Handle /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Welcome! I’m your Next.js Telegram bot.");
});

// ✅ Handle normal text messages
bot.on("message", (msg) => {
  if (msg.text.toLowerCase() === "hello") {
    bot.sendMessage(msg.chat.id, "Hey there! 👋 How are you?");
  }
});

export default function handler(req, res) {
  res.status(200).json({ success: true, message: "Telegram bot is running!" });
}
