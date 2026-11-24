# Kane CLI — the verification loop

ShipCheck is built by an AI coding agent and verified by Kane CLI.
This folder holds the loop: the plain-English flow, the runner script,
and the run logs.

## The loop

```
agent builds the app
      │
      ▼
kane/verify.sh  →  Kane CLI runs flow.md in a real browser
      │
      ├── PASS → ship it (the run log is kept in kane/runs/)
      │
      └── FAIL → the agent reads the failure, fixes the app,
                 and re-runs kane/verify.sh until it passes
```

That is the closed loop: Kane's result feeds back to the agent, and the
agent acts on it. Nothing ships while Kane is red.

## Setup (one-time)

1. **Register on TestMu AI** at https://www.testmuai.com and claim the
   10,000 free credits (required to be scored in the hackathon).
   Use the same email for TestMu AI and the hackathon submission.
2. **Install Kane CLI:**
   ```sh
   npm install -g @testmuai/kane-cli
   ```
3. **Log in.** Either OAuth (opens a browser):
   ```sh
   kane-cli login --oauth
   ```
   or with an access key from your TestMu AI account:
   ```sh
   kane-cli login --username <your-email> --access-key <your-access-key>
   ```
   Confirm with `kane-cli whoami` and `kane-cli balance` (should show 10,000 credits).

## Run the verification

```sh
# from the repo root — serve the app first
python3 -m http.server 8931

# then run the loop (headless, saves a log, exits non-zero on fail)
./kane/verify.sh
```

The flow is in `kane/flow.md`. The expected result is PASS:
75%, Grade B, 7 pass / 1 warn / 2 fail, 10 check rows.

## Run logs

Each run writes a timestamped log to `kane/runs/`. Keep them — they are
the audit trail that Kane actually ran and what it found.
