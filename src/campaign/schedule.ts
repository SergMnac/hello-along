import type { CampaignStageMeta, StageId } from './types';

export const CAMPAIGN_STAGES: CampaignStageMeta[] = [
  { id: 't-21', label: 'T-21', unlockAt: '2026-09-10T00:00:00Z', shortDate: '10 Sep' },
  { id: 't-18', label: 'T-18', unlockAt: '2026-09-13T00:00:00Z', shortDate: '13 Sep' },
  { id: 't-15', label: 'T-15', unlockAt: '2026-09-16T00:00:00Z', shortDate: '16 Sep' },
  { id: 't-12', label: 'T-12', unlockAt: '2026-09-19T00:00:00Z', shortDate: '19 Sep' },
  { id: 't-9', label: 'T-9', unlockAt: '2026-09-22T00:00:00Z', shortDate: '22 Sep' },
  { id: 't-6', label: 'T-6', unlockAt: '2026-09-25T00:00:00Z', shortDate: '25 Sep' },
  { id: 't-3', label: 'T-3', unlockAt: '2026-09-28T00:00:00Z', shortDate: '28 Sep' },
  { id: 't-0', label: 'T-0', unlockAt: '2026-10-01T00:00:00Z', shortDate: '1 Oct' },
];

export const STAGE_IDS = CAMPAIGN_STAGES.map((stage) => stage.id);

export const isStageId = (value: string): value is StageId => STAGE_IDS.includes(value as StageId);

export const getStageById = (stageId: StageId) => {
  const stage = CAMPAIGN_STAGES.find((item) => item.id === stageId);
  if (!stage) throw new Error(`Unknown campaign stage: ${stageId}`);
  return stage;
};

export const getStageIndex = (stageId: StageId) => CAMPAIGN_STAGES.findIndex((stage) => stage.id === stageId);

export const getUnlockedStage = (now: Date = new Date()) => {
  return CAMPAIGN_STAGES.reduce((latest, stage) => {
    return now.getTime() >= Date.parse(stage.unlockAt) ? stage : latest;
  }, CAMPAIGN_STAGES[0]);
};

export const getUnlockedStages = (stageId: StageId) => {
  const index = getStageIndex(stageId);
  return CAMPAIGN_STAGES.slice(0, index + 1);
};
