#!/usr/bin/env bash
set -euo pipefail

SITE_ROOT="${SITE_ROOT:-/opt/home-dc/edge/sites/hello-along}"
RELEASES_ROOT="${RELEASES_ROOT:-/opt/home-dc/edge/releases/hello-along}"
COMPOSE_FILE="${COMPOSE_FILE:-/opt/home-dc/edge/compose.yaml}"
SERVICE_NAME="${SERVICE_NAME:-edge-hello-along}"
PIN_FILE="${PIN_FILE:-/opt/home-dc/edge/hello-along-stage.pin}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1/}"
LOCK_FILE="${LOCK_FILE:-/run/hello-along-stage.lock}"
EXPECTED_SOURCE_COMMIT="${EXPECTED_SOURCE_COMMIT:-}"
RESTART_CMD="${RESTART_CMD:-docker compose -f \"$COMPOSE_FILE\" up -d --force-recreate \"$SERVICE_NAME\"}"
HEALTH_CMD="${HEALTH_CMD:-curl -fsS --max-time 10 \"$HEALTH_URL\"}"
DATE_BIN="${DATE_BIN:-date}"
SHA256SUM_BIN="${SHA256SUM_BIN:-sha256sum}"

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

die() {
  echo "ERROR: $*" >&2
  exit "${EXIT_CODE:-1}"
}

stage_index() {
  local wanted="$1"
  for i in "${!STAGES[@]}"; do
    [[ "${STAGES[$i]}" == "$wanted" ]] && { echo "$i"; return 0; }
  done
  return 1
}

release_root_for() {
  local stage="$1"
  [[ "$stage" =~ ^(baseline|t-21|t-18|t-15|t-12|t-9|t-6|t-3|t-0)$ ]] || {
    EXIT_CODE=64 die "unknown release stage: $stage"
  }
  printf '%s/%s' "$RELEASES_ROOT" "$stage"
}

public_dir_for() {
  printf '%s/public' "$(release_root_for "$1")"
}

manifest_for() {
  printf '%s/stage-manifest.json' "$(release_root_for "$1")"
}

hash_manifest_for() {
  printf '%s/public.sha256' "$(release_root_for "$1")"
}

now_epoch() {
  if [[ -n "${NOW_EPOCH:-}" ]]; then
    echo "$NOW_EPOCH"
  else
    "$DATE_BIN" -u +%s
  fi
}

unlock_epoch() {
  "$DATE_BIN" -u -d "$1" +%s
}

unlocked_stage() {
  local now chosen unlock
  now="$(now_epoch)"
  chosen="t-21"
  for i in "${!STAGES[@]}"; do
    unlock="$(unlock_epoch "${UNLOCKS[$i]}")"
    if [[ "$now" -ge "$unlock" ]]; then
      chosen="${STAGES[$i]}"
    fi
  done
  echo "$chosen"
}

selected_stage() {
  local unlocked pinned pin_i unlock_i
  unlocked="$(unlocked_stage)"
  if [[ -s "$PIN_FILE" ]]; then
    pinned="$(tr -d '[:space:]' < "$PIN_FILE")"
    pin_i="$(stage_index "$pinned")" || { EXIT_CODE=64 die "invalid emergency pin: $pinned"; }
    unlock_i="$(stage_index "$unlocked")"
    if [[ "$pin_i" -gt "$unlock_i" ]]; then
      EXIT_CODE=65 die "refusing future emergency pin $pinned; latest unlocked is $unlocked"
    fi
    echo "$pinned"
    return
  fi
  echo "$unlocked"
}

verify_hash_manifest() {
  local stage="$1" root hash_file
  root="$(release_root_for "$stage")"
  hash_file="$(hash_manifest_for "$stage")"
  [[ -f "$hash_file" ]] || { EXIT_CODE=66 die "missing integrity manifest: $hash_file"; }
  (cd "$root" && "$SHA256SUM_BIN" -c "$(basename "$hash_file")" >/dev/null) || {
    EXIT_CODE=66 die "integrity verification failed for $stage"
  }
}

verify_release() {
  local stage="$1" public manifest expected_json
  public="$(public_dir_for "$stage")"
  manifest="$(manifest_for "$stage")"
  [[ -d "$public" ]] || { EXIT_CODE=66 die "missing release public dir: $public"; }
  [[ -f "$public/index.html" ]] || { EXIT_CODE=67 die "release $stage has no index.html"; }
  if [[ "$stage" != "baseline" ]]; then
    [[ -f "$manifest" ]] || { EXIT_CODE=66 die "missing stage manifest: $manifest"; }
    expected_json="\"stageId\": \"$stage\""
    grep -Fq "$expected_json" "$manifest" || { EXIT_CODE=66 die "manifest stage mismatch for $stage"; }
    if [[ -n "$EXPECTED_SOURCE_COMMIT" ]]; then
      grep -Fq "\"sourceCommit\": \"$EXPECTED_SOURCE_COMMIT\"" "$manifest" || {
        EXIT_CODE=66 die "manifest source commit mismatch for $stage"
      }
    fi
  fi
  verify_hash_manifest "$stage"
}

verify_baseline() {
  verify_release baseline
}

current_target() {
  if [[ -L "$SITE_ROOT" ]]; then
    readlink "$SITE_ROOT"
  else
    echo ""
  fi
}

preserve_existing_real_root() {
  [[ -e "$SITE_ROOT" || -L "$SITE_ROOT" ]] || return 0
  [[ -L "$SITE_ROOT" ]] && return 0
  local preserve_dir
  preserve_dir="$RELEASES_ROOT/preserved-production-root-$("$DATE_BIN" -u +%Y%m%dT%H%M%SZ)"
  [[ ! -e "$preserve_dir" ]] || { EXIT_CODE=66 die "preserve target already exists: $preserve_dir"; }
  mv -T "$SITE_ROOT" "$preserve_dir"
  echo "Preserved existing non-symlink SITE_ROOT at $preserve_dir"
}

switch_symlink() {
  local stage="$1" target tmp
  target="$(public_dir_for "$stage")"
  tmp="$SITE_ROOT.next.$$"
  ln -s "$target" "$tmp"
  preserve_existing_real_root
  mv -Tf "$tmp" "$SITE_ROOT"
}

run_restart() {
  bash -c "$RESTART_CMD"
}

run_health() {
  bash -c "$HEALTH_CMD"
}

activate_verified_stage() {
  local stage="$1" before
  verify_baseline
  verify_release "$stage"
  before="$(current_target)"
  if [[ "$before" == "$(public_dir_for "$stage")" ]]; then
    echo "hello-along already on $stage"
    return 0
  fi

  switch_symlink "$stage"
  run_restart
  if ! run_health; then
    echo "Health check failed; reverting to previous verified target" >&2
    if [[ -n "$before" ]]; then
      ln -sfn "$before" "$SITE_ROOT"
    else
      ln -sfn "$(public_dir_for baseline)" "$SITE_ROOT"
    fi
    run_restart || true
    EXIT_CODE=68 die "activation failed for $stage"
  fi
  echo "Activated hello-along $stage"
}

rollback_to() {
  local stage="${1:-baseline}"
  verify_baseline
  verify_release "$stage"
  switch_symlink "$stage"
  run_restart
  run_health || { EXIT_CODE=68 die "rollback health check failed for $stage"; }
  echo "Rolled back hello-along to $stage"
}

main() {
  local command="${1:-activate}" target="${2:-}"
  mkdir -p "$(dirname "$LOCK_FILE")"
  exec 9>"$LOCK_FILE"
  flock -n 9 || { echo "Another activation is running"; exit 0; }

  case "$command" in
    activate)
      local stage
      stage="$(selected_stage)" || exit $?
      activate_verified_stage "$stage"
      ;;
    rollback)
      rollback_to "${target:-baseline}"
      ;;
    verify)
      verify_baseline
      for stage in "${STAGES[@]}"; do verify_release "$stage"; done
      echo "All hello-along releases verified"
      ;;
    selected-stage)
      selected_stage
      ;;
    *)
      EXIT_CODE=64 die "usage: $0 [activate|rollback [baseline|stage]|verify|selected-stage]"
      ;;
  esac
}

main "$@"
