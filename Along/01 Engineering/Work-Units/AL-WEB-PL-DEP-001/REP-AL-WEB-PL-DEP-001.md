# AL-WEB-PL-DEP-001 Report

Status: PARTIAL

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

## Final Status

PARTIAL.

NO public activation was performed. NO scheduler timer was enabled.
