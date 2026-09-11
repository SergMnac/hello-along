#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEDULER="$REPO_ROOT/deploy/gw-cl01/along-stage-scheduler.sh"
EVIDENCE_DIR="${1:-$REPO_ROOT/artifacts/release-preflight}"
mkdir -p "$EVIDENCE_DIR"
EVIDENCE="$EVIDENCE_DIR/scheduler-rehearsal.txt"
TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/hello-along-rehearsal.XXXXXX")"

cleanup() {
  rm -rf "$TMP_ROOT"
}
trap cleanup EXIT

log() {
  echo "$*" | tee -a "$EVIDENCE" >/dev/null
}

sha_manifest() {
  local release_root="$1"
  (cd "$release_root" && find public -type f -print0 | sort -z | xargs -0 sha256sum > public.sha256)
}

make_release() {
  local stage="$1"
  local release_root="$TMP_ROOT/releases/$stage"
  mkdir -p "$release_root/public"
  printf '<!doctype html><title>%s</title><h1>%s</h1>\n' "$stage" "$stage" > "$release_root/public/index.html"
  if [[ "$stage" != "baseline" ]]; then
    cat > "$release_root/stage-manifest.json" <<JSON
{
  "stageId": "$stage",
  "unlockAt": "2026-09-10T00:00:00Z",
  "sourceCommit": "testcommit",
  "contentHash": "$stage"
}
JSON
  fi
  sha_manifest "$release_root"
}

run_scheduler() {
  SITE_ROOT="$TMP_ROOT/site/hello-along" \
  RELEASES_ROOT="$TMP_ROOT/releases" \
  PIN_FILE="$TMP_ROOT/pin" \
  LOCK_FILE="$TMP_ROOT/lock/hello.lock" \
  EXPECTED_SOURCE_COMMIT="testcommit" \
  RESTART_CMD="$TMP_ROOT/bin/restart" \
  HEALTH_CMD="$TMP_ROOT/bin/health" \
  NOW_EPOCH="${NOW_EPOCH:-1788998400}" \
  bash "$SCHEDULER" "$@"
}

assert_link() {
  local expected="$1"
  local actual
  actual="$(readlink "$TMP_ROOT/site/hello-along")"
  [[ "$actual" == "$TMP_ROOT/releases/$expected/public" ]] || {
    echo "Expected SITE_ROOT -> $expected, got $actual" >&2
    exit 1
  }
}

: > "$EVIDENCE"
log "rehearsal_root=$TMP_ROOT"

mkdir -p "$TMP_ROOT/bin" "$TMP_ROOT/site" "$TMP_ROOT/releases"
cat > "$TMP_ROOT/bin/restart" <<'SH'
#!/usr/bin/env bash
echo restart >> "$TMP_ROOT_LOG"
exit 0
SH
cat > "$TMP_ROOT/bin/health" <<'SH'
#!/usr/bin/env bash
if [[ -f "$TMP_ROOT_FAIL_HEALTH" ]]; then
  echo health-fail >> "$TMP_ROOT_LOG"
  exit 1
fi
echo health-ok >> "$TMP_ROOT_LOG"
exit 0
SH
chmod +x "$TMP_ROOT/bin/restart" "$TMP_ROOT/bin/health"
export TMP_ROOT_LOG="$TMP_ROOT/commands.log"
export TMP_ROOT_FAIL_HEALTH="$TMP_ROOT/fail-health"

make_release baseline
for stage in t-21 t-18 t-15 t-12 t-9 t-6 t-3 t-0; do make_release "$stage"; done

mkdir -p "$TMP_ROOT/site/hello-along"
printf '<!doctype html><title>existing production</title>\n' > "$TMP_ROOT/site/hello-along/index.html"
baseline_hash="$(sha256sum "$TMP_ROOT/releases/baseline/public/index.html" | awk '{print $1}')"
stage_hash="$(sha256sum "$TMP_ROOT/releases/t-21/public/index.html" | awk '{print $1}')"
log "baseline_hash=$baseline_hash"
log "stage_t21_hash=$stage_hash"

log "case=first_activation_preserves_existing_root"
NOW_EPOCH=1788998400 run_scheduler activate | tee -a "$EVIDENCE" >/dev/null
assert_link t-21
preserved_count="$(find "$TMP_ROOT/releases" -maxdepth 1 -type d -name 'preserved-production-root-*' | wc -l | tr -d ' ')"
[[ "$preserved_count" == "1" ]] || { echo "expected one preserved production root" >&2; exit 1; }
log "after_first_target=$(readlink "$TMP_ROOT/site/hello-along")"

log "case=idempotent_repeat"
NOW_EPOCH=1788998400 run_scheduler activate | tee -a "$EVIDENCE" >/dev/null
assert_link t-21

log "case=stage_advance_after_missed_boundary"
NOW_EPOCH=1790294400 run_scheduler activate | tee -a "$EVIDENCE" >/dev/null
assert_link t-6
log "after_advance_target=$(readlink "$TMP_ROOT/site/hello-along")"

log "case=future_pin_rejection"
printf 't-0\n' > "$TMP_ROOT/pin"
if NOW_EPOCH=1790294400 run_scheduler activate >> "$EVIDENCE" 2>&1; then
  echo "future pin unexpectedly succeeded" >&2
  exit 1
fi
rm -f "$TMP_ROOT/pin"
assert_link t-6

log "case=tampered_artifact_rejection"
printf 'tamper\n' >> "$TMP_ROOT/releases/t-9/public/index.html"
if NOW_EPOCH=1790035200 run_scheduler activate >> "$EVIDENCE" 2>&1; then
  echo "tampered artifact unexpectedly succeeded" >&2
  exit 1
fi
assert_link t-6
make_release t-9

log "case=health_failure_rollback"
touch "$TMP_ROOT/fail-health"
if NOW_EPOCH=1790035200 run_scheduler activate >> "$EVIDENCE" 2>&1; then
  echo "health failure unexpectedly succeeded" >&2
  exit 1
fi
rm -f "$TMP_ROOT/fail-health"
assert_link t-6

log "case=successful_rollback_to_baseline"
run_scheduler rollback baseline | tee -a "$EVIDENCE" >/dev/null
assert_link baseline
log "after_rollback_target=$(readlink "$TMP_ROOT/site/hello-along")"

log "case=verify_all_releases"
run_scheduler verify | tee -a "$EVIDENCE" >/dev/null

log "command_log=$(tr '\n' ',' < "$TMP_ROOT/commands.log")"
log "result=OK"
echo "$EVIDENCE"
