import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const market = process.argv[2];
if (!['com','ru'].includes(market)) throw new Error('Market must be com or ru');
const out = `dist/${market}`;
const result = spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir',out,'--emptyOutDir'],{stdio:'inherit',env:{...process.env,VITE_ALONG_MARKET:market}});
if(result.status!==0) process.exit(result.status??1);
const routes=['','how-it-works','business','about','story/21-days-to-life','safety','support','legal'];
const slugs=['hello','events','city','together','atmosphere','moments','one-click-one-emotion'];
const locales=['en','es','ru'];
const index=readFileSync(join(out,'index.html'),'utf8');
const domains={com:'hello-along.com',ru:'hello-along.ru'};
const defaults={com:'en',ru:'ru'};
function metadata(path){
  const parts=path.split('/').filter(Boolean);const explicit=locales.includes(parts[0])?parts.shift():null;const locale=explicit??defaults[market];const route=`/${parts.join('/')}`||'/';
  const authority=route==='/legal'?market:locale==='ru'?'ru':'com';const authorityPrefix=locale===defaults[authority]?'':`/${locale}`;const canonical=`https://${domains[authority]}${authorityPrefix}${route==='/'?'/':route}`;
  const routeLabel=route==='/'?'Home':route.split('/').filter(Boolean).at(-1).replaceAll('-',' ');const title=`${routeLabel} · Along`;
  const alternates=locales.map(code=>{const target=code==='ru'?'ru':'com';const prefix=code===defaults[target]?'':`/${code}`;return `<link rel="alternate" hreflang="${code}" href="https://${domains[target]}${prefix}${route==='/'?'/':route}" />`}).join('')+`<link rel="alternate" hreflang="x-default" href="https://hello-along.com${route==='/'?'/':route}" />`;
  return index.replace(/<html lang="[^"]+">/,`<html lang="${locale}">`).replace(/<title>.*?<\/title>/,`<title>${title}</title>`).replace(/<link rel="canonical" href="[^"]+" \/>/,`<link rel="canonical" href="${canonical}" />${alternates}`).replace(/<meta property="og:url" content="[^"]+" \/>/,`<meta property="og:url" content="${canonical}" />`);
}
const paths=new Set(routes);
for(const locale of locales) for(const route of routes) paths.add(`${locale}${route?`/${route}`:''}`);
for(const slug of slugs){paths.add(`discover/${slug}`);for(const locale of locales)paths.add(`${locale}/discover/${slug}`)}
writeFileSync(join(out,'index.html'),metadata(''));
for(const path of paths){if(!path)continue;const target=join(out,path,'index.html');mkdirSync(dirname(target),{recursive:true});writeFileSync(target,metadata(path))}
writeFileSync(join(out,'404.html'),metadata('404').replace('</head>','<meta name="robots" content="noindex,follow" /></head>'));
const domain=domains[market];
const publicRoutes=routes.filter(route=>!['safety','legal'].includes(route));
const sitemapRoutes=market==='com'?[...publicRoutes,...publicRoutes.filter(Boolean).map(r=>`es/${r}`), 'es']:[...publicRoutes];
const urls=sitemapRoutes.map(path=>`  <url><loc>https://${domain}/${path}</loc></url>`).join('\n');
writeFileSync(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: https://${domain}/sitemap.xml\n`);
console.log(`Built ${market}: ${paths.size} route entrypoints`);
