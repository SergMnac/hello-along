import { describe,expect,it } from 'vitest';
import { marketConfig } from '../site/config';
import { legalMarketSlots } from '../site/legalContent';
import registry from '../../config/release-assets.json';
describe('WEB-ENG-008 readiness boundaries',()=>{
  it('allows canonical BRA-002 and blocks every concept asset',()=>{expect(registry.assets.find((x:{path:string})=>x.path==='brand/along-wordmark-dark-primary.svg')).toMatchObject({releaseEligible:true,gitBlob:'5bf6fd8f3e7e2910242566180fb673a31486f798'});expect(registry.assets.filter((x:{path:string})=>x.path.startsWith('concept/')).every((x:{releaseEligible:boolean})=>!x.releaseEligible)).toBe(true);});
  it('keeps market release values unavailable',()=>{for(const market of ['com','ru'] as const){expect(marketConfig[market].operator).toBeNull();expect(marketConfig[market].availability).toBe('unavailable');expect(marketConfig[market].stores).toEqual({apple:null,google:null});expect(legalMarketSlots[market].every(slot=>!slot.approved&&slot.href===null)).toBe(true);}});
});
