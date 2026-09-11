# AL-WEB-PL-DEP-001 Report

Status: PRODUCTION ACTIVE - SCHEDULER NOT ENABLED

## Scope

- Repository: `SergMnac/hello-along`
- Local workspace: `D:\hello-along`
- Production host: `GW-CL01`
- Approved production source: `main@f3c2cc598163481e388e9ab4461599756d4a07b3`
- Approved release family: `D:\hello-along\artifacts\release-preflight\release-f3c2cc598163\`
- TASK commit: `d8468638121d983519750fd9eb0b9f46db07770c`
- PROMPT commit: `a6280420734fd1abe8817294492f874aedb7e271`

No change was made to `D:\Along`, `SergMnac/along`, DNS, Traefik routing, firewall, WireGuard, SSH configuration, `edge-stvk`, or unrelated services.

## Stop Conditions

Local checks before the first production write:

- Repository remote: `git@github.com:SergMnac/hello-along.git`
- `origin/main`: `f3c2cc598163481e388e9ab4461599756d4a07b3`
- Local deployment worktree: clean after excluding a temporary read-only `projects-knowledge` clone in local `.git/info/exclude`
- Release directory exists: `artifacts/release-preflight/release-f3c2cc598163`
- Release index exists: `release-artifacts-index.json`
- Package checksum list exists: `package-sha256sums.txt`
- Package hashes matched the DEP-001 approved values.
- All stage manifests identify source commit `f3c2cc598163481e388e9ab4461599756d4a07b3`.
- Local scheduler verification from LF-normalized checkout/artifacts passed:
  - `All hello-along releases verified`
  - `package_extract_verify=OK`

GW-CL01 read-only checks before first production write:

- Hostname: `gw-cl01`
- UTC at check: `2026-09-11T18:53:34Z`
- Compose path exists: `/opt/home-dc/edge/compose.yaml`
- Compose SHA-256: `3b4e5e0c387ee7c27107f4454fc99bebec6743705c59ffeb52111fef10b09fe8`
- `edge-hello-along`: running, healthy
- `edge-stvk`: running, healthy
- `edge-traefik`: running
- Ports `80` and `443`: listening on IPv4 and IPv6
- Bind mount: `/opt/home-dc/edge/sites/hello-along:/usr/share/nginx/html:ro`
- Current public source path: real directory, `root:root`, mode `755`
- Site file count before deployment: `10`
- Site bytes before deployment: `4978882`
- Disk: `/dev/sda1`, 51G total, 48G available, 7% used
- Local host HTTP route with `Host: hello-along.com`: `301 https://hello-along.com/`
- Existing scheduler units: none

No unrelated maintenance was observed in the checked Docker/compose state.

## Live Baseline

The first production write preserved the actual live production site before any public path switch.

- Live baseline path: `/opt/home-dc/edge/releases/hello-along/baseline`
- Baseline public path: `/opt/home-dc/edge/releases/hello-along/baseline/public`
- Baseline metadata path: `/opt/home-dc/edge/releases/hello-along/baseline/metadata/baseline-metadata.json`
- Pre-copy inventory: `/opt/home-dc/edge/releases/hello-along/baseline/metadata/pre-copy-site.sha256`
- Post-copy inventory: `/opt/home-dc/edge/releases/hello-along/baseline/metadata/post-copy-public.sha256`
- Integrity manifest: `/opt/home-dc/edge/releases/hello-along/baseline/public.sha256`
- Integrity manifest SHA-256: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
- File count: `10`
- Bytes: `4978882`
- Byte-for-byte copy verification: passed via `cmp -s pre-copy-site.sha256 post-copy-public.sha256`

This live baseline is the authoritative rollback baseline. The packaged historical baseline from REL-001 was not used to replace it.

## Upload Attempt

The approved eight stage packages and approved scheduler script were then prepared for upload to:

- Temporary upload directory: `/tmp/hello-along-dep-f3c2cc598163`
- Intended package subdirectory: `/tmp/hello-along-dep-f3c2cc598163/packages`

Initial multi-file `scp` stalled and was interrupted. It left only temporary partial files, outside the served path and outside the release root.

SFTP batch upload was then attempted. It successfully uploaded at least:

- `hello-along-t-21-f3c2cc598163.tar.gz` with observed size `4853939`
- `hello-along-t-18-f3c2cc598163.tar.gz` with observed size `4854779`
- `hello-along-t-15-f3c2cc598163.tar.gz` with observed size `4855492`

The upload had begun `hello-along-t-12-f3c2cc598163.tar.gz` before the SSH/SFTP connection reset:

- Error: `client_loop: send disconnect: Connection reset`
- Error: `Couldn't send packet: Broken pipe`

After the reset, repeated SSH attempts failed:

- `ssh: connect to host 200.73.113.39 port 22: Connection timed out`

Because SSH became unavailable, the following steps were not performed:

- final package hash verification on GW-CL01;
- extraction into immutable stage release directories;
- server-side `public.sha256` verification for stages;
- scheduler script installation;
- scheduler `verify` on GW-CL01;
- selected stage calculation on GW-CL01;
- activation;
- `edge-hello-along` recreate;
- production route/visual checks;
- rollback proof;
- systemd service/timer installation or enablement.

## Production State

No public-path switch was performed.

- Before public path target: `/opt/home-dc/edge/sites/hello-along` real directory
- After public path target: no switch attempted
- Active campaign stage: none activated by DEP-001
- Scheduler timer: not installed and not enabled
- Rollback proof: not performed

External public HTTPS remained reachable during the SSH outage check:

- Public URL checked: `https://hello-along.com/`
- Result: reachable through the browsing tool

## Blocker

BLOCKER: SSH to `ops@200.73.113.39` became unavailable during the approved package upload phase, before stage verification and before activation.

The task is stopped in `PARTIAL` state to avoid proceeding without verified server-side artifacts and without control-channel access.

## Next Safe Resume Point

When SSH access is stable again:

1. Reconfirm `edge-hello-along` remains healthy and `/opt/home-dc/edge/sites/hello-along` has not changed unexpectedly.
2. Inspect `/tmp/hello-along-dep-f3c2cc598163` and remove/re-upload incomplete temporary package files only.
3. Verify the existing live baseline remains intact:
   - `/opt/home-dc/edge/releases/hello-along/baseline/public.sha256`
   - hash `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
4. Upload all eight approved stage packages.
5. Verify every package SHA-256 against DEP-001 approved values.
6. Extract stages into `/opt/home-dc/edge/releases/hello-along/<stage>`.
7. Install the approved scheduler script only.
8. Run scheduler `verify`.
9. Activate the scheduler-selected current stage.
10. Stop for Owner visual review before enabling any timer.

## Resume After Infrastructure Interruption

Resume authorization accepted the previous state as:

`PARTIAL - SAFE TO RESUME SAME DEP-001`

Resume prechecks on `2026-09-11T19:19:03Z`:

- SSH access to `GW-CL01`: restored and stable for the resume window.
- `edge-hello-along`: running, healthy.
- `edge-stvk`: running, healthy.
- `edge-traefik`: running.
- `/opt/home-dc/edge/sites/hello-along`: still pointed to the original production directory before resumed activation work.
- Live baseline integrity:
  - path: `/opt/home-dc/edge/releases/hello-along/baseline/public.sha256`
  - expected hash: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
  - actual hash: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
  - `sha256sum -c public.sha256`: OK

Temporary upload cleanup:

- Inspected only `/tmp/hello-along-dep-f3c2cc598163`.
- Removed only incomplete temporary package:
  - `/tmp/hello-along-dep-f3c2cc598163/packages/hello-along-t-12-f3c2cc598163.tar.gz`
- Re-uploaded missing packages and scheduler script through SFTP.

Server-side package verification before extraction:

- `hello-along-t-21-f3c2cc598163.tar.gz`: OK
- `hello-along-t-18-f3c2cc598163.tar.gz`: OK
- `hello-along-t-15-f3c2cc598163.tar.gz`: OK
- `hello-along-t-12-f3c2cc598163.tar.gz`: OK
- `hello-along-t-9-f3c2cc598163.tar.gz`: OK
- `hello-along-t-6-f3c2cc598163.tar.gz`: OK
- `hello-along-t-3-f3c2cc598163.tar.gz`: OK
- `hello-along-t-0-f3c2cc598163.tar.gz`: OK

Immutable stage releases extracted and verified:

| stage | release path | `public.sha256` hash | route count |
| --- | --- | --- | --- |
| `t-21` | `/opt/home-dc/edge/releases/hello-along/t-21` | `1f656ade3901e3e3458b763f9bf3132094da1d4ec3f696be4363b01827ea0f82` | 8 |
| `t-18` | `/opt/home-dc/edge/releases/hello-along/t-18` | `208771f5b4d0d0229f6bc183c80174ec66d586d9ae90985dc4e6c4fc38879e5b` | 12 |
| `t-15` | `/opt/home-dc/edge/releases/hello-along/t-15` | `1b980b95ff6fb482d817c5dcc0f356b6c93a4936c02e846b4e71e847cb832b66` | 16 |
| `t-12` | `/opt/home-dc/edge/releases/hello-along/t-12` | `6bcd86d13762ca2fac6e556925c080f36f166a342d652cec4747a88e6484752e` | 20 |
| `t-9` | `/opt/home-dc/edge/releases/hello-along/t-9` | `d349212590ae189d8a50e7346de51695438547d8e980fe8ecddfd48b86fc7830` | 24 |
| `t-6` | `/opt/home-dc/edge/releases/hello-along/t-6` | `ddf349d91e2340033d62a19e8051d3e5555c64de96b0a12a60f065d187ac1211` | 28 |
| `t-3` | `/opt/home-dc/edge/releases/hello-along/t-3` | `f2c34daddd71da74fa0a6d7e6c9099084b17c09d483a2102e5585d15d83e7040` | 32 |
| `t-0` | `/opt/home-dc/edge/releases/hello-along/t-0` | `4d37fb94c5e1f15d152ee13e3affb3eac5f7e54817cd689e191892c86f7fd057` | 32 |

Installed approved scheduler script:

- Path: `/opt/home-dc/edge/bin/along-stage-scheduler.sh`
- SHA-256: `f4f139042a5db493b085e2019afb0895f53f5cb0da9a91b4078d9e7720219bfa`
- Permissions: installed as executable root-owned file.

Scheduler verification:

- `All hello-along releases verified`
- Scheduler-selected stage: `t-21`
- Reason: `2026-09-11` UTC is after `2026-09-10T00:00:00Z` and before `2026-09-13T00:00:00Z`.

Activation evidence:

- First activation attempt used a Traefik HTTP health command and failed closed because that command returned `404`.
- The scheduler restored verified baseline, recreated only `edge-hello-along`, and stopped with an activation error.
- Post-failure state:
  - `/opt/home-dc/edge/sites/hello-along` symlink target: `/opt/home-dc/edge/releases/hello-along/baseline/public`
  - `edge-hello-along`: running, healthy
- Second activation used Docker container health as the scheduler health command.
- Result: `Activated hello-along t-21`
- Public path target after activation: `/opt/home-dc/edge/releases/hello-along/t-21/public`
- Public path type after activation: symlink
- Active release hash: `1f656ade3901e3e3458b763f9bf3132094da1d4ec3f696be4363b01827ea0f82`
- Recreated service: `edge-hello-along` only.
- Container health after activation: `running healthy`

Route checks after activation:

| route | HTTPS status |
| --- | --- |
| `/` | 200 |
| `/en/` | 200 |
| `/es/` | 200 |
| `/ru/` | 200 |
| `/discover/hello/` | 200 |
| `/en/discover/hello/` | 200 |
| `/es/discover/hello/` | 200 |
| `/ru/discover/hello/` | 200 |
| `/discover/events/` | 404 |
| `/en/discover/events/` | 404 |
| `/es/discover/events/` | 404 |
| `/ru/discover/events/` | 404 |

Asset checks:

- `https://hello-along.com/logo/along-logo-dark.svg`: 200
- `https://hello-along.com/assets/background-image@2x.webp`: 200

Owner Adjustment 01 smoke check:

- Technical stage labels in top-level fetched HTML: not found.
- Note: semantic `21 days` text is client-rendered and must be visually checked by Owner in browser.

Scheduler timer state:

- `hello-along-stage.service`: not installed.
- `hello-along-stage.timer`: not installed.
- Timer enabled: no.
- Next trigger: none.

## Owner Visual Review Gate

Stopped for Owner visual review as required.

- Public URL: `https://hello-along.com/`
- Active stage: `t-21`
- Active release path: `/opt/home-dc/edge/releases/hello-along/t-21/public`
- Public-path target: `/opt/home-dc/edge/releases/hello-along/t-21/public`
- Active release hash: `1f656ade3901e3e3458b763f9bf3132094da1d4ec3f696be4363b01827ea0f82`
- Container health: `edge-hello-along` running, healthy

Rollback proof was not executed. Scheduler service/timer was not installed or enabled. DEP-001 must resume only after explicit Owner visual confirmation.

## Final Status

PRODUCTION ACTIVE - SCHEDULER NOT ENABLED.

NO rollback proof was performed yet. NO scheduler timer was enabled.

## CORRECTION 1 - Owner Defects

Status: READY FOR RESTRICTED OWNER CONFIRMATION

Canonical inputs:

- TASK: `AL-WEB-PL-DEP-001-CORRECTION-1-TASK.md`
- TASK commit: `5280df05128f6ceed137fdbdc2dcb746a1bd908d`
- PROMPT: `AL-WEB-PL-DEP-001-CORRECTION-1-PROMPT.md`
- PROMPT commit: `310166249c9565c0e62f53d7cf5d6e617a3d2cee`

Scope:

- C1: move T-21 resting note left so it no longer intrudes into the canonical Along logo area on desktop/intermediate widths.
- C2: restore click/tap/keyboard open and close behavior for the T-21 full reading state in EN, ES and RU.
- Scheduler timer remained absent and disabled.
- Rollback proof was not performed.

Pre-correction production guard:

- Active stage before correction: `t-21`
- Active release before correction: `/opt/home-dc/edge/releases/hello-along/t-21/public`
- Active release hash before correction: `1f656ade3901e3e3458b763f9bf3132094da1d4ec3fbbfdf782d9d8335a7a607c19`
- `edge-hello-along`: running, healthy
- Live baseline hash verified: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
- Scheduler timer units: not installed

Changed source files:

- `src/styles.css`
- `src/__tests__/campaign.test.tsx`

Source changes:

- `.note-card-1` desktop/intermediate position changed from `left: 20.8%` to `left: max(4.5%, calc(50% - 350px))`.
- `.intro-panel` now has `pointer-events: none` so the transparent central composition cannot intercept note clicks/taps.
- Added automated EN/ES/RU T-21 open/close tests for click, keyboard activation, Escape close and technical-stage-label absence.

Corrected source:

- Correction branch commit: `7f4f9c2` (`fix: restore t21 note interaction and spacing`)
- Final remote main merge commit: `a068be82bdf443e279ce26b749922a9d135b18b3`

Checks:

- `npm ci`: passed; npm reported existing peer/audit warnings.
- `npm test`: passed in source checkout; 3 files, 20 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run scan:leaks`: passed.
- Exact final remote main LF checkout:
  - `npm ci`: passed; npm reported existing peer/audit warnings.
  - `npm test`: passed; 1 file, 10 tests.
  - `npm run lint`: passed.
  - `npx tsc --noEmit`: passed.
  - `npm run build`: passed.
  - `npm run build:stages`: passed.
  - `npm run scan:leaks`: passed.
  - `npm run scan:stage-leaks`: passed.
  - `npm run test:scheduler`: passed.

Responsive evidence:

- Screenshot directory: `artifacts/release-preflight/dep-correction-1/`
- Resting screenshots:
  - `desktop-1440-resting-en.png`
  - `owner-943-resting-en.png`
  - `tablet-768-resting-en.png`
  - `mobile-390-resting-en.png`
- Open reading screenshots:
  - `open-en.png`
  - `open-es.png`
  - `open-ru.png`
- Geometry evidence:
  - `visual-geometry.json`
  - 1440 horizontal note/logo gap: `34px`
  - 943 horizontal note/logo gap: `34px`
  - 768 horizontal note/logo gap: `31.2px`

Corrected release:

- Local corrected package root: `artifacts/release-preflight/dep-correction-1/release-a068be82bdf4`
- Server upload temp: `/tmp/hello-along-dep-correction-a068be82bdf4`
- Server package SHA-256 verification: all eight corrected packages OK before extraction.
- Corrected immutable release root: `/opt/home-dc/edge/releases/hello-along-a068be82bdf4`
- Scheduler `verify` with `EXPECTED_SOURCE_COMMIT=a068be82bdf443e279ce26b749922a9d135b18b3`: `All hello-along releases verified`
- Corrected active release path: `/opt/home-dc/edge/releases/hello-along-a068be82bdf4/t-21/public`
- Corrected active release hash: `7ddd9be6ec1a88aca64746b0b9a6e17345c9db3fbbfdf782d9d8335a7a607c19`

Activation:

- Scheduler-selected stage: `t-21`
- Before target: `/opt/home-dc/edge/releases/hello-along/t-21/public`
- After target: `/opt/home-dc/edge/releases/hello-along-a068be82bdf4/t-21/public`
- Recreated service: `edge-hello-along` only.
- Container health after activation: `running healthy`

Public route checks after correction:

| route | HTTPS status |
| --- | --- |
| `/` | 200 |
| `/en/` | 200 |
| `/es/` | 200 |
| `/ru/` | 200 |
| `/discover/hello/` | 200 |
| `/en/discover/hello/` | 200 |
| `/es/discover/hello/` | 200 |
| `/ru/discover/hello/` | 200 |
| `/discover/events/` | 404 |
| `/en/discover/events/` | 404 |
| `/es/discover/events/` | 404 |
| `/ru/discover/events/` | 404 |

Asset checks:

- `https://hello-along.com/logo/along-logo-dark.svg`: 200
- `https://hello-along.com/assets/background-image@2x.webp`: 200

Correction results:

- C1: corrected in production; desktop/intermediate note position no longer overlaps the logo area per screenshots and geometry evidence.
- C2: corrected in source and verified by automated EN/ES/RU open-close tests; open-state visual evidence captured for EN/ES/RU.
- Technical `T-21`/date labels were not reintroduced by the source changes.

Scheduler timer state:

- `hello-along-stage.service`: not installed.
- `hello-along-stage.timer`: not installed.
- Timer enabled: no.
- Next trigger: none.

Stopped at restricted Owner confirmation gate. No rollback proof was performed.

## DEP-001 Correction 1 — Owner mobile-only clarification

Status: `READY FOR RESTRICTED OWNER CONFIRMATION — MOBILE ONLY`

Scope:

- Continued the existing `AL-WEB-PL-DEP-001 — CORRECTION 1`.
- Mobile-only owner defect: real mobile resting note overlapped the canonical Along wordmark.
- Desktop full screen and desktop browser-resize composition were already accepted and were not changed.
- Scheduler timer was not installed or enabled.
- Rollback proof was not performed.

Pre-change production cache/build confirmation:

- Active production target before mobile-only fix: `/opt/home-dc/edge/releases/hello-along-a068be82bdf4/t-21/public`
- Active production hash before mobile-only fix: `7ddd9be6ec1a88aca64746b0b9a6e17345c9db3fbbfdf782d9d8335a7a607c19`
- Served production assets before mobile-only fix:
  - `assets/index-BboSt6ln.css`
  - `assets/index-CeVUvrPw.js`
- Public CSS response before mobile-only fix: `200`, `ETag "6aa4619e-185e"`, `Last-Modified Fri, 11 Sep 2026 20:16:30 GMT`
- Conclusion: owner mobile failure was not treated as stale production assets; production was confirmed to be serving the previous corrected build before code change.

Changed source files:

- `src/styles.css`

Source change:

- In the mobile media branch only, `.note-card-1` moved from `left: 27%; top: 31%;` to `left: 8%; top: 12%;`.
- Desktop and intermediate viewport rules were not changed.
- Technical `T-21`, date or stage labels were not reintroduced.

Corrected source:

- Mobile correction branch: `al-web-pl-dep-001-correction-1-mobile`
- Mobile correction commit: `6e7a65a` (`fix: separate mobile t21 note from logo`)
- Final remote main merge commit: `d9b45bb19537f4157431c45d981f297b47993ecb`

Checks:

- Source checkout:
  - `npm test`: passed; 4 files, 30 tests.
  - `npm run lint`: passed.
  - `npx tsc --noEmit`: passed.
  - `npm run build`: passed.
  - `npm run scan:leaks`: passed.
- Exact final remote main LF checkout at `d9b45bb19537f4157431c45d981f297b47993ecb`:
  - `npm ci`: passed; npm reported existing peer/audit warnings.
  - `npm test`: passed; 1 file, 10 tests.
  - `npm run lint`: passed.
  - `npx tsc --noEmit`: passed.
  - `npm run build`: passed.
  - `npm run build:stages`: passed.
  - `npm run scan:leaks`: passed.
  - `npm run scan:stage-leaks`: passed.
  - `npm run test:scheduler`: passed.

Mobile evidence:

- Local mobile CDP evidence path: `artifacts/release-preflight/dep-correction-1/mobile-only/mobile-cdp-results.json`
- Production mobile CDP evidence path: `artifacts/release-preflight/dep-correction-1-mobile/mobile-production/mobile-production-cdp-results.json`
- Production screenshot directory: `artifacts/release-preflight/dep-correction-1-mobile/mobile-production/`
- Production visual viewport checks:
  - `iphone-390x844-full`: note/logo `overlaps=false`, note `28.95..175.42 x 96.40..175.17`, logo `125..265 x 326.09..386.36`
  - `iphone-390x740-browser-chrome`: note/logo `overlaps=false`, note `28.95..175.42 x 83.93..162.70`, logo `125..265 x 274.09..334.36`
  - `iphone-390x680-reduced-visual`: note/logo `overlaps=false`, note `28.95..175.42 x 76.73..155.49`, logo `125..265 x 244.09..304.36`
  - `android-360x740`: note/logo `overlaps=false`, note `26.56..173.03 x 83.93..162.70`, logo `110..250 x 274.09..334.36`
- Production hit target at note center: `.note-accent`
- Production tap/open/close:
  - EN: opened `true`, closed `true`
  - ES: opened `true`, closed `true`
  - RU: opened `true`, closed `true`

Corrected mobile release:

- Local corrected package root: `artifacts/release-preflight/dep-correction-1-mobile/release-d9b45bb19537`
- Server upload temp: `/tmp/hello-along-dep-mobile-d9b45bb19537`
- Server package SHA-256 verification: all eight corrected packages OK before extraction.
- Corrected immutable release root: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537`
- Scheduler `verify` with `EXPECTED_SOURCE_COMMIT=d9b45bb19537f4157431c45d981f297b47993ecb`: `All hello-along releases verified`
- Scheduler-selected stage: `t-21`
- Corrected active release path: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-21/public`
- Corrected active release hash: `6f39fdf5696365e2c68bba50b13dc903da0acee00cf06c8e59e320095cca56f2`

Activation:

- Before target: `/opt/home-dc/edge/releases/hello-along-a068be82bdf4/t-21/public`
- After target: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-21/public`
- Recreated service: `edge-hello-along` only.
- Container health after activation: `healthy`

Public route checks after mobile correction:

| route | HTTPS status |
| --- | --- |
| `/` | 200 |
| `/en/` | 200 |
| `/es/` | 200 |
| `/ru/` | 200 |
| `/discover/hello/` | 200 |
| `/en/discover/hello/` | 200 |
| `/es/discover/hello/` | 200 |
| `/ru/discover/hello/` | 200 |
| `/discover/events/` | 404 |
| `/en/discover/events/` | 404 |
| `/es/discover/events/` | 404 |
| `/ru/discover/events/` | 404 |

Scheduler timer state after mobile correction:

- `hello-along-stage.service`: not installed.
- `hello-along-stage.timer`: not installed.
- Timer enabled: no.
- Next trigger: none.

Stopped at restricted Owner mobile confirmation gate. No rollback proof was performed.

## DEP-001 finalization after Owner visual confirmation

Status: `DEPLOYMENT COMPLETE — ARCHITECT CLOSURE READY`

Owner visual confirmation:

- Desktop: PASS.
- Responsive desktop: PASS.
- Real mobile: PASS.
- Note/logo separation: PASS.
- Mobile tap -> open -> close: PASS.
- EN / ES / RU: PASS.

Approved production source:

- `main@d9b45bb19537f4157431c45d981f297b47993ecb`

Authoritative baseline integrity:

- Path: `/opt/home-dc/edge/releases/hello-along/baseline/public.sha256`
- Expected SHA-256: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
- Actual SHA-256: `c00edd51169ae0a1e78d575391d42c7c85a277bcc2fe46baa66cbf99b47f3190`
- Baseline `sha256sum -c public.sha256`: passed.

Rollback proof:

- Before rollback target: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-21/public`
- Command path: `/opt/home-dc/edge/bin/along-stage-scheduler.sh rollback baseline`
- Rollback `RELEASES_ROOT`: `/opt/home-dc/edge/releases/hello-along`
- After rollback target: `/opt/home-dc/edge/releases/hello-along/baseline/public`
- Rollback result: `Rolled back hello-along to baseline`
- `edge-hello-along` after rollback: `healthy`
- Baseline public availability after rollback:
  - `/`: 200
  - `/en/`: 200
  - `/es/`: 200
  - `/ru/`: 200

Restoration to campaign stage:

- Scheduler-selected stage: `t-21`
- Restoration `RELEASES_ROOT`: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537`
- Restoration `EXPECTED_SOURCE_COMMIT`: `d9b45bb19537f4157431c45d981f297b47993ecb`
- After restoration target: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-21/public`
- Active release hash: `6f39fdf5696365e2c68bba50b13dc903da0acee00cf06c8e59e320095cca56f2`
- `t-21/stage-manifest.json` confirmed:
  - `stageId`: `t-21`
  - `sourceCommit`: `d9b45bb19537f4157431c45d981f297b47993ecb`
- `edge-hello-along` after restoration: `healthy`

Public route checks after restoration:

| route | HTTPS status |
| --- | --- |
| `/` | 200 |
| `/en/` | 200 |
| `/es/` | 200 |
| `/ru/` | 200 |
| `/discover/hello/` | 200 |
| `/en/discover/hello/` | 200 |
| `/es/discover/hello/` | 200 |
| `/ru/discover/hello/` | 200 |
| `/discover/events/` | 404 |
| `/en/discover/events/` | 404 |
| `/es/discover/events/` | 404 |
| `/ru/discover/events/` | 404 |

Scheduler service/timer installation:

- Installed unit: `/etc/systemd/system/hello-along-stage.service`
- Installed timer: `/etc/systemd/system/hello-along-stage.timer`
- `systemd-analyze verify`: passed for both units.
- Service environment pins the corrected release family:
  - `RELEASES_ROOT=/opt/home-dc/edge/releases/hello-along-d9b45bb19537`
  - `EXPECTED_SOURCE_COMMIT=d9b45bb19537f4157431c45d981f297b47993ecb`
- Service does not reference previous release families `f3c2cc...` or `a068be...`.

Idempotent scheduler proof:

- Manual `systemctl start hello-along-stage.service`: completed with `Result=success`, `ExecMainStatus=0`.
- Before run target: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-21/public`
- After run target: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-21/public`
- Before run hash: `6f39fdf5696365e2c68bba50b13dc903da0acee00cf06c8e59e320095cca56f2`
- After run hash: `6f39fdf5696365e2c68bba50b13dc903da0acee00cf06c8e59e320095cca56f2`
- Before/after symlink mtime: unchanged.
- Result: idempotent; current corrected active release was not damaged or changed.

Timer state:

- `hello-along-stage.service`: installed, static, inactive between runs.
- `hello-along-stage.timer`: installed, enabled, active.
- Timer trigger schedule: `OnCalendar=*-*-* 00:00:05 UTC`, `OnBootSec=45s`, `Persistent=true`.
- Immediate timer activation run: completed successfully and left target unchanged.
- Next trigger: `Sat 2026-09-12 00:00:05 UTC`
- Last trigger observed: `Fri 2026-09-11 21:32:47 UTC`

Final production state:

- Active stage: `t-21`
- Active release path: `/opt/home-dc/edge/releases/hello-along-d9b45bb19537/t-21/public`
- Active release hash: `6f39fdf5696365e2c68bba50b13dc903da0acee00cf06c8e59e320095cca56f2`
- `edge-hello-along`: `healthy`

No self-acceptance was performed.
