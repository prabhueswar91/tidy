// global.d.ts
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  MainButton: any;
  BackButton: any;
  HapticFeedback: any;
  close: () => void;
  expand: () => void;
  ready: () => void;
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  ready(): void;
  expand(): void;
  sendData(data: string): void; // ✅ Add missing method
}

interface TelegramWindow extends Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}

declare const window: TelegramWindow;
