// types/telegram.d.ts
export {};

declare global {
  interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    allows_write_to_pm?: boolean;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
      user?: TelegramUser;
      query_id?: string;
      auth_date?: string;
      hash?: string;
    };
    ready: () => void;
    close: () => void;
    expand: () => void;
    sendData: (data: string) => void;
    version: string;
    platform: string;
    colorScheme: "light" | "dark";
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
