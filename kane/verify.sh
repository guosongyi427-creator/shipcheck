#!/bin/bash
# verify.sh — run the Kane CLI flow against ShipCheck and gate on the result.
# Usage: ./kane/verify.sh [url]
#   url defaults to http://localhost:8931/ (serve with: python3 -m http.server 8931)
# Exits 0 when Kane passes, 1 when Kane fails (so a deploy script can block on it).
# Requires: kane-cli installed and logged in (see kane/README.md).
# Requires Google Chrome installed (Kane launches it; /usr/bin/google-chrome).
# NOTE: Kane CLI 0.10.8 fails with "Invalid port: ':1]'" when NO_PROXY contains
# IPv6 entries such as [::1] — its URL parser chokes on the brackets. Force a
# plain IPv4-only NO_PROXY here (verified 2026-11-24).
export NO_PROXY="localhost,127.0.0.1"
export no_proxy="localhost,127.0.0.1"
set -euo pipefail
cd "$(dirname "$0")/.."

URL="${1:-http://localhost:8931/}"
RUNS_DIR="kane/runs"
mkdir -p "$RUNS_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$RUNS_DIR/kane-run-$STAMP.log"

OBJECTIVE='Open the ShipCheck app. Confirm the page title "ShipCheck" and the heading "Ship it — but check it first." are visible. Click the "Try demo repo" button. Wait for the results to appear. Confirm a readiness score (a percentage) and the text "Grade B" are visible, and that at least 10 check rows are listed, including a "CI workflow" row marked Fail and a "README" row marked Pass. Confirm the score summary reads "7 pass · 1 warn · 2 fail".'

echo "ShipCheck — Kane verification"
echo "URL: $URL"
echo "Log: $OUT"
echo "---"

KANE_BIN="$(command -v kane-cli || echo /usr/lib/node_modules/@testmuai/kane-cli/bin/kane-cli.cjs)"
if [ -x "$KANE_BIN" ]; then
  KANE_CMD=("$KANE_BIN")
else
  KANE_CMD=(node "$KANE_BIN")
fi

# Run Kane headless against the app. --agent gives plain NDJSON output.
if "${KANE_CMD[@]}" run --headless --agent --url "$URL" "$OBJECTIVE" 2>&1 | tee "$OUT"; then
  # Kane exits 0 on pass. Also confirm the log contains a pass signal.
  if grep -qiE '"status":"pass"|PASS|passed' "$OUT"; then
    echo "KANE: PASS — ShipCheck verified. Safe to ship."
    exit 0
  fi
  echo "KANE: exit 0 but no pass signal found in the log — treating as inconclusive."
  exit 1
else
  echo "KANE: FAIL — see $OUT. Fix the app and re-run ./kane/verify.sh."
  exit 1
fi
