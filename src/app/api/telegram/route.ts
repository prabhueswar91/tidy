import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
console.log("888888888888888888888888888888888A",message)
    if (!message) {
      console.log("888888888888888888888888888888888B")
      return NextResponse.json({ ok: true }); // nothing to handle
    }
    let textmsg = message.text;
    try{
      const parts = message.text.split(" "); 
      const ref = parts[1] || null;
      textmsg = parts[0];
      console.log(ref,'888888888888888888888888888888888C')
    }catch(err){

    }

    const chatId = message.chat.id;

    // ✅ 1. Handle WebApp Data coming from your React UI
    if (message.web_app_data) {
      try {
        const data = JSON.parse(message.web_app_data.data);

        await fetch(
          `https://api.telegram.org/bot8461678708:AAGhiwbHmRBPbs4RG9P7-2hSESwTk4iWdaI/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `✅ Received Enso Moment!\nAction: ${data.action}\nDuration: ${data.duration} sec`,
            }),
          }
        );
      } catch (e) {
        console.error("Invalid WebApp data:", e);
      }
    }

    // ✅ 2. Handle /start (send button with WebApp)
    else if (textmsg === "/start") {
      await fetch(
        `https://api.telegram.org/bot8461678708:AAGhiwbHmRBPbs4RG9P7-2hSESwTk4iWdaI/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🚀 Welcome to TidyZen!\nTap below to start your Zen moment.",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "🌀 Open TidyZen",
                    web_app: {
                      url: "https://tidy-mocha.vercel.app", // 👈 replace with your deployed Vercel app
                    },
                  },
                ],
              ],
            },
          }),
        }
      );
    }

    // ✅ 3. Handle normal text messages
    else if (message.text) {
      const reply =
        message.text.toLowerCase() === "hello"
          ? "Hey there! 👋 How are you?"
          : message.text.toLowerCase() === "welcome"
          ? "Welcome to TidyZen"
          : "👋 Send 'hello' to test me or use /start to open TidyZen UI.";

      await fetch(
        `https://api.telegram.org/bot8461678708:AAGhiwbHmRBPbs4RG9P7-2hSESwTk4iWdaI/sendMessage`,
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
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}