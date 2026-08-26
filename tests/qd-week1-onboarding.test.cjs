const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const page = fs.readFileSync(
  path.join(__dirname, "..", "qd-week1.html"),
  "utf8",
);

test("Week 1 links every active development repository", () => {
  const repositoryUrls = [
    "https://github.com/AlgoGators/algogators",
    "https://github.com/AlgoGators/AlgoTerminal",
    "https://github.com/AlgoGators/AlgoLens",
    "https://github.com/AlgoGators/algosystem",
    "https://github.com/AlgoGators/data-ngin",
    "https://github.com/AlgoGators/trade-ngin",
  ];

  for (const repositoryUrl of repositoryUrls) {
    assert.match(
      page,
      new RegExp(
        `href="${repositoryUrl}" target="_blank" rel="noopener"`,
      ),
    );
    assert.match(
      page,
      new RegExp(
        `href="${repositoryUrl}#readme" target="_blank" rel="noopener"`,
      ),
    );
  }

  assert.equal((page.match(/class="repo-card"/g) || []).length, 6);
});

test("Week 1 covers organization onboarding without requesting API keys", () => {
  assert.match(page, /Administrative Setup/);
  assert.match(page, /Join the AlgoGators GitHub organization/);
  assert.match(page, /Get all six active repositories running locally/);
  assert.match(page, /Jira/);
  assert.match(page, /WhatsApp/);
  assert.match(page, /Discord/);
  assert.match(page, /John Riley/);
  assert.match(page, /A repository counts as complete/);
  assert.doesNotMatch(page, /Obtain API keys/i);
});

test("each repository has a concrete local verification path", () => {
  const repositoryCards = Array.from(
    page.matchAll(/<article class="repo-card">([\s\S]*?)<\/article>/g),
    (match) => match[1],
  );
  const verificationCommands = new Map([
    ["algogators", "just check-paths"],
    ["AlgoTerminal", "algoterminal"],
    ["AlgoLens", "npm run dev"],
    ["algosystem", "algosystem benchmarks"],
    ["data-ngin", "poetry run pytest tests/"],
    ["trade-ngin", "ctest --test-dir build"],
  ]);

  for (const [repository, command] of verificationCommands) {
    const card = repositoryCards.find((candidate) =>
      candidate.includes(`>${repository}</a>`),
    );
    assert.ok(card, `missing setup card for ${repository}`);
    assert.ok(
      card.includes(command),
      `${repository} card is missing verification command: ${command}`,
    );
  }
});
