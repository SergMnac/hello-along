import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');
const forbidden = [
  'What’s happening nearby?',
  'The city is already alive.',
  'Maybe together?',
  'The city has a mood.',
  'The evening ended.',
  'One Click. One Emotion.',
  'Hello, city.',
  'Open Along',
];

const files = [];

const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (/\.(html|js|css|json|xml|txt)$/.test(entry.name)) files.push(fullPath);
  }
};

await walk(root);

const hits = [];
for (const file of files) {
  const body = await readFile(file, 'utf8');
  for (const phrase of forbidden) {
    if (body.includes(phrase)) hits.push(`${path.relative(root, file)}: ${phrase}`);
  }
}

if (hits.length) {
  console.error(`Future content leaked into ${root}:`);
  for (const hit of hits) console.error(`- ${hit}`);
  process.exit(1);
}

console.log(`No future campaign content found in ${root}.`);
