// types/telegram.d.ts
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
  };
  platform: string;
  version: string;
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  expand: () => void;
  ready: () => void;
  close: () => void;
}

export interface TelegramUserData {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  isPremium: boolean | null;
  languageCode: string | null;
  queryId: string | null;
  platform: string | null;
  themeParams: Record<string, string> | null;
  version: string | null;
}

export interface UseTelegramUserResult {
  userData: TelegramUserData | null;
  isFromTelegram: boolean;
  isLoading: boolean;
}