import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
const routes = ['en', 'es', 'ru', 'discover/hello', 'en/discover/hello', 'es/discover/hello', 'ru/discover/hello'];

await Promise.all(
  routes.map(async (route) => {
    const targetDir = path.join(dist, route);
    await mkdir(targetDir, { recursive: true });
    await copyFile(indexPath, path.join(targetDir, 'index.html'));
  }),
);

await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    '/',
    '/en/',
    '/es/',
    '/ru/',
    '/discover/hello/',
    '/en/discover/hello/',
    '/es/discover/hello/',
    '/ru/discover/hello/',
  ]
    .map((route) => `  <url><loc>https://hello-along.com${route}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
