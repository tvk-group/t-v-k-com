(function () {
  const storageKey = "tvk-corporate-language";
  const langs = [
    ["tr", "Türkçe"],
    ["en", "English"],
    ["de", "Deutsch"],
    ["ar", "العربية"]
  ];

  function initLanguage() {
    const menu = document.getElementById("language-menu");
    if (!menu) return;

    menu.innerHTML = "";
    langs.forEach(([code, label]) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "language-option";
      btn.type = "button";
      btn.role = "menuitemradio";
      btn.dataset.lang = code;
      btn.textContent = label;
      btn.setAttribute("aria-checked", code === "tr" ? "true" : "false");
      li.appendChild(btn);
      menu.appendChild(li);
    });

    const selectors = document.querySelectorAll("[data-language-selector]");
    const status = document.getElementById("language-status");
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');

    function readSaved() {
      try { return localStorage.getItem(storageKey) || "tr"; } catch { return "tr"; }
    }

    function save(code) {
      try { localStorage.setItem(storageKey, code); } catch { /* noop */ }
    }

    function closeAll() {
      selectors.forEach((sel) => {
        sel.classList.remove("is-open");
        const toggle = sel.querySelector(".language-toggle");
        const menuEl = sel.querySelector(".language-menu");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        if (menuEl) menuEl.hidden = true;
      });
    }

    function pageMetaKey() {
      return document.body.dataset.metaDescription || "metaDescription";
    }

    function pageTitleKey() {
      return document.body.dataset.pageTitle || "pageTitle";
    }

    function setLanguage(code, label) {
      const copy = { ...TVK_TRANSLATIONS.en, ...(TVK_TRANSLATIONS[code] || {}) };
      document.documentElement.lang = code;
      document.documentElement.dir = code === "ar" ? "rtl" : "ltr";

      const titleKey = pageTitleKey();
      document.title = copy[titleKey] || copy.pageTitle;
      if (metaDescription) {
        const metaKey = pageMetaKey();
        metaDescription.setAttribute("content", copy[metaKey] || copy.metaDescription);
      }
      if (ogTitle) ogTitle.setAttribute("content", copy.ogTitle);
      if (ogDescription) ogDescription.setAttribute("content", copy.ogDescription);

      document.querySelectorAll("[data-i18n]").forEach((node) => {
        const val = copy[node.dataset.i18n];
        if (!val) return;
        if (node.tagName === "OPTION") node.textContent = val;
        else node.textContent = val;
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
        const val = copy[node.dataset.i18nPlaceholder];
        if (val) node.setAttribute("placeholder", val);
      });

      save(code);
      document.querySelectorAll(".language-option").forEach((opt) => {
        opt.setAttribute("aria-checked", String(opt.dataset.lang === code));
      });
      document.querySelectorAll("[data-selected-language]").forEach((n) => {
        n.textContent = code.toUpperCase();
      });
      if (status) status.textContent = `${label} selected.`;
    }

    const saved = readSaved();
    selectors.forEach((sel) => {
      const toggle = sel.querySelector(".language-toggle");
      const menuEl = sel.querySelector(".language-menu");
      const options = sel.querySelectorAll(".language-option");
      const savedOpt = sel.querySelector(`[data-lang="${saved}"]`);
      if (savedOpt) setLanguage(saved, savedOpt.textContent.trim());

      toggle?.addEventListener("click", () => {
        const open = menuEl.hidden;
        closeAll();
        sel.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        menuEl.hidden = !open;
        if (open) options[0]?.focus();
      });

      options.forEach((opt) => {
        opt.addEventListener("click", () => {
          setLanguage(opt.dataset.lang, opt.textContent.trim());
          closeAll();
          toggle?.focus();
        });
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-language-selector]")) closeAll();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  }

  function initReveal() {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const lang = (() => { try { return localStorage.getItem(storageKey) || "tr"; } catch { return "tr"; } })();
      const copy = { ...TVK_TRANSLATIONS.en, ...(TVK_TRANSLATIONS[lang] || {}) };

      const subject = encodeURIComponent("TVK Group Türkiye — " + (fd.get("interest") || "Inquiry"));
      const body = encodeURIComponent(
        `Name: ${fd.get("name")}\nCompany: ${fd.get("company")}\nRole: ${fd.get("role")}\nEmail: ${fd.get("email")}\nPhone: ${fd.get("phone")}\nCountry: ${fd.get("country")}\nArea of Interest: ${fd.get("interest")}\n\nMessage:\n${fd.get("message")}`
      );

      window.location.href = `mailto:contact@t-v-k.com?subject=${subject}&body=${body}`;

      const notice = document.getElementById("form-notice");
      if (notice) {
        notice.textContent = copy.formSuccess;
        notice.hidden = false;
        notice.classList.remove("sr-only");
        notice.style.marginTop = "16px";
        notice.style.fontSize = "14px";
        notice.style.color = "var(--muted)";
      }
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  initLanguage();
  initReveal();
  initContactForm();
})();
