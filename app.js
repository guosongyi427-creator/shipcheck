// ShipCheck — deploy-readiness checker for public GitHub repos.
// Pure client-side. Live lookups use the public GitHub API (no auth).
// The demo repo uses a built-in snapshot (taken 2026-11-24) so the flow
// works deterministically, even offline or when the API rate-limits.

(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var input = $("repo-input");
  var checkBtn = $("check-btn");
  var demoBtn = $("demo-btn");
  var statusEl = $("status");
  var resultsEl = $("results");

  // Built-in snapshot of guosongyi427-creator/qnxbuild-lint,
  // captured from the public GitHub API on 2026-11-24.
  var DEMO_SNAPSHOT = {
    full_name: "guosongyi427-creator/qnxbuild-lint",
    description: "qnxbuild-lint: a static checker for QNX 8.0 project build files (QNX Global Hackathon entry)",
    homepage: null,
    default_branch: "main",
    pushed_at: "2026-11-24T05:38:30Z",
    license: { spdx_id: "MIT", name: "MIT License" },
    topics: [],
    open_issues_count: 0,
    root_files: [".gitignore", "LICENSE", "README.md", "docs", "qnxbuild-lint", "qnxbuild_lint.py", "tests"],
    workflow_count: 0,
    snapshot: true
  };

  var CHECKS = [
    { id: "readme", name: "README", hint: "A README tells people what the project is and how to use it." },
    { id: "license", name: "LICENSE", hint: "An open-source license tells people they may use, copy and modify the code." },
    { id: "gitignore", name: ".gitignore", hint: "Keeps build artefacts and secrets out of the repo." },
    { id: "ci", name: "CI workflow", hint: "A workflow in .github/workflows runs tests on every push." },
    { id: "description", name: "Description", hint: "A one-line description shows up in search and on the repo page." },
    { id: "topics", name: "Topics", hint: "Topics help people discover the repo." },
    { id: "branch", name: "Default branch", hint: "main (or master) is the convention tools and contributors expect." },
    { id: "activity", name: "Recent activity", hint: "A repo pushed in the last 90 days looks alive." },
    { id: "homepage", name: "Homepage", hint: "A homepage link points people at docs or a demo." },
    { id: "issues", name: "Open issues", hint: "A small open-issue count means the backlog is under control." }
  ];

  function daysSince(iso) {
    return (Date.now() - new Date(iso).getTime()) / 86400000;
  }

  function hasFile(files, name) {
    return files.some(function (f) { return f.toLowerCase() === name.toLowerCase(); });
  }

  // Evaluate the ten checks against a repo record.
  // Returns { checks: [{id,name,detail,status,hint}], points, score, grade }
  function evaluate(repo) {
    var files = repo.root_files || [];
    var out = [];
    function add(id, status, detail) {
      var def = CHECKS.filter(function (c) { return c.id === id; })[0];
      out.push({ id: id, name: def.name, hint: def.hint, status: status, detail: detail });
    }

    add("readme",
      hasFile(files, "README.md") ? "pass" : "fail",
      hasFile(files, "README.md") ? "README.md found at the repo root." : "No README.md at the repo root.");
    add("license",
      repo.license && repo.license.spdx_id && repo.license.spdx_id !== "NOASSERTION" ? "pass" : "fail",
      repo.license && repo.license.spdx_id && repo.license.spdx_id !== "NOASSERTION"
        ? "Licensed under " + repo.license.name + " (" + repo.license.spdx_id + ")."
        : "No detectable open-source license.");
    add("gitignore",
      hasFile(files, ".gitignore") ? "pass" : "fail",
      hasFile(files, ".gitignore") ? ".gitignore found at the repo root." : "No .gitignore at the repo root.");
    add("ci",
      repo.workflow_count > 0 ? "pass" : "fail",
      repo.workflow_count > 0
        ? repo.workflow_count + " workflow(s) in .github/workflows."
        : "No workflows in .github/workflows — nothing runs on push.");
    add("description",
      repo.description ? "pass" : "fail",
      repo.description ? "Description set." : "No description set on the repo.");
    add("topics",
      (repo.topics || []).length > 0 ? "pass" : "fail",
      (repo.topics || []).length > 0
        ? (repo.topics || []).length + " topic(s): " + repo.topics.join(", ") + "."
        : "No topics set — the repo is harder to discover.");
    add("branch",
      repo.default_branch === "main" || repo.default_branch === "master" ? "pass" : "fail",
      "Default branch is \"" + repo.default_branch + "\".");
    var d = daysSince(repo.pushed_at);
    add("activity",
      d <= 90 ? "pass" : (d <= 365 ? "warn" : "fail"),
      "Last push " + Math.floor(d) + " day(s) ago (" + repo.pushed_at.slice(0, 10) + ").");
    add("homepage",
      repo.homepage ? "pass" : "warn",
      repo.homepage ? "Homepage: " + repo.homepage : "No homepage link set.");
    add("issues",
      repo.open_issues_count <= 9 ? "pass" : (repo.open_issues_count <= 49 ? "warn" : "fail"),
      repo.open_issues_count + " open issue(s).");

    var points = out.reduce(function (sum, c) {
      return sum + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0);
    }, 0);
    var score = Math.round((points / CHECKS.length) * 100);
    var grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D";
    return { checks: out, points: points, score: score, grade: grade };
  }

  function render(repo, result) {
    $("repo-name").textContent = repo.full_name + (repo.snapshot ? "  (demo snapshot)" : "");
    $("repo-desc").textContent = repo.description || "No description.";
    $("score-value").textContent = result.score + "%";
    $("grade").textContent = "Grade " + result.grade;
    var passed = result.checks.filter(function (c) { return c.status === "pass"; }).length;
    var warned = result.checks.filter(function (c) { return c.status === "warn"; }).length;
    var failed = result.checks.filter(function (c) { return c.status === "fail"; }).length;
    $("score-summary").textContent = passed + " pass · " + warned + " warn · " + failed + " fail";
    var ring = $("score-ring");
    ring.className = "score-ring" + (result.score < 60 ? " low" : result.score < 75 ? " mid" : "");
    $("score-note").textContent =
      result.grade === "A" ? "Ready to ship. Nice work." :
      result.grade === "B" ? "Almost there — fix the red rows and re-check." :
      result.grade === "C" ? "Shippable, but the red rows will bite you." :
      "Not ready. Fix the red rows before you deploy.";
    var list = $("checks-list");
    list.innerHTML = "";
    result.checks.forEach(function (c) {
      var li = document.createElement("li");
      li.className = "check-row";
      var badge = c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "✕";
      li.innerHTML =
        '<span class="check-badge ' + c.status + '" aria-hidden="true">' + badge + "</span>" +
        '<div class="check-body">' +
          '<div><span class="check-name">' + c.name + '</span> ' +
          '<span class="check-status ' + c.status + '">' + c.status + "</span></div>" +
          '<div class="check-detail">' + c.detail + " " + c.hint + "</div>" +
        "</div>";
      list.appendChild(li);
    });
    resultsEl.hidden = false;
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.className = "status" + (isError ? " error" : "");
  }

  function setBusy(busy) {
    checkBtn.disabled = busy;
    demoBtn.disabled = busy;
    checkBtn.textContent = busy ? "Checking…" : "Check repo";
  }

  function runDemo() {
    setStatus("Showing the demo repo from a built-in snapshot.");
    render(DEMO_SNAPSHOT, evaluate(DEMO_SNAPSHOT));
  }

  function parseRepo(text) {
    var t = text.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
    var parts = t.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
    return { owner: parts[0], repo: parts[1] };
  }

  function fetchJSON(url) {
    return fetch(url, { headers: { "Accept": "application/vnd.github+json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API returned " + res.status);
        return res.json();
      });
  }

  function checkLive(owner, repo) {
    setBusy(true);
    setStatus("Fetching " + owner + "/" + repo + " from GitHub…");
    var base = "https://api.github.com/repos/" + owner + "/" + repo;
    Promise.all([
      fetchJSON(base),
      fetchJSON(base + "/contents/").catch(function () { return []; }),
      fetchJSON(base + "/actions/workflows").catch(function () { return { total_count: 0 }; })
    ]).then(function (parts) {
      var meta = parts[0], contents = parts[1], workflows = parts[2];
      var record = {
        full_name: meta.full_name,
        description: meta.description,
        homepage: meta.homepage,
        default_branch: meta.default_branch,
        pushed_at: meta.pushed_at,
        license: meta.license ? { spdx_id: meta.license.spdx_id, name: meta.license.name } : null,
        topics: meta.topics || [],
        open_issues_count: meta.open_issues_count,
        root_files: Array.isArray(contents) ? contents.map(function (c) { return c.name; }) : [],
        workflow_count: workflows.total_count || 0
      };
      setStatus("Checked " + record.full_name + " live from the GitHub API.");
      render(record, evaluate(record));
    }).catch(function (err) {
      setStatus("Could not check that repo: " + err.message + ". Check the owner/repo spelling, or try the demo repo.", true);
    }).finally(function () { setBusy(false); });
  }

  checkBtn.addEventListener("click", function () {
    var parsed = parseRepo(input.value);
    if (!parsed) {
      setStatus("Enter a repo as owner/repo — e.g. facebook/react.", true);
      input.focus();
      return;
    }
    checkLive(parsed.owner, parsed.repo);
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkBtn.click();
  });

  demoBtn.addEventListener("click", runDemo);
})();
