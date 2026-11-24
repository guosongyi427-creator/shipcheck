# Submission notes — ShipCheck (KaneCLI Online Hackathon)

## What is built and ready

- **App:** ShipCheck — a deploy-readiness checker for public GitHub repos
  (10 checks, score + grade). Pure client-side, no dependencies.
  Verified locally: demo-repo flow returns 75%, Grade B, 7 pass / 1 warn /
  2 fail, 10 check rows (`node test-app.js` — all assertions pass).
  Served and confirmed HTTP 200 on `http://localhost:8931/`.
- **Kane loop:** `kane/flow.md` (plain-English objective), `kane/verify.sh`
  (runner that gates on Kane's result, exits non-zero on fail),
  `kane/README.md` (setup + loop). Kane CLI v0.10.8 installed globally.
- **Kane CLI login DONE 2026-11-24 ~15:40 CST:** Songyi provided the
  Access Key from the LambdaTest account settings page; `kane-cli login
  --username 851284512gjsdml --access-key <key>` succeeded (Token valid).
  The Access Key value is NOT stored in files or memory — it lives only in
  the Kane CLI profile config.
- **Kane verification PASSED — twice, 2026-11-24 ~15:45 and ~15:47 CST:**
  `./kane/verify.sh` exit 0, `run_end status passed`. Kane confirmed in a
  real browser: title "ShipCheck", heading "Ship it — but check it first.",
  "Try demo repo" → Grade B, 10 check rows (README Pass, CI workflow Fail),
  score summary "7 pass · 1 warn · 2 fail". Two runs consumed 26.56 and
  18.91 credits. Evidence URLs are in the run logs under `kane/runs/`
  (test-manager.lambdatest.com share links).
- **Environment fixes needed to run Kane (recorded in verify.sh):**
  (1) Google Chrome was not installed — installed google-chrome-stable
  158.0.8127.88 via apt; (2) Kane CLI 0.10.8 fails with "Invalid port:
  ':1]'" when NO_PROXY contains IPv6 entries such as [::1] — verify.sh now
  forces `NO_PROXY=localhost,127.0.0.1`. The /opt/meta-chromium/chrome
  browser does NOT work for Kane (requires a Hatch WebGL domain policy).
- **Repo (local):** `~/workspace/kanecli-hackathon/`, git initialized
  2026-11-24, current commit `027b413` (after the Nov 12 cutoff — legal).
  **Not yet pushed to GitHub** (needs the repo to be created).
- **Demo video plan:** `docs/demo-video-plan.md` (~4 min, script + shot list).
  Can now be recorded — the real Kane runs exist (segments 3–4 use them).
- **Public post drafts:** `docs/public-posts.md` (Hacker News Show HN + X).
  Cannot be posted until the repo is public and the video is live
  (the drafts contain placeholder VIDEO_ID).

## What still needs Songyi (in order)

### 1. Claim the 10,000 free credits — REQUIRED TO BE SCORED
- Songyi registered on TestMu AI (Google login, account 851284512gjsdml)
  and the Access Key is in hand; Kane CLI is logged in and verification
  PASSED. **But the credit balance is only ~1,152, not 10,000** — the
  10,000 free credits have NOT been claimed yet. The hackathon rules say
  claiming the 10,000 free credits is required to be scored.
- Where to claim: **exact page is https://www.testmuai.com/kane-cli/#creditOffer** — the "Claim your credits →" link on https://www.kaneclihack.sh/ points there, and the page says "You can start free with 10,000 credits, valid for 30 days: claim them on this page." Open it logged in as 851284512gjsdml@gmail.com and click the claim button there (verified from the official pages 2026-11-24 ~15:53 CST; the button itself could not be tested while logged out). If the claim does not grant the 10,000 (the account only shows ~1,152 — the new-account grant may not have triggered because registration went through the LambdaTest/Google path rather than a fresh testmuai.com/register signup), fallback per the official FAQ: join the hackathon Slack from kaneclihack.sh and DM the organizers before the deadline — "Running low? DM us on Slack before the deadline."
- If the 10,000 credits cannot be claimed, the entry may still be
  submittable, but the scoring requirement would not be met — flag this to
  Songyi before submitting.

### 2. GitHub repo creation + upload
- Create a public repo named `shipcheck` on GitHub account
  `guosongyi427-creator`, then upload the 12 files from
  `~/workspace/kanecli-hackathon/` (the local commit is `fa63004`).
- The assistant can do the upload via browser (as with the QNX repo)
  once the repo exists. PAT push is broken — browser upload is the route.

### 3. YouTube demo video — publish as public
- Record the video from `docs/demo-video-plan.md` (needs the Kane run
  from step 1 first), then publish it as public on the 劲松 channel
  (the same channel used for the QNX video). Needs Songyi's YouTube
  account (same Google verification flow as before).

### 4. Two public posts
- Post the Hacker News Show HN draft and the X draft from
  `docs/public-posts.md`, from Songyi's accounts, once the repo is public
  and the video is live (replace VIDEO_ID first). Save both post URLs —
  they go in the submission form.

### 5. Submit on the hackathon site
- Submit at https://www.kaneclihack.sh/ (Submit button) with: the public
  GitHub repo URL, the public YouTube demo URL, and the two post URLs.
- Deadline: **Nov 26, 2026, 11:59 PM IST = Nov 27, 02:29 CST.**

## Risks / honest notes

- **Time is tight.** It is ~Nov 24 15:47 CST; the deadline is Nov 27 02:29
  CST (~35 hours). Remaining: claim 10,000 credits (Songyi), create the
  GitHub repo + upload, record + publish the demo video, post 2 public
  posts, submit. The video and posts are the longest poles now.
- **Kane verification PASSED (twice).** The "Verified" and "Closed loop"
  bars are now demonstrated with real Kane runs in a real browser.
- **10,000 credits NOT yet claimed.** Balance is ~1,152. This is the one
  scoring requirement still unmet — see step 1 above.
- **The demo repo is a snapshot, not live.** The demo path uses a built-in
  snapshot of qnxbuild-lint so Kane's flow is deterministic. The live path
  (real GitHub API) is the actual feature and works, but Kane's flow uses
  the demo path for determinism. This is stated in the app and the README.
- **Prize is small and the field is unknown.** $3,000 total. This is a
  quick, real shot — not a guaranteed win.
