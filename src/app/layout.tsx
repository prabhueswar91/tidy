import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Script from "next/script";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // important for font-light, etc.
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "TIDYZEN",
  description: "TIDYZEN",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie") || "";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
         <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ClientLayout cookies={cookies}>{children}</ClientLayout>
      </body>
    </html>
  );
}
