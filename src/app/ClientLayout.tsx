"use client";

import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import ContextProvider from "./context";
import { TelegramProvider } from "./context/TelegramContext";
import { UserProvider } from "./context/UserContext";
import ErudaInit from "./components/ErudaInit";
// import CloseButton from "./components/ui/CloseButton";
import { UIProvider } from "./context/closebtnContext";
import GlobalCloseButton from "./GlobalCloseButton";
export default function ClientLayout({
  cookies,
  children,
}: {
  cookies: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
console.log(children,'childrenchildren>>>>>>>>>>>>>')
  const toastOptions = {
    style: {
      background: "linear-gradient(135deg, #0B1925, #141318)",
      color: "#BFF36D",
      border: "1px solid #8EFFC7",
      fontWeight: 600,
      fontFamily: "DM Sans, sans-serif",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
    },
    success: {
      iconTheme: {
        primary: "#8EFFC7",
        secondary: "#141318",
      },
    },
    error: {
      iconTheme: {
        primary: "#FF6B6B",
        secondary: "#141318",
      },
    },
  };

  if (isAdmin) {
    return (
      <main>
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={toastOptions}
          gutter={12}
        />
      </main>
    );
  }

  return (
    <>
      <ContextProvider cookies={cookies}>
        <TelegramProvider>
          <UserProvider>
            <UIProvider>
            
            <GlobalCloseButton />
          {children}
          </UIProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={toastOptions}
            gutter={12}
          />
          </UserProvider>
        </TelegramProvider>
      </ContextProvider>
      <ErudaInit />
    </>
  );
}
