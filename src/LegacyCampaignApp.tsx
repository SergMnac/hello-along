import { useEffect,useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import UnderConstructionPage from './UnderConstructionPage';
import { isRevealSlug } from './campaign/reveals';
import type { Locale } from './campaign/types';
const locales:Locale[]=['en','es','ru'];
const isLocale=(value:string):value is Locale=>locales.includes(value as Locale);
export interface LegacyRouteContext{locale:Locale;revealSlug?:string;notFound:boolean}
export function getLegacyRouteContext(pathname:string):LegacyRouteContext{const parts=pathname.split('/').filter(Boolean);let locale:Locale='en';let cursor=0;if(parts[0]&&isLocale(parts[0])){locale=parts[0];cursor=1}if(parts.length===cursor)return{locale,notFound:false};if(parts[cursor]==='discover'){const slug=parts[cursor+1];const clean=parts.length===cursor+2&&slug&&isRevealSlug(slug);return{locale,revealSlug:clean?slug:undefined,notFound:!clean}}return{locale,notFound:true}}
export default function LegacyCampaignApp(){const location=useLocation();const route=useMemo(()=>getLegacyRouteContext(location.pathname),[location.pathname]);useEffect(()=>{document.documentElement.lang=route.locale},[route.locale]);return <UnderConstructionPage {...route} pathname={location.pathname}/>}
