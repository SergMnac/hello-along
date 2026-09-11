import { createPayload, createRouteEntrypoints, writeStageManifest } from './campaign-build-utils.mjs';
import { isStageId } from './stage-id.mjs';

const stageId = process.env.ALONG_STAGE_ID ?? 't-21';
if (!isStageId(stageId)) throw new Error(`Invalid stage id: ${stageId}`);

const payload = createPayload(stageId);
await createRouteEntrypoints('dist', stageId);
await writeStageManifest('dist', stageId, payload);
