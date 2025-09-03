import type { NextApiRequest, NextApiResponse } from "next";

const token = process.env.TELEGRAM_BOT_TOKEN as string;
const TELEGRAM_URL = `https://api.telegram.org/bot${token}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("iiiiiiiiiiiiiiiiiiiii")
    const body = req.body;

    // Telegram message object
    if (body.message?.text) {
      const chatId = body.message.chat.id;
      const firstName = body.message.from?.first_name ?? "there";
      const text = body.message.text;

      // Reply back
      await fetch(`${TELEGRAM_URL}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text === "/start"
            ? `👋 Hello ${firstName}, welcome!`
            : `You said: ${text}`,
        }),
      });
    }

    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
