import { spawnSync } from 'node:child_process';
const command=process.platform==='win32'?'node.exe':'node';
for(const market of ['com','ru']){const result=spawnSync(command,['scripts/build-market.mjs',market],{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1)}
