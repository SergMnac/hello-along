import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const registry=JSON.parse(readFileSync('config/release-assets.json','utf8'));
const roots=process.argv.slice(2).length?process.argv.slice(2):['dist/com','dist/ru'];
const files=[];
function walk(root,dir=root){if(!existsSync(dir))throw new Error(`Missing release artifact: ${dir}`);for(const entry of readdirSync(dir,{withFileTypes:true})){const path=join(dir,entry.name);entry.isDirectory()?walk(root,path):files.push({root,path:relative(root,path).replaceAll('\\','/')});}}
for(const root of roots)walk(root);
const blocked=[];
for(const item of registry.assets.filter(item=>!item.releaseEligible))for(const file of files)if(file.path===item.path)blocked.push(`${file.root}/${file.path} (${item.rights})`);
for(const file of files.filter(file=>file.path.startsWith('concept/')))if(!blocked.some(item=>item.startsWith(`${file.root}/${file.path} `)))blocked.push(`${file.root}/${file.path} (not allowlisted)`);
if(blocked.length){console.error('RELEASE ASSET GATE: BLOCKED\n'+blocked.map(item=>`- ${item}`).join('\n'));process.exit(1);}
console.log(`RELEASE ASSET GATE: PASS (${files.length} artifact files checked)`);
