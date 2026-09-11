import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import {
  createPayload,
  createRouteEntrypoints,
  resetDir,
  stages,
  writeGeneratedPayload,
  writePublicHashManifest,
  writeStageManifest
} from './campaign-build-utils.mjs';

const outputRoot = path.resolve('artifacts/stages');
const originalGenerated = await readFile('src/campaign/generatedCampaign.ts', 'utf8');
const index = [];
const viteCli = path.resolve('node_modules/vite/bin/vite.js');

await resetDir(outputRoot);

try {
  for (const stage of stages) {
    const stageRoot = path.join(outputRoot, stage.id);
    const publicDir = path.join(stageRoot, 'public');
    await mkdir(stageRoot, { recursive: true });
    const payload = await writeGeneratedPayload(stage.id);
    execFileSync(process.execPath, [viteCli, 'build', '--outDir', publicDir, '--emptyOutDir'], {
      stdio: 'inherit',
      env: { ...process.env, ALONG_STAGE_ID: stage.id }
    });
    await createRouteEntrypoints(publicDir, stage.id);
    const manifest = await writeStageManifest(stageRoot, stage.id, payload);
    await writePublicHashManifest(stageRoot);
    index.push({
      stageId: stage.id,
      unlockAt: stage.unlockAt,
      publicDir: path.relative(process.cwd(), publicDir).replaceAll('\\', '/'),
      manifest: path.relative(process.cwd(), path.join(stageRoot, 'stage-manifest.json')).replaceAll('\\', '/'),
      integrity: path.relative(process.cwd(), path.join(stageRoot, 'public.sha256')).replaceAll('\\', '/'),
      contentHash: manifest.contentHash,
      routeCount: manifest.routes.length
    });
  }
} finally {
  await writeFile('src/campaign/generatedCampaign.ts', originalGenerated);
}

await writeFile(path.join(outputRoot, 'stage-artifacts-index.json'), `${JSON.stringify(index, null, 2)}\n`);
await writeFile(
  path.join(outputRoot, 'index.md'),
  `# AL-WEB-PL-ENG-001 Stage Artifacts\n\n${index
    .map((item) => `- ${item.stageId}: \`${item.publicDir}\` / \`${item.manifest}\` / \`${item.integrity}\` / ${item.routeCount} routes`)
    .join('\n')}\n`,
);
