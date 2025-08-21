import { NextRequest, NextResponse } from "next";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract Telegram update
    const message = body?.message;
    if (message?.text) {
      const chatId = message.chat.id;
      const reply = message.text.toLowerCase() === "hello"
        ? "Hey there! 👋 How are you?"
        : "👋 Welcome! Send 'hello' to test me.";

      // Send response back to Telegram
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: reply }),
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
