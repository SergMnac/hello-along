import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');
const port = Number(process.env.PORT ?? process.argv[3] ?? 4180);
const host = process.env.HOST ?? '0.0.0.0';

const contentType = (file) => {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.webp')) return 'image/webp';
  if (file.endsWith('.xml')) return 'application/xml; charset=utf-8';
  return 'application/octet-stream';
};

const resolvePath = async (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const safe = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  let candidate = path.join(root, safe);
  if (!candidate.startsWith(root)) return null;
  if (existsSync(candidate) && (await stat(candidate)).isDirectory()) candidate = path.join(candidate, 'index.html');
  if (!existsSync(candidate) && !path.extname(candidate)) candidate = path.join(candidate, 'index.html');
  if (!candidate.startsWith(root) || !existsSync(candidate)) return null;
  return candidate;
};

createServer(async (request, response) => {
  const file = await resolvePath(request.url ?? '/');
  if (!file) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('404 Not Found');
    return;
  }
  response.writeHead(200, { 'content-type': contentType(file) });
  createReadStream(file).pipe(response);
}).listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}/`);
});
