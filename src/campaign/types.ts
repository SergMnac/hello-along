export type Locale = 'en' | 'es' | 'ru';

export type StageId = 't-21' | 't-18' | 't-15' | 't-12' | 't-9' | 't-6' | 't-3' | 't-0';

export interface CampaignStageMeta {
  id: StageId;
  label: string;
  unlockAt: string;
  shortDate: string;
}

export interface LocalizedNote {
  title: string;
  accent?: string;
  tapLabel: string;
  body: string[];
  emphasis?: string[];
  cta?: string;
  tagline?: string;
  returnLine?: string;
}

export interface LocalizedLaunch {
  title: string;
  kicker: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface LocalizedBaseCopy {
  atmospheric: string;
  subtitle: string;
  email: string;
  copyright: string;
  languageLabel: string;
  closeLabel: string;
  noteListLabel: string;
  campaignLabel: string;
  notFoundTitle: string;
  notFoundBody: string;
}

export interface CampaignCopy {
  base: Record<Locale, LocalizedBaseCopy>;
  notes: Record<Locale, LocalizedNote[]>;
  launch?: Record<Locale, LocalizedLaunch>;
}

export interface StagePayload {
  stage: CampaignStageMeta;
  stages: CampaignStageMeta[];
  slugs: string[];
  seo: Record<Locale, { siteTitle: string; description: string }>;
  copy: CampaignCopy;
}

export interface AnalyticsEvent {
  name:
    | 'uc_view'
    | 'current_reveal_view'
    | 'resting_note_open'
    | 'permanent_reveal_page_view'
    | 'cta_click'
    | 'repeat_visit'
    | 'launch_state_view'
    | 'launch_primary_cta'
    | 'launch_secondary_cta';
  detail?: Record<string, string | number | boolean>;
}
