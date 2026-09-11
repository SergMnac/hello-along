export const REVEAL_SLUGS = [
  'hello',
  'events',
  'city',
  'together',
  'atmosphere',
  'moments',
  'one-click-one-emotion',
] as const;

export type RevealSlug = (typeof REVEAL_SLUGS)[number];

export const isRevealSlug = (value: string): value is RevealSlug => {
  return REVEAL_SLUGS.includes(value as RevealSlug);
};

export const getRevealIndex = (slug: RevealSlug) => REVEAL_SLUGS.indexOf(slug);
