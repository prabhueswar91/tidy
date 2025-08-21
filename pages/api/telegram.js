export default async function handler(req, res) {
  const message = req.body?.message;

  if (message?.text === "/start") {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: "👋 Welcome! I’m your Next.js Telegram bot.",
        }),
      }
    );
  }

  res.status(200).json({ ok: true });
}
