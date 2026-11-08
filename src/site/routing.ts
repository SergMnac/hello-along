import { currentMarket, locales, marketConfig, type Locale } from './config';
import { historicSlugs, primaryRoutes, type RouteId } from './routes';
export interface SiteContext { locale: Locale; route: { id: RouteId; path: string }; archiveSlug?: string; notFound: boolean }
export function parseSiteLocation(pathname: string): SiteContext {
  const parts = pathname.split('/').filter(Boolean);
  const explicit = locales.includes(parts[0] as Locale) ? parts.shift() as Locale : undefined;
  const locale = explicit ?? marketConfig[currentMarket].defaultLocale;
  const cleanPath = `/${parts.join('/')}`.replace(/\/$/, '') || '/';
  const route = primaryRoutes.find((item) => item.path === cleanPath);
  if (route) return { locale, route, notFound: false };
  if (parts[0] === 'discover' && historicSlugs.includes(parts[1] as never) && parts.length === 2) return { locale, route: { id: 'archive', path: cleanPath }, archiveSlug: parts[1], notFound: false };
  return { locale, route: { id: 'home', path: cleanPath }, notFound: true };
}
export function localizedPath(path: string, locale: Locale): string {
  const prefix = locale === marketConfig[currentMarket].defaultLocale ? '' : `/${locale}`;
  return path === '/' ? `${prefix}/` : `${prefix}${path}`;
}
export function switchLocale(location: Pick<Location, 'search' | 'hash'>, locale: Locale, routePath: string): string {
  const anchor = routePath === '/how-it-works' && location.hash === '#evening-walk' ? location.hash : '';
  return `${localizedPath(routePath, locale)}${location.search}${anchor}`;
}
