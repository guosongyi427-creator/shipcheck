# Kane CLI flow — ShipCheck demo-repo journey

This is the plain-English objective Kane CLI runs against ShipCheck.
It verifies the app's core user journey end to end in a real browser.

## Objective (paste this as the `kane-cli run` argument)

Open the ShipCheck app. Confirm the page title "ShipCheck" and the heading
"Ship it — but check it first." are visible. Click the "Try demo repo"
button. Wait for the results to appear. Confirm a readiness score (a
percentage) and the text "Grade B" are visible, and that at least 10 check
rows are listed, including a "CI workflow" row marked Fail and a "README"
row marked Pass. Confirm the score summary reads "7 pass · 1 warn · 2 fail".

## How to run it

Serve the app first (from the repo root):

```sh
python3 -m http.server 8931
```

Then run Kane CLI (requires a TestMu AI account — see `kane/README.md`):

```sh
kane-cli run --headless --url http://localhost:8931/ \
  "Open the ShipCheck app. Confirm the page title \"ShipCheck\" and the heading \"Ship it — but check it first.\" are visible. Click the \"Try demo repo\" button. Wait for the results to appear. Confirm a readiness score (a percentage) and the text \"Grade B\" are visible, and that at least 10 check rows are listed, including a \"CI workflow\" row marked Fail and a \"README\" row marked Pass. Confirm the score summary reads \"7 pass · 1 warn · 2 fail\"."
```

Or use the wrapper script (it saves the run output and exits non-zero on failure,
so it can gate a deploy):

```sh
./kane/verify.sh
```

## Expected result

PASS. The demo repo is a built-in snapshot, so the flow is deterministic:
75%, Grade B, 7 pass / 1 warn / 2 fail, 10 check rows.

## What the loop looks like

1. The agent (me) builds the app.
2. Kane CLI runs this flow in a real browser and returns pass or fail.
3. If Kane fails, the agent reads the failure, fixes the app, and re-runs Kane.
4. Only when Kane passes does the app ship.

This is the closed loop the hackathon asks for: Kane's result feeds back
to the agent, and the agent acts on it. The run log is kept in
`kane/runs/` (one file per run) so the loop is auditable.
