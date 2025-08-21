"use client";
import { useState } from "react";

export default function Home() {
  const [ensoDuration, setEnsoDuration] = useState(4.2);

  return (
    <main className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">✨ TidyZen</h1>

      {/* Jungl XP options */}
      <div className="mb-4">
        <h2 className="text-xl">Spend Jungl XP</h2>
        <button className="m-2 p-2 bg-gray-200 rounded">169 XP – Silver</button>
        <button className="m-2 p-2 bg-yellow-300 rounded">420 XP – Gold</button>
      </div>

      {/* Stake TIDY */}
      <a
        href="https://your-staking-page.com"
        target="_blank"
        className="p-2 bg-green-500 text-white rounded mb-4"
      >
        Stake $TIDY for XP
      </a>

      {/* Slider for Enso duration */}
      <div className="mb-4">
        <label className="block">Enso Duration: {ensoDuration}s</label>
        <input
          type="range"
          min="4.2"
          max="42"
          step="0.1"
          value={ensoDuration}
          onChange={(e) => setEnsoDuration(Number(e.target.value))}
        />
      </div>

      {/* Begin Button */}
      <button className="p-3 bg-blue-500 text-white rounded">
        Begin TidyZen Moment
      </button>
    </main>
  );
}
