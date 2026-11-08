export const locales = ['ru', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Market = 'com' | 'ru';
export interface MarketConfig { domain:string; defaultLocale:Locale; operator:null; stores:{apple:null;google:null}; availability:'unavailable'; supportEmail:string }
export const marketConfig = {
  com: { domain:'hello-along.com',defaultLocale:'en',operator:null,stores:{apple:null,google:null},availability:'unavailable',supportEmail:'support@hello-along.com' },
  ru: { domain:'hello-along.ru',defaultLocale:'ru',operator:null,stores:{apple:null,google:null},availability:'unavailable',supportEmail:'support@hello-along.com' },
} as const satisfies Record<Market,MarketConfig>;
export const currentMarket = (import.meta.env.VITE_ALONG_MARKET === 'com' ? 'com' : 'ru') as Market;
