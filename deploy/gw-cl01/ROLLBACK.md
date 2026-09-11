# hello-along Campaign Scheduler Operations

This package is prepared for GW-CL01 but is not executed by the engineering task.

## Install Inputs

- Compose file: `/opt/home-dc/edge/compose.yaml`
- Service: `edge-hello-along`
- Public symlink: `/opt/home-dc/edge/sites/hello-along`
- Release root: `/opt/home-dc/edge/releases/hello-along`
- Emergency pin: `/opt/home-dc/edge/hello-along-stage.pin`
- Scheduler script: `/opt/home-dc/edge/bin/along-stage-scheduler.sh`
- Systemd unit: `/etc/systemd/system/hello-along-stage.service`
- Systemd timer: `/etc/systemd/system/hello-along-stage.timer`

## Atomic Activation Model

Future artifacts stay in `/opt/home-dc/edge/releases/hello-along` and are not under the served symlink. Activation verifies the accepted baseline and the selected stage before replacing `/opt/home-dc/edge/sites/hello-along` with a symlink to one already-built release. It then recreates only `edge-hello-along` so Docker resolves the new bind target. If health check fails, the previous symlink is restored, or the durable baseline release is restored when there was no previous symlink.

Required release layout:

```text
/opt/home-dc/edge/releases/hello-along/
  baseline/
    public/
    public.sha256
  t-21/
    public/
    public.sha256
    stage-manifest.json
  ...
  t-0/
    public/
    public.sha256
    stage-manifest.json
```

`public.sha256` is verified from the release root with `sha256sum -c public.sha256`. Stage manifests must match their directory stage id. When `EXPECTED_SOURCE_COMMIT` is set, every campaign stage manifest must also match that source commit.

If the currently served site is a real directory during first activation, the scheduler preserves it as `/opt/home-dc/edge/releases/hello-along/preserved-production-root-<UTC timestamp>` before creating the symlink.

## Pre-enable Verification

After copying artifacts during the deployment task, run:

```bash
sudo SITE_ROOT=/opt/home-dc/edge/sites/hello-along \
  RELEASES_ROOT=/opt/home-dc/edge/releases/hello-along \
  EXPECTED_SOURCE_COMMIT=<approved-merge-commit> \
  /opt/home-dc/edge/bin/along-stage-scheduler.sh verify

sudo SITE_ROOT=/opt/home-dc/edge/sites/hello-along \
  RELEASES_ROOT=/opt/home-dc/edge/releases/hello-along \
  /opt/home-dc/edge/bin/along-stage-scheduler.sh selected-stage
```

Do not enable the timer until verification succeeds.

## Manual Emergency Pin

```bash
printf 't-18\n' | sudo tee /opt/home-dc/edge/hello-along-stage.pin
sudo systemctl start hello-along-stage.service
```

The scheduler refuses a pin later than the latest UTC-unlocked stage.

## Rollback To Accepted Baseline

```bash
sudo /opt/home-dc/edge/bin/along-stage-scheduler.sh rollback baseline
```

Rollback to a prior unlocked campaign stage uses the same verified path:

```bash
sudo /opt/home-dc/edge/bin/along-stage-scheduler.sh rollback t-18
```

## Disable Scheduler

```bash
sudo systemctl disable --now hello-along-stage.timer
sudo rm -f /opt/home-dc/edge/hello-along-stage.pin
```

Do not change Traefik, DNS, firewall, WireGuard, SSH or `edge-stvk`.
