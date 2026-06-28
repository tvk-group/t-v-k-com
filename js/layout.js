(function () {
  const NAV_ITEMS = [
    { key: "navHome", href: "/" },
    { key: "navCorporate", href: "/corporate" },
    { key: "navBusiness", href: "/business-areas" },
    { key: "navTechnology", href: "/technology-solutions" },
    { key: "navEnergy", href: "/energy-infrastructure" },
    { key: "navTrade", href: "/international-trade" },
    { key: "navPartnerships", href: "/strategic-partnerships" },
    { key: "navInsights", href: "/insights" },
    { key: "navContact", href: "/contact", cta: true }
  ];

  const FOOTER_COLS = [
    {
      titleKey: "footerColCompany",
      links: [
        { key: "navCorporate", href: "/corporate" },
        { key: "navBusiness", href: "/business-areas" },
        { key: "navPartnerships", href: "/strategic-partnerships" }
      ]
    },
    {
      titleKey: "footerColOperations",
      links: [
        { key: "navTechnology", href: "/technology-solutions" },
        { key: "navEnergy", href: "/energy-infrastructure" },
        { key: "navTrade", href: "/international-trade" }
      ]
    },
    {
      titleKey: "footerColConnect",
      links: [
        { key: "navInsights", href: "/insights" },
        { key: "navContact", href: "/contact" },
        { key: "footerAppLink", href: "/app" },
        { key: "footerGroupLink", href: "https://tvk.group", external: true }
      ]
    }
  ];

  function currentPath() {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    return path;
  }

  function isActive(href) {
    const path = currentPath();
    if (href === "/") return path === "/";
    return path === href || path.startsWith(href + "/");
  }

  function renderHeader() {
    const path = currentPath();
    const links = NAV_ITEMS.map((item) => {
      const active = isActive(item.href) ? " is-active" : "";
      const cls = item.cta ? "cta" : "";
      return `<a href="${item.href}" class="${cls}${active}" data-i18n="${item.key}"></a>`;
    }).join("");

    return `
      <a class="skip-link" href="#main" data-i18n="skipLink">Skip to content</a>
      <div class="topbar">
        <div class="wrap topbar-inner">
          <span data-i18n="topbarPrimary"></span>
          <span data-i18n="topbarSecondary"></span>
        </div>
      </div>
      <header class="nav" id="nav">
        <div class="wrap nav-inner">
          <a class="brand" href="/" aria-label="TVK Group Türkiye">
            <span class="mark" aria-hidden="true">TVK</span>
            <span>
              <strong>TVK Group</strong>
              <small data-i18n="brandSub"></small>
            </span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" data-nav-toggle>
            <span data-i18n="navMenu">Menu</span>
          </button>
          <nav class="links" id="main-nav" aria-label="Main navigation">${links}</nav>
          <div class="language-selector" data-language-selector>
            <button class="language-toggle" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="language-menu" aria-label="Select language">
              <span data-i18n="languageLabel">Language</span>
              <span class="selected-language" data-selected-language>TR</span>
            </button>
            <ul class="language-menu" id="language-menu" role="menu" hidden></ul>
          </div>
        </div>
      </header>
    `;
  }

  function renderFooter() {
    const cols = FOOTER_COLS.map((col) => {
      const links = col.links.map((link) => {
        const ext = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<li><a href="${link.href}"${ext} data-i18n="${link.key}"></a></li>`;
      }).join("");
      return `<div><h4 data-i18n="${col.titleKey}"></h4><ul>${links}</ul></div>`;
    }).join("");

    return `
      <footer class="footer">
        <div class="wrap">
          <div class="footer-grid">
            <div class="footer-brand">
              <strong>TVK Group</strong>
              <p data-i18n="footerBrandText"></p>
            </div>
            ${cols}
          </div>
          <div class="footer-bottom">
            <small>© <span id="year"></span> <span data-i18n="footerRights"></span></small>
            <small data-i18n="footerLegalName"></small>
          </div>
        </div>
      </footer>
      <p class="sr-only" aria-live="polite" id="language-status"></p>
    `;
  }

  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = renderHeader();
  if (footerEl) footerEl.innerHTML = renderFooter();

  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
