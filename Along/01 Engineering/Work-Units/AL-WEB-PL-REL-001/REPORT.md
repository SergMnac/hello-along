# AL-WEB-PL-REL-001 Report

Status: READY FOR DEPLOYMENT REVIEW

## Scope

- Repository: `SergMnac/hello-along`
- Local workspace: `D:\hello-along`
- Source branch reviewed: `al-web-pl-eng-001`
- Accepted implementation source at task start: `cee2593a2be422a45333620182c95b29c737428f`
- Hardened implementation branch commit: `0cc45b306e74e9a82e28e45acd70214167fdde89`
- Expected baseline main: `11eb809891913e2141098016958a912186b58543`
- Published main merge commit: `f3c2cc598163481e388e9ab4461599756d4a07b3`

No production deployment, file upload, remote directory creation, symlink switch, container restart, timer/service install, DNS change, firewall change, routing change, SSH change, or WireGuard change was performed.

## Scheduler And Rollback Hardening

Changed release readiness source files on `al-web-pl-eng-001`:

- `.gitignore`
- `package.json`
- `scripts/rehearse-scheduler.sh`
- `scripts/build-stages.mjs`
- `scripts/campaign-build-utils.mjs`
- `deploy/gw-cl01/along-stage-scheduler.sh`
- `deploy/gw-cl01/ROLLBACK.md`
- `artifacts/stages/*/public.sha256`
- `artifacts/stages/index.md`
- `artifacts/stages/stage-artifacts-index.json`
- `artifacts/stages/*/stage-manifest.json`

Hardening summary:

- Added durable baseline release verification before activation and rollback.
- Added `public.sha256` integrity manifests for each stage artifact.
- Added scheduler `verify`, `selected-stage`, `activate`, and `rollback` commands.
- Added emergency pin future-stage refusal.
- Added first-activation preservation of an existing real production directory.
- Added health-failure rollback to the previous verified symlink or durable baseline.
- Added isolated filesystem rehearsal with stub restart/health commands.

Scheduler rehearsal evidence:

- `artifacts/release-preflight/scheduler-rehearsal.txt`
- Result: `result=OK`
- Covered cases: first activation preserving existing root, idempotent repeat, missed-boundary jump to latest unlocked stage, future pin rejection, tampered artifact rejection, health failure rollback, rollback to baseline, full release verification.

## Local Verification

Implementation branch checks before merge:

- `npm ci`: passed; npm reported existing peer/audit warnings.
- `npm test`: passed; 1 test file, 9 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.
- `npm run test:scheduler`: passed.

Exact remote merge commit checks from clean LF checkout of `origin/main@f3c2cc598163481e388e9ab4461599756d4a07b3`:

- `npm ci`: passed; npm reported existing peer/audit warnings.
- `npm test`: passed; 1 test file, 9 tests.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run build:stages`: passed.
- `npm run scan:leaks`: passed.
- `npm run scan:stage-leaks`: passed.
- `npm run test:scheduler`: passed.

Baseline rollback checkout `11eb809891913e2141098016958a912186b58543`:

- `npm ci`: passed; npm reported existing peer/audit warnings.
- `npm test`: passed; 1 test file, 1 test.
- `npm run lint`: passed.
- `npm run build`: passed.

Note: on Windows, a default CRLF checkout of shell scripts makes Bash reject `set -euo pipefail`. Release packaging and scheduler verification were performed from a clean checkout created with `core.autocrlf=false`, matching the Linux deployment target.

## Release Artifacts

Artifacts were built from exact remote merge commit `f3c2cc598163481e388e9ab4461599756d4a07b3` without committing generated packages back to `main`.

Artifact index:

- `artifacts/release-preflight/release-f3c2cc598163/release-artifacts-index.json`
- `artifacts/release-preflight/release-f3c2cc598163/index.md`
- `artifacts/release-preflight/release-f3c2cc598163/package-sha256sums.txt`

Packages:

| artifact | sha256 |
| --- | --- |
| `hello-along-baseline-11eb80989191.tar.gz` | `33dbcdb3fbd238506adeb15c9786eaabaeb521df4ef20fd68631312fa1e84573` |
| `hello-along-t-21-f3c2cc598163.tar.gz` | `d1c5686382760f82ed8d1124ee6ffd195a0ee0dd1f33723481beea386510cada` |
| `hello-along-t-18-f3c2cc598163.tar.gz` | `686366c5a742f962b228876dd9aba61c4dd397679a23c1e4bc50f131d3aae659` |
| `hello-along-t-15-f3c2cc598163.tar.gz` | `34a1d98bd646909529e92605fe27b31b57db55e9b6396288753a3a000543a9ad` |
| `hello-along-t-12-f3c2cc598163.tar.gz` | `5027f2d2b17912d5749f173533ab65b6678d366c59e295afba590d900a1b9263` |
| `hello-along-t-9-f3c2cc598163.tar.gz` | `01946d0e184477cd73fe7366ca6b41e9aeefdf23632c7d20248d17333c864b2d` |
| `hello-along-t-6-f3c2cc598163.tar.gz` | `9c6b35366d2d101769f0753717c80859b98cca83066c5a09aec19ecfdb13316c` |
| `hello-along-t-3-f3c2cc598163.tar.gz` | `9477d18464a692dad09adf55746e3f1b9661259875cab44d4faee9dd343aa7da` |
| `hello-along-t-0-f3c2cc598163.tar.gz` | `9c372808e20b4136bb55276ab51fad1015592fc27fd3d616ce3025cd7f469340` |

Package extraction and scheduler verification:

- Extracted all packages into `artifacts/release-preflight/release-f3c2cc598163/verify-extract`.
- Verified every `public.sha256`.
- Verified all stage manifests contain source commit `f3c2cc598163481e388e9ab4461599756d4a07b3`.
- Ran scheduler `verify` against the extracted release root: passed.

## GW-CL01 Read-Only Preflight

Host:

- SSH target: `ops@200.73.113.39`
- Hostname: `gw-cl01`
- OS: `Ubuntu 24.04.4 LTS`
- Compose path exists: `/opt/home-dc/edge/compose.yaml`
- Docker: `Docker version 29.6.2`
- Docker Compose: `v5.3.1`
- Disk for `/opt/home-dc/edge`: `/dev/sda1`, 51G total, 3.4G used, 48G available, 7% used.

Ports:

- `0.0.0.0:80` listening.
- `0.0.0.0:443` listening.
- `[::]:80` listening.
- `[::]:443` listening.

Services:

- `edge-traefik`: running, publishes `80` and `443`, dashboard disabled in compose via `--api=false`.
- `edge-hello-along`: running, healthy, bind mount source `/opt/home-dc/edge/sites/hello-along` to `/usr/share/nginx/html:ro`.
- `edge-stvk`: running, healthy, bind mount source `/opt/home-dc/edge/sites/stvk` to `/usr/share/nginx/html:ro`.

Current site path:

- `/opt/home-dc/edge/sites/hello-along` is a real directory, `root:root`, mode `755`.
- It is not currently a symlink.
- Parent `/opt/home-dc/edge/sites` is a real directory, `root:root`, mode `755`.
- Filesystem: `/dev/sda1 ext4`.

Health and routing:

- Local Traefik route check with `Host: hello-along.com` over HTTP returned `308 Permanent Redirect` to `https://hello-along.com/`.
- Compose healthcheck for `edge-hello-along` is container-local `wget -q -O /dev/null http://127.0.0.1/ || exit 1`; Docker reports healthy.

Read-only operational conclusion:

- Existing contour is compatible with the planned symlink activation model only if deployment first preserves the current real directory as the durable baseline release or replaces it with a verified baseline symlink.
- Because Docker bind mounts resolve the source path at container creation, the scheduler's `docker compose ... up -d --force-recreate edge-hello-along` remains necessary after symlink switching.
- No scheduler systemd units are currently installed.
- `ops` needs `sudo` for Docker inspection; `sudo -n` is available.

## Local Preview

Current local preview server:

- Command: `HOST=0.0.0.0 PORT=3000 npm run serve:static -- dist`
- Localhost URL: `http://localhost:3000/`
- LAN URL: `http://192.168.46.230:3000/`

Route checks:

- `http://localhost:3000/`: 200
- `http://localhost:3000/en/`: 200
- `http://localhost:3000/es/`: 200
- `http://localhost:3000/ru/`: 200
- `http://192.168.46.230:3000/`: 200
- `http://192.168.46.230:3000/en/`: 200
- `http://192.168.46.230:3000/es/`: 200
- `http://192.168.46.230:3000/ru/`: 200

## Deployment Gate

READY FOR DEPLOYMENT REVIEW.

No blockers.
