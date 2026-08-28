const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const readWeek = (week) =>
  fs.readFileSync(path.join(__dirname, "..", `qd-week${week}.html`), "utf8");

const weeks = new Map([1, 2, 3, 4].map((week) => [week, readWeek(week)]));

const hasStage = (page, stage) =>
  page.includes(`data-onboarding-component="${stage}"`);

test("Weeks 1–4 each schedule one 60-minute meeting with Xander", () => {
  for (const [week, page] of weeks) {
    assert.match(
      page,
      /data-onboarding-component="xander-meeting"[^>]*data-duration-minutes="60"/,
      `Week ${week} is missing its 60-minute Xander meeting`,
    );
  }
});

test("Weeks 1–4 define required finance lectures without course homework", () => {
  for (const [week, page] of weeks) {
    const xanderCard = page.match(
      /<article[^>]*data-onboarding-component="xander-meeting"[^>]*>/,
    )?.[0];

    assert.ok(xanderCard, `Week ${week} is missing the Xander lecture card`);
    assert.match(xanderCard, /data-attendance-weeks="1-4"/);
    assert.match(xanderCard, /data-course-homework="not-required"/);
  }

  const week1Card = weeks
    .get(1)
    .match(/<article[^>]*data-onboarding-component="xander-meeting"[^>]*>/)[0];
  assert.match(week1Card, /data-week2-assignment="data-ngin"/);
  assert.match(week1Card, /data-week3-assignment="trade-ngin"/);
});

test("Week 1 establishes the core development infrastructure", () => {
  const page = weeks.get(1);
  for (const stage of [
    "github-access",
    "ticketing-access",
    "trade-ngin",
    "data-ngin",
  ]) {
    assert.ok(hasStage(page, stage), `Week 1 is missing ${stage}`);
  }
});

test("Week 2 finishes database setup before the data deliverable", () => {
  const page = weeks.get(2);
  assert.ok(hasStage(page, "database-setup"));
  assert.match(
    page,
    /data-onboarding-component="data-deliverable"[^>]*data-estimated-hours="1-2"/,
  );
});

test("Week 3 points to separately provided systems instructions", () => {
  assert.match(
    weeks.get(3),
    /data-onboarding-component="systems-deliverable"[^>]*data-instructions="provided-separately"/,
  );
});

test("Week 4 transitions analysts into Jira tickets", () => {
  assert.ok(hasStage(weeks.get(4), "jira-tickets"));
});

test("Weeks 1–4 share the onboarding presentation layer", () => {
  for (const [week, page] of weeks) {
    assert.match(
      page,
      /<link rel="stylesheet" href="qd-onboarding\.css">/,
      `Week ${week} is missing the shared onboarding stylesheet`,
    );
  }
});

test("Weeks 1–4 do not repeat the onboarding path at the bottom", () => {
  for (const [week, page] of weeks) {
    assert.doesNotMatch(
      page,
      /class="week-path"/,
      `Week ${week} still includes the bottom onboarding path`,
    );
  }
});
