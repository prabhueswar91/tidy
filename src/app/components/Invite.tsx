"use client";
import { useTelegram } from "../context/TelegramContext";

export default function Invite() {
  const { telegramId } = useTelegram();

  const generateTelegramUrl = () => {
    const url = `http://t.me/${process.env.NEXT_PUBLIC_CHANNEL_NAME}?start=${telegramId}`
    const shareUrl = encodeURIComponent(url);
    return `https://t.me/share/url?url=${shareUrl}`;
  };

  const handleShare = () => {
    if (!telegramId) return
    window.open(generateTelegramUrl(), '_blank', 'width=600,height=400');
  };

  return (
    <>
    <div className="mt-6 text-center">
      <button
        onClick={() => handleShare()}
        className="w-full text-white-600 font-semibold text-base  px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-center"
        style={{
          fontFamily: "DM Sans",
          fontSize: "16px",
          lineHeight: "170%",
          letterSpacing: "-0.03em",
        }}
      >
       INVITE A FRIEND
      </button>
      <p className=" text-xs text-white-600">
        And earn extra Zen moments plus XP
      </p>
    </div>
    </>
  );
}
