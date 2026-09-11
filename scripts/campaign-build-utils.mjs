import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import data from '../src/campaign/campaign-data.json' with { type: 'json' };

export const stages = [
  { id: 't-21', label: 'T-21', unlockAt: '2026-09-10T00:00:00Z', shortDate: '10 Sep' },
  { id: 't-18', label: 'T-18', unlockAt: '2026-09-13T00:00:00Z', shortDate: '13 Sep' },
  { id: 't-15', label: 'T-15', unlockAt: '2026-09-16T00:00:00Z', shortDate: '16 Sep' },
  { id: 't-12', label: 'T-12', unlockAt: '2026-09-19T00:00:00Z', shortDate: '19 Sep' },
  { id: 't-9', label: 'T-9', unlockAt: '2026-09-22T00:00:00Z', shortDate: '22 Sep' },
  { id: 't-6', label: 'T-6', unlockAt: '2026-09-25T00:00:00Z', shortDate: '25 Sep' },
  { id: 't-3', label: 'T-3', unlockAt: '2026-09-28T00:00:00Z', shortDate: '28 Sep' },
  { id: 't-0', label: 'T-0', unlockAt: '2026-10-01T00:00:00Z', shortDate: '1 Oct' }
];

export const locales = data.locales;
export const slugs = data.slugs;
export const stageIndex = (stageId) => {
  const index = stages.findIndex((stage) => stage.id === stageId);
  if (index < 0) throw new Error(`Unknown stage ${stageId}`);
  return index;
};

export const noteCountForStage = (stageId) => Math.min(stageIndex(stageId) + 1, slugs.length);

export const createPayload = (stageId) => {
  const count = noteCountForStage(stageId);
  const notes = Object.fromEntries(locales.map((locale) => [locale, data.notes[locale].slice(0, count)]));
  return {
    stage: stages[stageIndex(stageId)],
    stages,
    slugs,
    seo: data.seo,
    copy: {
      base: data.base,
      notes,
      ...(stageId === 't-0' ? { launch: data.launch } : {})
    }
  };
};

export const sourceCommit = () => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
};

export const hashObject = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

export const writeGeneratedPayload = async (stageId) => {
  const payload = createPayload(stageId);
  await writeFile(
    path.resolve('src/campaign/generatedCampaign.ts'),
    `import type { StagePayload } from './types';\n\nexport const CAMPAIGN_PAYLOAD: StagePayload = ${JSON.stringify(payload, null, 2)};\n`,
  );
  return payload;
};

export const publishedRoutes = (stageId) => {
  const unlockedSlugs = slugs.slice(0, noteCountForStage(stageId));
  const routeSet = new Set(['/', '/en/', '/es/', '/ru/']);
  for (const slug of unlockedSlugs) {
    routeSet.add(`/discover/${slug}/`);
    for (const locale of locales) routeSet.add(`/${locale}/discover/${slug}/`);
  }
  return [...routeSet];
};

export const createRouteEntrypoints = async (dist, stageId) => {
  const indexPath = path.join(dist, 'index.html');
  for (const route of publishedRoutes(stageId)) {
    if (route === '/') continue;
    const targetDir = path.join(dist, route);
    await mkdir(targetDir, { recursive: true });
    await copyFile(indexPath, path.join(targetDir, 'index.html'));
  }
  await writeSeoFiles(dist, stageId);
};

const absoluteUrl = (route) => `https://hello-along.com${route}`;

const hreflangsForRoute = (route) => {
  if (route === '/') return [['x-default', absoluteUrl('/')], ['en', absoluteUrl('/en/')], ['es', absoluteUrl('/es/')], ['ru', absoluteUrl('/ru/')]];
  const withoutLocale = route.replace(/^\/(en|es|ru)\//, '/');
  return [
    ['x-default', absoluteUrl(withoutLocale)],
    ['en', absoluteUrl(`/en${withoutLocale}`)],
    ['es', absoluteUrl(`/es${withoutLocale}`)],
    ['ru', absoluteUrl(`/ru${withoutLocale}`)]
  ];
};

export const writeSeoFiles = async (dist, stageId) => {
  const routes = publishedRoutes(stageId);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${routes
    .map((route) => `  <url>\n    <loc>${absoluteUrl(route)}</loc>\n${hreflangsForRoute(route)
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`)
      .join('\n')}\n  </url>`)
    .join('\n')}\n</urlset>\n`;
  await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
  await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://hello-along.com/sitemap.xml\n');
};

export const writeStageManifest = async (stageRoot, stageId, payload) => {
  const manifest = {
    stageId,
    unlockAt: stages[stageIndex(stageId)].unlockAt,
    sourceCommit: sourceCommit(),
    contentHash: hashObject(payload),
    routes: publishedRoutes(stageId),
    generatedAt: new Date().toISOString()
  };
  await writeFile(path.join(stageRoot, 'stage-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
};

export const walkTextFiles = async (root) => {
  const files = [];
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(html|js|css|json|xml|txt|map)$/.test(entry.name)) files.push(full);
    }
  };
  await walk(root);
  return files;
};

export const resetDir = async (dir) => {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
};

export { data as campaignData };
