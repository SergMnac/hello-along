#!/usr/bin/env bash
set -euo pipefail

SITE_ROOT="${SITE_ROOT:-/opt/home-dc/edge/sites/hello-along}"
RELEASES_ROOT="${RELEASES_ROOT:-/opt/home-dc/edge/releases/hello-along}"
COMPOSE_FILE="${COMPOSE_FILE:-/opt/home-dc/edge/compose.yaml}"
SERVICE_NAME="${SERVICE_NAME:-edge-hello-along}"
PIN_FILE="${PIN_FILE:-/opt/home-dc/edge/hello-along-stage.pin}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1/}"
LOCK_FILE="${LOCK_FILE:-/run/hello-along-stage.lock}"

STAGES=("t-21" "t-18" "t-15" "t-12" "t-9" "t-6" "t-3" "t-0")
UNLOCKS=(
  "2026-09-10T00:00:00Z"
  "2026-09-13T00:00:00Z"
  "2026-09-16T00:00:00Z"
  "2026-09-19T00:00:00Z"
  "2026-09-22T00:00:00Z"
  "2026-09-25T00:00:00Z"
  "2026-09-28T00:00:00Z"
  "2026-10-01T00:00:00Z"
)

stage_index() {
  local wanted="$1"
  for i in "${!STAGES[@]}"; do
    [[ "${STAGES[$i]}" == "$wanted" ]] && { echo "$i"; return 0; }
  done
  return 1
}

unlocked_stage() {
  local now_epoch
  now_epoch="$(date -u +%s)"
  local chosen="t-21"
  for i in "${!STAGES[@]}"; do
    local unlock_epoch
    unlock_epoch="$(date -u -d "${UNLOCKS[$i]}" +%s)"
    if [[ "$now_epoch" -ge "$unlock_epoch" ]]; then
      chosen="${STAGES[$i]}"
    fi
  done
  echo "$chosen"
}

selected_stage() {
  local unlocked
  unlocked="$(unlocked_stage)"
  if [[ -s "$PIN_FILE" ]]; then
    local pinned
    pinned="$(tr -d '[:space:]' < "$PIN_FILE")"
    local pin_i unlock_i
    pin_i="$(stage_index "$pinned")" || { echo "Invalid pin: $pinned" >&2; exit 64; }
    unlock_i="$(stage_index "$unlocked")"
    if [[ "$pin_i" -gt "$unlock_i" ]]; then
      echo "Refusing future emergency pin $pinned; latest unlocked is $unlocked" >&2
      exit 65
    fi
    echo "$pinned"
    return
  fi
  echo "$unlocked"
}

activate_stage() {
  local stage="$1"
  local release_dir="$RELEASES_ROOT/$stage/public"
  local active_link="$SITE_ROOT"
  [[ -d "$release_dir" ]] || { echo "Missing release directory $release_dir" >&2; exit 66; }
  [[ -f "$release_dir/index.html" ]] || { echo "Release $stage has no index.html" >&2; exit 67; }

  local current=""
  [[ -L "$active_link" ]] && current="$(readlink "$active_link")"
  if [[ "$current" == "$release_dir" ]]; then
    echo "hello-along already on $stage"
    return 0
  fi

  local previous_link="$SITE_ROOT.previous"
  local next_link="$SITE_ROOT.next.$$"
  ln -s "$release_dir" "$next_link"
  if [[ -e "$active_link" || -L "$active_link" ]]; then
    rm -f "$previous_link"
    mv -Tf "$active_link" "$previous_link"
  fi
  mv -Tf "$next_link" "$active_link"

  docker compose -f "$COMPOSE_FILE" up -d --force-recreate "$SERVICE_NAME"
  if ! curl -fsS --max-time 10 "$HEALTH_URL" >/dev/null; then
    echo "Health check failed; rolling back symlink" >&2
    rm -f "$active_link"
    [[ -e "$previous_link" || -L "$previous_link" ]] && mv -Tf "$previous_link" "$active_link"
    docker compose -f "$COMPOSE_FILE" up -d --force-recreate "$SERVICE_NAME" || true
    exit 68
  fi
  rm -f "$previous_link"
  echo "Activated hello-along $stage"
}

main() {
  mkdir -p "$(dirname "$LOCK_FILE")"
  exec 9>"$LOCK_FILE"
  flock -n 9 || { echo "Another activation is running"; exit 0; }
  activate_stage "$(selected_stage)"
}

main "$@"
