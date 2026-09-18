# AL-WEB-PL-ADJ-003 — Remove False CTAs from Note 03 and Preventive Audit Notes 04–07

Status: `ADJUSTMENT COMPLETE — ARCHITECT REVIEW READY`

No architecture or product self-acceptance was performed.

## Authority and Scope

- TASK commit: `ff7b918a9b45cad58efb892769f074b9303d86e5`
- PROMPT commit: `a432bb2efa49fbf535f1c3bba3bd4521c0925a60`
- Repository: `SergMnac/hello-along`
- Local root: `D:\hello-along`
- Accepted starting source: `main@7f0469280d217f85ce7b232663d0c2ba4ea37527`
- Final remote source: `main@f8d4291184a728f71d2d34ca2d8e190334f90a03`

Removed the false open-state CTA field from Notes 03, 04, 05 and 06 in EN, ES and RU. Preserved titles, body text, semantic slogans/postulates, close control, resting interaction hints, accepted Note 02 behavior, Note 07 countdown and the real T-0 launch CTAs.

## Starting Production State

The required stop conditions were checked before production writes:

- Actual `origin/main`: `7f0469280d217f85ce7b232663d0c2ba4ea37527`.
- Scheduler-selected and active stage: `t-15`.
- Active target: `/opt/home-dc/edge/releases/hello-along-7f0469280d21/t-15/public`.
- Active manifest hash: `ae7a19237975453c2553bff1dab9097be56cc509e9ba4db74b2e5787b7d0b446`.
- `edge-hello-along`: `running`, `healthy`.
- `hello-along-stage.timer`: `enabled`, `active`.
- Scheduler pin referenced the accepted `7f0469280d21` family and full accepted source commit.
- No emergency stage pin was present.
- Authoritative baseline manifest hash: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`.
- Authoritative baseline `sha256sum -c public.sha256`: passed.

No material starting-state divergence was found.

## Source Changes

Changed in final `main` commit:

- `src/campaign/campaign-data.json`
- `src/__tests__/campaign.test.tsx`

Content delta:

- Removed 12 false CTA values: Notes 03–06 across EN / ES / RU.
- Added regression assertions that Notes 03–06 have no CTA.
- Added preservation assertions for all resting interaction hints, Note 07 localized countdown content and T-0 launch CTAs.
- Added EN / ES / RU open/close regression coverage for Notes 03–07.
- Retained the accepted Note 02 CTA-free regression coverage.

No application layout, visual styling, routes, scheduler code, dependencies or other campaign copy changed.

## Quality Gates

Initial source checkout:

- `npm ci`: passed; existing peer/deprecation/audit warnings were reported, with no dependency changes.
- `npm test`: passed, 6 files / 55 tests in the existing workspace containing ignored historical worktrees.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed for all 8 stages.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.

Exact detached checkout of final remote `main@f8d4291184a728f71d2d34ca2d8e190334f90a03`:

- Path: `artifacts/release-preflight/adj-003/worktree-f8d4291184a7`
- `npm ci`: passed; existing warnings only.
- `npm test`: passed, 1 canonical test file / 13 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed for all 8 stages.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.
- `npm run test:scheduler`: passed.

The exact checkout was used as the only source for release packaging.

## Release Artifacts

Local package root:

`artifacts/release-preflight/adj-003/release-f8d4291184a7`

Server upload path:

`/tmp/hello-along-adj-003-f8d4291184a7`

Package SHA-256 values verified locally and again on the server before extraction:

| package | SHA-256 |
| --- | --- |
| `hello-along-t-0-f8d4291184a7.tar.gz` | `75868a025956886f46a4cad6e0790f8a6d35d55d2159228b8d2e702a6c403c8a` |
| `hello-along-t-12-f8d4291184a7.tar.gz` | `f106d68722cf220fa8933404834be40cfb067058d931e57d6f5cf7e002d91ef2` |
| `hello-along-t-15-f8d4291184a7.tar.gz` | `93bd25d6d2355ae633346f73022185496e543cfc4f510285573ab82fde05eb4d` |
| `hello-along-t-18-f8d4291184a7.tar.gz` | `6869c8952f55f70748a6faaaed7b21cf4d689e9473c3526205816247993e8131` |
| `hello-along-t-21-f8d4291184a7.tar.gz` | `32fd3edebee180a9a34c0fe303f82c73929ceee93b76c70ef982b751e1be0d8c` |
| `hello-along-t-3-f8d4291184a7.tar.gz` | `c7c46876b637f2f784157b90cbcbaaadf2f94665d6045ecffbea248db5a5af8b` |
| `hello-along-t-6-f8d4291184a7.tar.gz` | `3e8e1323c7e20e275798619a40700aab7f8f2d15e584c9bbdfb3c8cf941b1f5c` |
| `hello-along-t-9-f8d4291184a7.tar.gz` | `dc35d064e9a04a2722fe6b5eebc61286e5bdc5312942afa5b93cca15220db52e` |

New immutable release family:

`/opt/home-dc/edge/releases/hello-along-f8d4291184a7`

All stage manifests contain the exact final source commit and matching stage ID. Every stage `public.sha256` passed. Scheduler `verify` returned `All hello-along releases verified`.

| stage | SHA-256 of `public.sha256` |
| --- | --- |
| `t-21` | `6f39fdf5696365e2c68bba50b13dc903da0acee00cf06c8e59e320095cca56f2` |
| `t-18` | `19167cbf7e5d035067682644e6d08a56920fa6bfe103b13cb89153998a2ba8cd` |
| `t-15` | `87b57ce0c338de945209494adc5cb95a35ebccdb45850bb980d8259914340b60` |
| `t-12` | `94f8e0208bd6d28c1bf56f4ce7060097fe32d0cf8ecb9fc0e2a11b0b3d373fc9` |
| `t-9` | `3a02ff04c996662cd3570b276b97ca81ed7426416b62a2595c90390f2cc80e71` |
| `t-6` | `6750d5f5462f065f30afd85e249f1f7ed772f1d4943895d60875ffa49e174272` |
| `t-3` | `050dc45280259e8f0ee5d084ceca3233419ee17de19368395e59ebd68753b0a4` |
| `t-0` | `fe0e0906c7a852bd5565326548e44016c9cf2d6174f48b2cf482cd8a8c033c2c` |

The verified authoritative baseline was copied into the new family as required by the approved scheduler verification model. Its hash remained `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`.

## Future Artifact Audit

Server-side scans of the immutable family passed:

- All 12 removed Notes 03–06 CTA strings are absent from every stage public artifact.
- Note 07 `3 days.` / `3 días.` / `3 дня.` remains present in `t-3` and `t-0`.
- EN / ES / RU real launch CTAs remain present in `t-0`.
- Standard stage leakage scans passed.
- Current public `/discover/together/` returns real HTTP `404`; future Note 04 was not exposed.

## Production Activation

The scheduler service unit was backed up before modification:

`/etc/systemd/system/hello-along-stage.service.pre-adj-003-f8d4291184a7`

Updated scheduler pin:

- `RELEASES_ROOT=/opt/home-dc/edge/releases/hello-along-f8d4291184a7`
- `EXPECTED_SOURCE_COMMIT=f8d4291184a728f71d2d34ca2d8e190334f90a03`

No previous release-family references remain in the active service unit. `systemd-analyze verify` passed.

The stage was obtained exclusively from scheduler logic:

- Scheduler-selected stage: `t-15`.
- Previous target: `/opt/home-dc/edge/releases/hello-along-7f0469280d21/t-15/public`.
- Active target: `/opt/home-dc/edge/releases/hello-along-f8d4291184a7/t-15/public`.
- Active manifest hash: `87b57ce0c338de945209494adc5cb95a35ebccdb45850bb980d8259914340b60`.
- `edge-hello-along`: `running`, `healthy`.

## Public Verification

| route | status |
| --- | --- |
| `/` | 200 |
| `/en/` | 200 |
| `/es/` | 200 |
| `/ru/` | 200 |
| `/discover/hello/` | 200 |
| `/discover/events/` | 200 |
| `/discover/city/` | 200 |
| `/discover/together/` | 404 |
| `/logo/along-logo-dark.svg` | 200 |
| `/assets/background-image@2x.webp` | 200 |

Production browser evidence:

- Results: `artifacts/release-preflight/adj-003/production-note03/note03-production-results.json`
- Screenshots: `artifacts/release-preflight/adj-003/production-note03/note03-en.png`, `note03-es.png`, `note03-ru.png`
- Cache was disabled and a unique query parameter was used for every locale.
- Note 03 opens and closes in EN / ES / RU.
- Localized title and semantic body are present.
- Removed CTA text is absent and `.modal-cta` count is `0`.
- Previously revealed Notes 01 and 02 also open and close in EN / ES / RU.

## Scheduler Final State

- `hello-along-stage.service`: last result `success`.
- `hello-along-stage.timer`: `enabled`, `active`.
- Next trigger at final check: `Sat 2026-09-19 00:00:05 UTC`.
- Idempotent manual scheduler run: passed.
- Before/after target remained `/opt/home-dc/edge/releases/hello-along-f8d4291184a7/t-15/public`.
- Before/after manifest hash remained `87b57ce0c338de945209494adc5cb95a35ebccdb45850bb980d8259914340b60`.
- Before/after symlink mtime remained `1789738719`.
- The active service pin contains only the corrected `f8d4291184a7` release family and exact final source commit.

## Recovery

To restore the previous accepted scheduler pin and reactivate the scheduler-selected stage from that family:

```bash
sudo cp -a /etc/systemd/system/hello-along-stage.service.pre-adj-003-f8d4291184a7 /etc/systemd/system/hello-along-stage.service
sudo systemctl daemon-reload
sudo systemctl start hello-along-stage.service
```

The authoritative rollback baseline and all previous immutable release families remain intact.

## Boundaries

No changes were made to `D:\Along`, `SergMnac/along`, DNS, Traefik routing, firewall, WireGuard, SSH, `edge-stvk` or unrelated services.

## Blockers

`NO BLOCKERS`
