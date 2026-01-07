// app/ClientLayout.tsx
"use client";

import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import ContextProvider from "./context";
import { TelegramProvider } from "./context/TelegramContext";
import ErudaInit from "./components/ErudaInit";

export default function ClientLayout({
  cookies,
  children,
}: {
  cookies: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
    return (
      <main>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </main>
    );
  }

  return (
    <>
      <ContextProvider cookies={cookies}>
        <TelegramProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </TelegramProvider>
      </ContextProvider>
      <ErudaInit />
    </>
  );
}
