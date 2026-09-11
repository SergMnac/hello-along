import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { campaignData, noteCountForStage, slugs, stages, walkTextFiles } from './campaign-build-utils.mjs';

const target = path.resolve(process.argv[2] ?? 'dist');

const unique = (items) => [...new Set(items.filter(Boolean))];

const notePhrases = (note) => unique([
  note.title,
  note.accent,
  note.cta,
  note.returnLine,
  note.tagline,
  ...(note.body ?? []),
  ...(note.emphasis ?? [])
]);

const futurePhrasesForStage = (stageId) => {
  const count = noteCountForStage(stageId);
  const phrases = [];
  const allowed = [];
  for (const locale of campaignData.locales) {
    for (const note of campaignData.notes[locale].slice(0, count)) allowed.push(...notePhrases(note));
    for (const note of campaignData.notes[locale].slice(count)) phrases.push(...notePhrases(note));
    if (stageId !== 't-0') phrases.push(...Object.values(campaignData.launch[locale]));
  }
  const allowedPhrases = unique(allowed);
  return unique(phrases).filter((phrase) => {
    if (phrase.length < 6) return false;
    return !allowedPhrases.some((allowedPhrase) => allowedPhrase === phrase || allowedPhrase.includes(phrase));
  });
};

const scanOne = async (root, stageId) => {
  const files = await walkTextFiles(root);
  const forbidden = futurePhrasesForStage(stageId);
  const hits = [];
  for (const file of files) {
    const body = await readFile(file, 'utf8');
    for (const phrase of forbidden) {
      if (body.includes(phrase)) hits.push(`${path.relative(root, file)}: ${phrase}`);
    }
  }

  const unlockedSlugs = new Set(slugs.slice(0, noteCountForStage(stageId)));
  for (const slug of slugs) {
    const routeExists = existsSync(path.join(root, 'discover', slug, 'index.html'));
    if (!unlockedSlugs.has(slug) && routeExists) hits.push(`future route exists: /discover/${slug}/`);
    if (unlockedSlugs.has(slug) && !routeExists) hits.push(`published route missing: /discover/${slug}/`);
  }
  return hits;
};

const roots = [];
if (existsSync(path.join(target, 'stage-artifacts-index.json'))) {
  for (const stage of stages) roots.push([stage.id, path.join(target, stage.id, 'public')]);
} else {
  const manifestPath = path.join(target, 'stage-manifest.json');
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    roots.push([manifest.stageId, target]);
  } else {
    roots.push(['t-21', target]);
  }
}

const allHits = [];
for (const [stageId, root] of roots) {
  const hits = await scanOne(root, stageId);
  allHits.push(...hits.map((hit) => `${stageId}: ${hit}`));
}

if (allHits.length) {
  console.error('Campaign content leakage or route lifecycle failure detected:');
  for (const hit of allHits) console.error(`- ${hit}`);
  process.exit(1);
}

console.log(`No future campaign leakage found in ${target}.`);
