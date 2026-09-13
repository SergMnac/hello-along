# AL-WEB-PL-ADJ-002 — Remove Premature CTA from Note 02

Status: `ADJUSTMENT COMPLETE — ARCHITECT REVIEW READY`

No architecture or product self-acceptance was performed.

## Scope

Removed the premature Note 02 open-state CTA in all three locales:

- EN: `See what's happening nearby →`
- ES: `Ver qué está pasando cerca →`
- RU: `Посмотреть, что происходит рядом →`

Preserved Note 02 title, semantic body text, typography hierarchy, close control and open/close interaction. No other note CTA was removed.

## Starting State

- Repository: `SergMnac/hello-along`
- Local root: `D:\hello-along`
- Expected accepted production source at task start: `main@d9b45bb19537f4157431c45d981f297b47993ecb`
- Actual `origin/main` before change: `d9b45bb19537f4157431c45d981f297b47993ecb`
- Production target before change: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-18/public`
- Production selected stage before change: `t-18`
- `edge-hello-along` before change: `healthy`
- Scheduler timer before change: `enabled`, `active`
- Next trigger before change: `Mon 2026-09-14 00:00:05 UTC`
- Authoritative baseline SHA-256: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
- Baseline `sha256sum -c public.sha256`: passed.

No unrelated source changes were present before implementation.

## Source Changes

Changed files in final main source commit:

- `src/campaign/campaign-data.json`
- `src/__tests__/campaign.test.tsx`

Change summary:

- Removed only the `cta` field from Note 02 in EN / ES / RU.
- Added regression coverage proving Note 02 is CTA-free while later note CTAs remain present.
- Added regression coverage proving Note 02 opens and closes in EN / ES / RU without the removed CTA strings.

Final remote main commit:

- `7f0469280d217f85ce7b232663d0c2ba4ea37527`

## Checks

Source checkout:

- `npm ci`: passed; npm reported existing peer/audit warnings.
- `npm test`: passed; 5 files, 42 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.
- `npm run test:scheduler`: passed after local LF normalization of shell scripts; no committed scheduler script content change.

Exact final remote main LF checkout at `7f0469280d217f85ce7b232663d0c2ba4ea37527`:

- Worktree: `artifacts/release-preflight/adj-002/worktree-7f0469280d21`
- `npm ci`: passed; npm reported existing peer/audit warnings.
- `npm test`: passed; 1 file, 12 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.
- `npm run test:scheduler`: passed.

Removed CTA string scan:

- `dist`: no removed CTA strings found.
- `artifacts/stages`: no removed CTA strings found.
- The removed strings remain only in regression tests as forbidden samples.

## Release Family

Local corrected package root:

- `artifacts/release-preflight/adj-002/release-7f0469280d21`

Server upload temp:

- `/tmp/hello-along-adj-002-7f0469280d21`

Corrected immutable release family:

- `/opt/home-dc/edge/releases/hello-along-7f0469280d21`

Package SHA-256 values:

| package | sha256 |
| --- | --- |
| `hello-along-t-0-7f0469280d21.tar.gz` | `1194bf62e68af439c2002011655878f18b641b7996b1eec8c753525d33faef9f` |
| `hello-along-t-12-7f0469280d21.tar.gz` | `9a3743c6ab145e6ba0393129baa7ca801538fa64c763da9ca09008d1c8105662` |
| `hello-along-t-15-7f0469280d21.tar.gz` | `86e4136108b9df9ddff465afb1a82b66430cae89015a6de36ce03af12c87847f` |
| `hello-along-t-18-7f0469280d21.tar.gz` | `8b0b74ae2e55391ca7926ca9b12bc205e38995a87a839b98b065a108a4af427a` |
| `hello-along-t-21-7f0469280d21.tar.gz` | `a5cd02dc5f2711e11aa4c57c0c9c22b7b244721f4cea216fc46e5639316cde59` |
| `hello-along-t-3-7f0469280d21.tar.gz` | `04c34eb2f545f508b34a1bfbc76ca1e4d3321e65cdc15999f42456cfd588edf4` |
| `hello-along-t-6-7f0469280d21.tar.gz` | `ff646f4b8d684d20deeb189d8d45fdd5dd44191cb9e9e3852cef929340d95d71` |
| `hello-along-t-9-7f0469280d21.tar.gz` | `07c8bde4180f5e6b1f3381633ac41106ffbee4f77815536caa83a46b9ca6f038` |

Server package verification:

- `sha256sum -c expected.sha256`: all eight packages OK before extraction.

Release verification:

- All eight stage manifests contain `sourceCommit: 7f0469280d217f85ce7b232663d0c2ba4ea37527`.
- All eight stage manifests contain the expected `stageId`.
- All eight `public.sha256` manifests passed.
- Scheduler `verify` with `RELEASES_ROOT=/opt/home-dc/edge/releases/hello-along-7f0469280d21` and `EXPECTED_SOURCE_COMMIT=7f0469280d217f85ce7b232663d0c2ba4ea37527`: `All hello-along releases verified`.

Stage public SHA-256 manifest hashes:

| stage | sha256(public.sha256) |
| --- | --- |
| `t-21` | `6f39fdf5696365e2c68bba50b13dc903da0acee00cf06c8e59e320095cca56f2` |
| `t-18` | `19167cbf7e5d035067682644e6d08a56920fa6bfe103b13cb89153998a2ba8cd` |
| `t-15` | `ae7a19237975453c2553bff1dab9097be56cc509e9ba4db74b2e5787b7d0b446` |
| `t-12` | `7fefe3eb5c4eae756f79a06d7b8ad68bbf2fdd4f5fa79d9bb621c30db3ad4a62` |
| `t-9` | `50d634784887d4bcab1b1512fb8ce68e1f37c223c4b7a6d91eb9ef58e56b565d` |
| `t-6` | `2e64e2a44478069715446a6bb8050b9dcb947cbfb08a078f47edfc41c9c8c23c` |
| `t-3` | `09e42d832b5658f7f2adf4703f16a111185720d2ccb81f8364ac95edd8ab2349` |
| `t-0` | `09a3a575153bd321f209b2c6d516ad18e25b7103191eb041a24e2d12517cb4f0` |

## Production Deployment

Scheduler service pin was updated to:

- `RELEASES_ROOT=/opt/home-dc/edge/releases/hello-along-7f0469280d21`
- `EXPECTED_SOURCE_COMMIT=7f0469280d217f85ce7b232663d0c2ba4ea37527`

The service environment no longer references the prior release families:

- `hello-along-d9b45bb19537`
- `hello-along-a068be82bdf4`
- `hello-along-f3c2cc...`

Activation:

- Scheduler-selected stage: `t-18`
- Before target: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-18/public`
- After target: `/opt/home-dc/edge/releases/hello-along-7f0469280d21/t-18/public`
- Recreated service: `edge-hello-along` only.
- Service result: `success`
- Container health after activation: `healthy`

Final production state:

- Active stage: `t-18`
- Active release path: `/opt/home-dc/edge/releases/hello-along-7f0469280d21/t-18/public`
- Active release hash: `19167cbf7e5d035067682644e6d08a56920fa6bfe103b13cb89153998a2ba8cd`
- `edge-hello-along`: `healthy`

Public route checks:

| route | HTTPS status |
| --- | --- |
| `/` | 200 |
| `/en/` | 200 |
| `/es/` | 200 |
| `/ru/` | 200 |
| `/discover/hello/` | 200 |
| `/discover/events/` | 200 |
| `/discover/city/` | 404 |

## Production Note 02 Verification

Evidence:

- Results: `artifacts/release-preflight/adj-002/production-note02/note02-production-results.json`
- Screenshots: `artifacts/release-preflight/adj-002/production-note02/`

EN / ES / RU production verification:

- Note 02 opens: passed.
- Note 02 semantic body is present: passed.
- Removed CTA strings are absent: passed.
- `.modal-cta` count in Note 02 dialog: `0`.
- Close control returns to resting state: passed.

## Scheduler

Timer state:

- `hello-along-stage.service`: installed, static, last result `success`.
- `hello-along-stage.timer`: `enabled`, `active`.
- Next trigger: `Mon 2026-09-14 00:00:05 UTC`

Idempotent scheduler proof:

- Manual `systemctl start hello-along-stage.service`: completed with `Result=success`.
- Before run target: `/opt/home-dc/edge/releases/hello-along-7f0469280d21/t-18/public`
- After run target: `/opt/home-dc/edge/releases/hello-along-7f0469280d21/t-18/public`
- Before run hash: `19167cbf7e5d035067682644e6d08a56920fa6bfe103b13cb89153998a2ba8cd`
- After run hash: `19167cbf7e5d035067682644e6d08a56920fa6bfe103b13cb89153998a2ba8cd`
- Before/after symlink mtime: unchanged.
- Container health after idempotent run: `healthy`.

## Non-Goals

No change was made to:

- `D:\Along`
- `SergMnac/along`
- DNS
- Traefik routing
- firewall
- WireGuard
- SSH configuration
- `edge-stvk`
- unrelated production services

The authoritative rollback baseline was not replaced or destroyed.

## Blockers

`NO BLOCKERS`
