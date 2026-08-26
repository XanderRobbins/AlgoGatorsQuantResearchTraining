(function initializeQdNavigation(root, createNavigation) {
  const navigation = createNavigation();

  if (typeof module === "object" && module.exports) {
    module.exports = navigation;
  }

  if (root && root.document) {
    navigation.mountQdNavigation(root.document, root.location.pathname);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createNavigation() {
  function currentWeek(pathname) {
    const filename = String(pathname || "").split("/").pop();
    const match = /^qd-week(10|[1-9])\.html$/.exec(filename);

    return match ? Number(match[1]) : null;
  }

  function renderQdNavigation(pathname) {
    const activeWeek = currentWeek(pathname);
    const links = [];

    if (activeWeek === null) {
      links.push('<a href="new-analyst.html">← Teams</a>');
    }

    links.push(
      `<a href="qd.html"${activeWeek === null ? ' class="active"' : ""}>Home</a>`,
    );

    for (let week = 1; week <= 10; week += 1) {
      const activeClass = week === activeWeek ? ' class="active"' : "";
      links.push(
        `<a href="qd-week${week}.html"${activeClass}>W${week}</a>`,
      );
    }

    return links.join("\n");
  }

  function mountQdNavigation(document, pathname) {
    const navigationHtml = renderQdNavigation(pathname);

    document.querySelectorAll("[data-qd-navigation]").forEach((element) => {
      element.innerHTML = navigationHtml;
    });
  }

  return { currentWeek, mountQdNavigation, renderQdNavigation };
});
