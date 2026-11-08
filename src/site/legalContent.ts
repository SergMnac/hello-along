import type { Market } from './config';

export type LegalSlotKind = 'operator' | 'terms' | 'privacy';
export interface LegalSlot { market: Market; kind: LegalSlotKind; title: string; approved: false; href: null }

export const legalMarketSlots: Record<Market, readonly LegalSlot[]> = {
  com: [
    { market:'com',kind:'operator',title:'Оператор .com',approved:false,href:null },
    { market:'com',kind:'terms',title:'Условия использования .com',approved:false,href:null },
    { market:'com',kind:'privacy',title:'Конфиденциальность .com',approved:false,href:null },
  ],
  ru: [
    { market:'ru',kind:'operator',title:'Оператор .ru',approved:false,href:null },
    { market:'ru',kind:'terms',title:'Условия использования .ru',approved:false,href:null },
    { market:'ru',kind:'privacy',title:'Конфиденциальность .ru',approved:false,href:null },
  ],
};

export const legalApprovalState = 'Не согласовано / неактивный текстовый блок';
export const legalUnavailableText = 'Не согласовано — нужны подтверждающие сведения и утверждённый текст. Ссылки на документ пока нет.';
