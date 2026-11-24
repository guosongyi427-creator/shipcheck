// Minimal DOM-stub test for ShipCheck app.js.
// Verifies the demo-repo flow produces the expected score/grade.
const fs = require("fs");

function makeEl(id) {
  return {
    id,
    textContent: "",
    className: "",
    innerHTML: "",
    hidden: true,
    disabled: false,
    value: "",
    _listeners: {},
    addEventListener(ev, fn) { this._listeners[ev] = fn; },
    click() { if (this._listeners.click) this._listeners.click(); },
    focus() {},
    scrollIntoView() {},
  };
}

const els = {};
["repo-input", "check-btn", "demo-btn", "status", "results", "score-ring",
 "score-value", "grade", "repo-name", "repo-desc", "score-summary", "score-note",
 "checks-list"].forEach((id) => { els[id] = makeEl(id); });

global.document = {
  getElementById: (id) => els[id],
  createElement: () => {
    const el = makeEl("li");
    el.className = "";
    return el;
  },
};
// createElement returns an object that needs appendChild support on the list
els["checks-list"].appendChild = function (child) {
  this.children = this.children || [];
  this.children.push(child);
};

const src = fs.readFileSync("/home/hatch/workspace/kanecli-hackathon/app.js", "utf8");
eval(src);

// Simulate clicking "Try demo repo"
els["demo-btn"].click();

console.log("repo-name:", els["repo-name"].textContent);
console.log("score-value:", els["score-value"].textContent);
console.log("grade:", els["grade"].textContent);
console.log("score-summary:", els["score-summary"].textContent);
console.log("score-note:", els["score-note"].textContent);
console.log("results hidden:", els["results"].hidden);
console.log("check rows rendered:", (els["checks-list"].children || []).length);
(els["checks-list"].children || []).forEach((row) => {
  const m = row.innerHTML.match(/check-name">([^<]+)<\/span>.*?check-status (\w+)">(\w+)<\/span>.*?check-detail">([^<]+)</s);
  if (m) console.log(" -", m[1], "|", m[3], "|", m[4].slice(0, 70));
});

// Assertions
const assert = require("assert");
assert.strictEqual(els["score-value"].textContent, "75%", "expected 75%");
assert.strictEqual(els["grade"].textContent, "Grade B", "expected Grade B");
assert.strictEqual(els["score-summary"].textContent, "7 pass · 1 warn · 2 fail", "expected 7/1/2");
assert.strictEqual((els["checks-list"].children || []).length, 10, "expected 10 check rows");
assert.strictEqual(els["results"].hidden, false, "results should be visible");
console.log("\nALL ASSERTIONS PASSED");
