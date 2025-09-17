import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "./context";
import Script from "next/script";
import ErudaInit from "./components/ErudaInit";
import { Toaster } from "react-hot-toast";
import { TelegramProvider } from "./context/TelegramContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TIDYCOIN",
  description: "TIDYCOIN",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ContextProvider cookies={cookies}>
           <TelegramProvider>
          {children}
           <Toaster position="top-right" reverseOrder={false} />
           </TelegramProvider>
          </ContextProvider>
        <ErudaInit />
      </body>
    </html>
  );
}
