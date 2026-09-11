import { isStageId } from './stage-id.mjs';
import { writeGeneratedPayload } from './campaign-build-utils.mjs';

const requested = process.argv[2] ?? 't-21';
if (!isStageId(requested)) {
  console.error(`Usage: node scripts/write-stage-content.mjs <${['t-21', 't-18', 't-15', 't-12', 't-9', 't-6', 't-3', 't-0'].join('|')}>`);
  process.exit(1);
}

await writeGeneratedPayload(requested);
console.log(`Wrote generated campaign payload for ${requested}.`);
