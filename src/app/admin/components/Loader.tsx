"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-16 h-16 relative transform rotate-45 animate-spin-slow">
        <div className="absolute w-4 h-4 bg-gradient-to-r from-green-400 to-yellow-400 top-0 left-0 rounded-sm animate-bounce-delay1"></div>
        <div className="absolute w-4 h-4 bg-gradient-to-r from-green-400 to-yellow-400 top-0 right-0 rounded-sm animate-bounce-delay2"></div>
        <div className="absolute w-4 h-4 bg-gradient-to-r from-green-400 to-yellow-400 bottom-0 left-0 rounded-sm animate-bounce-delay3"></div>
        <div className="absolute w-4 h-4 bg-gradient-to-r from-green-400 to-yellow-400 bottom-0 right-0 rounded-sm animate-bounce-delay4"></div>
      </div>
    </div>
  );
}
