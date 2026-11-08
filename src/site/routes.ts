export const primaryRoutes = [
  { id: 'home', path: '/', nav: true }, { id: 'how', path: '/how-it-works', nav: true },
  { id: 'business', path: '/business', nav: true }, { id: 'about', path: '/about', nav: true },
  { id: 'story', path: '/story/21-days-to-life', nav: false }, { id: 'safety', path: '/safety', nav: false },
  { id: 'support', path: '/support', nav: false }, { id: 'legal', path: '/legal', nav: false },
] as const;
export type RouteId = (typeof primaryRoutes)[number]['id'] | 'archive';
export const historicSlugs = ['hello', 'events', 'city', 'together', 'atmosphere', 'moments', 'one-click-one-emotion'] as const;
