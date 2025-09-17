"use client";

import Link from "next/link";
import Image from "next/image";
import Logo1 from "../assets/logo1.jpg";

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#121212] text-white">
      <div className="text-center p-6 max-w-md">
        <Image
          src={Logo1}
          alt="TidyCoin Logo"
          width={200}
          height={200}
          className="mx-auto mb-6 rounded-xl shadow-lg"
          priority
        />

        <h2 className="text-2xl font-bold mb-3">👋 Welcome to TidyCoin</h2>
        <p className="mb-6 text-gray-300">
          Join our community and follow updates below:
        </p>

        <div className="space-y-3">
          <Link
            href="https://t.me/tidycoin"
            target="_blank"
            className="block w-full rounded-full py-3 px-5 font-semibold text-white hover:scale-105 transition shadow-md shadow-black/30"
            style={{
              background: "linear-gradient(to right, #242424, #525252)",
            }}
          >
            🚀 Join Tidycoin Community
          </Link>

          <Link
            href="https://x.com/tidyonchain"
            target="_blank"
            className="block w-full rounded-full py-3 px-5 font-semibold text-white hover:scale-105 transition shadow-md shadow-black/30"
            style={{
              background: "linear-gradient(to right, #242424, #525252)",
            }}
          >
            🐦 Follow us on X
          </Link>
          
        </div>
      </div>
    </main>
  );
}
