export const locales = ['ru', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Market = 'com' | 'ru';
export const marketConfig = {
  com: { domain: 'hello-along.com', defaultLocale: 'en' as Locale },
  ru: { domain: 'hello-along.ru', defaultLocale: 'ru' as Locale },
} as const;
export const currentMarket = (import.meta.env.VITE_ALONG_MARKET === 'com' ? 'com' : 'ru') as Market;
