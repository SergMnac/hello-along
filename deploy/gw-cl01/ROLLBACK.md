# hello-along Campaign Scheduler Rollback

This package is prepared for GW-CL01 but is not executed by the engineering task.

## Install Inputs

- Compose file: `/opt/home-dc/edge/compose.yaml`
- Service: `edge-hello-along`
- Public symlink: `/opt/home-dc/edge/sites/hello-along`
- Release root: `/opt/home-dc/edge/releases/hello-along/<stage>/public`
- Emergency pin: `/opt/home-dc/edge/hello-along-stage.pin`

## Atomic Activation Model

Future artifacts stay in `/opt/home-dc/edge/releases/hello-along` and are not under the served symlink. Activation replaces `/opt/home-dc/edge/sites/hello-along` with a symlink to one already-built stage, then recreates only `edge-hello-along` so Docker resolves the new bind target. If health check fails, the previous symlink is restored and the container is recreated again.

## Manual Emergency Pin

```bash
printf 't-18\n' | sudo tee /opt/home-dc/edge/hello-along-stage.pin
sudo systemctl start hello-along-stage.service
```

The scheduler refuses a pin later than the latest UTC-unlocked stage.

## Rollback To Accepted Baseline

1. Copy the accepted baseline artifact to `/opt/home-dc/edge/releases/hello-along/baseline/public`.
2. Point the served symlink back to it:

```bash
sudo ln -sfn /opt/home-dc/edge/releases/hello-along/baseline/public /opt/home-dc/edge/sites/hello-along
sudo docker compose -f /opt/home-dc/edge/compose.yaml up -d --force-recreate edge-hello-along
curl -fsS http://127.0.0.1/
```

## Disable Scheduler

```bash
sudo systemctl disable --now hello-along-stage.timer
sudo rm -f /opt/home-dc/edge/hello-along-stage.pin
```

Do not change Traefik, DNS, firewall, WireGuard, SSH or `edge-stvk`.
