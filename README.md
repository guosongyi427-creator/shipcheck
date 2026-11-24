# ShipCheck — Is your repo ready to ship?

ShipCheck is a tiny web app that runs ten deploy-readiness checks on any
public GitHub repo in seconds — README, license, CI, description, topics,
default branch, recent activity, homepage and open issues — and gives it a
score and a grade. No install, no sign-up, no backend: it calls the public
GitHub API straight from your browser.

It was built by an AI coding agent and verified end to end with Kane CLI
(TestMu AI) — see `kane/` for the loop. Built for the KaneCLI Online
Hackathon (TestMu AI, Nov 2026).

## Try it

No build step. Serve the folder and open it:

```sh
python3 -m http.server 8931
# open http://localhost:8931/
```

Or open `index.html` directly in a browser (the demo repo works offline;
live lookups need network for the GitHub API).

1. Type a repo as `owner/repo` (e.g. `facebook/react`) and click **Check repo**.
2. Or click **Try demo repo** — it checks `guosongyi427-creator/qnxbuild-lint`
   from a built-in snapshot, so it works even offline.

## The ten checks

| Check | What it looks for |
|---|---|
| README | `README.md` at the repo root |
| LICENSE | A detectable open-source license (SPDX id) |
| .gitignore | `.gitignore` at the repo root |
| CI workflow | At least one workflow in `.github/workflows` |
| Description | A one-line repo description |
| Topics | At least one topic |
| Default branch | `main` (or `master`) |
| Recent activity | Last push within 90 days (warn: 365) |
| Homepage | A homepage link |
| Open issues | ≤ 9 open issues (warn: ≤ 49) |

Scoring: Pass = 1 pt, Warn = 0.5 pt, Fail = 0 pts. Score = points ÷ 10.
Grades: A ≥ 90, B ≥ 75, C ≥ 60, D &lt; 60.

## The Kane loop (the point of this project)

The app is not just built by an agent — it is **verified by Kane CLI**,
and Kane's result feeds back to the agent:

```
agent builds → kane/verify.sh runs the flow in a real browser
            → PASS: ship it · FAIL: agent fixes it and re-runs
```

- Flow (plain English): `kane/flow.md`
- Runner (gates on the result, exits non-zero on fail): `kane/verify.sh`
- Setup + run logs: `kane/README.md`, `kane/runs/`

Run it:

```sh
python3 -m http.server 8931
./kane/verify.sh
```

Expected: PASS — 75%, Grade B, 7 pass / 1 warn / 2 fail.

## Why this exists

Every developer has shipped a repo that was missing a README, a license,
or CI — and only found out when someone else tried to use it. ShipCheck
is the 30-second check before you ship. And because the check itself is
verified by Kane in a real browser, you can trust the checker, not just
the code it checks.

## Files

- `index.html`, `style.css`, `app.js` — the app (no dependencies)
- `test-app.js` — a Node test for the demo-repo flow (run: `node test-app.js`)
- `kane/` — the Kane CLI verification loop
- `docs/` — demo video plan and public-post drafts (see `docs/`)

## License

MIT — see `LICENSE`.
