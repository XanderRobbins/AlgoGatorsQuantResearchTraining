const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

let navigation = {};

try {
  navigation = require("../qd-navigation.js");
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") {
    throw error;
  }
}

test("every week link opens its dedicated page", () => {
  assert.equal(typeof navigation.renderQdNavigation, "function");

  const html = navigation.renderQdNavigation("/qd-week4.html");

  for (let week = 1; week <= 10; week += 1) {
    assert.match(html, new RegExp(`href="qd-week${week}\\.html"`));
  }

  assert.doesNotMatch(html, /qd\.html#week-/);
});

test("the current page is the only active navigation item", () => {
  assert.equal(typeof navigation.renderQdNavigation, "function");

  const weekHtml = navigation.renderQdNavigation("/qd-week7.html");
  const hubHtml = navigation.renderQdNavigation("/qd.html");

  assert.match(weekHtml, /href="qd-week7\.html" class="active"/);
  assert.equal((weekHtml.match(/class="active"/g) || []).length, 1);
  assert.match(hubHtml, /href="qd\.html" class="active"/);
  assert.equal((hubHtml.match(/class="active"/g) || []).length, 1);
});

test("every QD page mounts the shared navigation without legacy hash links", () => {
  const pageNames = [
    "qd.html",
    ...Array.from({ length: 10 }, (_, index) => `qd-week${index + 1}.html`),
  ];

  for (const pageName of pageNames) {
    const page = fs.readFileSync(path.join(__dirname, "..", pageName), "utf8");

    assert.match(
      page,
      /<div class="nav-links" data-qd-navigation>\s*<\/div>/,
      `${pageName} must provide the shared navigation mount`,
    );
    assert.match(
      page,
      /<script src="qd-navigation\.js" defer><\/script>/,
      `${pageName} must load the shared navigation module`,
    );
    assert.doesNotMatch(
      page,
      /qd\.html#week-/,
      `${pageName} must link directly to week pages`,
    );
  }
});
