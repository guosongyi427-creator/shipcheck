# Demo video plan — ShipCheck (KaneCLI Online Hackathon)

Target length: **3–5 minutes** (aim ~4:00). Public on YouTube.
Narration: English voiceover. All footage is real (screen recordings of the
actual app and the actual Kane CLI run — nothing faked).

## Script (with timings)

### 1. Hook (0:00–0:30)
> "Every developer has shipped a repo that was missing a README, a license,
> or CI — and only found out when someone else tried to use it. ShipCheck
> is the thirty-second check before you ship. And it is checked by Kane."

Show: the ShipCheck landing page.

### 2. The app (0:30–1:30)
> "Paste any public GitHub repo. ShipCheck runs ten deploy-readiness
> checks in seconds — README, license, CI, description, topics, branch,
> activity, homepage, open issues — and gives it a score and a grade."

Show (screen recording, real):
- Type `facebook/react` (or any public repo), click **Check repo**, results appear.
- Click **Try demo repo** → the qnxbuild-lint snapshot → **75%, Grade B,
  7 pass · 1 warn · 2 fail** → point at the two red rows (CI workflow,
  Topics) and the yellow one (Homepage).

### 3. The Kane loop (1:30–3:00)
> "But here is the point: ShipCheck is not just built by an AI agent. It
> is verified by Kane CLI — in a real browser, from a plain-English flow.
> And Kane's result feeds back to the agent. If Kane fails, the agent fixes
> it and re-runs. Nothing ships while Kane is red."

Show (screen recording, real):
- `kane/flow.md` — the plain-English objective.
- Terminal: `./kane/verify.sh` running → Kane driving a real browser →
  **PASS**.
- The loop diagram (from `kane/README.md`).

### 4. The closed loop in action (3:00–3:45)
> "Here is the loop catching something real."

Show (real Kane run log):
- A Kane run that FAILED (the failure Kane caught), the one-line fix the
  agent made in response, then the re-run → **PASS**.
- The run logs in `kane/runs/` as the audit trail.

> Note for the recorder: this segment must use a genuine Kane failure and
> fix from the `kane/runs/` logs. Do not stage a fake failure. If Kane
> passes on the first run, show the first passing run and narrate the loop
> from `kane/README.md` instead — and say so on camera.

### 5. Closing (3:45–4:00)
> "ShipCheck — built by an AI coding agent, verified by Kane CLI.
> Repo link is in the description. Ship it — but check it first."

Show: repo URL `https://github.com/guosongyi427-creator/shipcheck` and the
app's closing screen.

## Shot list (what to record)

1. ShipCheck landing page (full screen, 1280×720).
2. Live repo check (type `facebook/react`, click Check, results).
3. Demo repo click → 75% / Grade B / 7-1-2 summary, scroll the 10 rows.
4. `kane/flow.md` open in an editor.
5. Terminal running `./kane/verify.sh` → Kane browser run → PASS.
6. `kane/runs/` folder showing the timestamped logs.
7. Closing card with the repo URL.

## Status

- App: built and tested (demo flow verified in Node: 75%, Grade B).
- Kane run: **BLOCKED until a TestMu AI account is registered and Kane CLI
  is logged in** (see `submission-notes.md`). The video cannot be recorded
  until the first real Kane run exists, because segment 3–4 must show it.
