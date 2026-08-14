(function () {
  const storageKey = "tvk-app-language";
  let deferredPrompt = null;

  function readLang() {
    try { return localStorage.getItem(storageKey) || "tr"; } catch { return "tr"; }
  }

  function saveLang(code) {
    try { localStorage.setItem(storageKey, code); } catch { /* noop */ }
  }

  function t(key) {
    const lang = readLang();
    return (TVK_APP_TRANSLATIONS[lang] || TVK_APP_TRANSLATIONS.tr)[key]
      || TVK_APP_TRANSLATIONS.en[key]
      || key;
  }

  function applyTranslations() {
    const lang = readLang();
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const val = t(el.dataset.i18n);
      if (val) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const val = t(el.dataset.i18nPlaceholder);
      if (val) el.setAttribute("placeholder", val);
    });
    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) langBtn.textContent = lang.toUpperCase();
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function switchView(viewId) {
    document.querySelectorAll(".app-view").forEach((v) => v.classList.remove("is-active"));
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("is-active"));
    const view = document.getElementById(`view-${viewId}`);
    const tab = document.querySelector(`[data-view="${viewId}"]`);
    if (view) view.classList.add("is-active");
    if (tab) tab.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function initTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const view = link.dataset.nav;
        if (view.startsWith("http") || view.startsWith("/") && !view.startsWith("/app")) return;
        e.preventDefault();
        switchView(view);
      });
    });
  }

  function initLanguage() {
    const btn = document.getElementById("lang-toggle");
    btn?.addEventListener("click", () => {
      const next = readLang() === "tr" ? "en" : "tr";
      saveLang(next);
      applyTranslations();
    });
    applyTranslations();
  }

  function initInstall() {
    const banner = document.getElementById("install-banner");
    const bannerBtn = document.getElementById("install-banner-btn");
    const headerBtn = document.getElementById("install-header-btn");

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;

    if (isStandalone && banner) banner.hidden = true;

    function triggerInstall() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(() => { deferredPrompt = null; });
        return;
      }
      switchView("more");
      document.getElementById("install-guide")?.scrollIntoView({ behavior: "smooth" });
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (headerBtn) headerBtn.hidden = false;
    });

    bannerBtn?.addEventListener("click", triggerInstall);
    headerBtn?.addEventListener("click", triggerInstall);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => { /* noop */ });
    }
  }

  function initContactForm() {
    const form = document.getElementById("app-contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const subject = encodeURIComponent("TVK Group Türkiye — " + (fd.get("interest") || "Inquiry"));
      const body = encodeURIComponent(
        `Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\nCompany: ${fd.get("company")}\nInterest: ${fd.get("interest")}\n\n${fd.get("message")}`
      );
      window.location.href = `mailto:contact@t-v-k.com?subject=${subject}&body=${body}`;
      showToast(t("formSuccess"));
    });
  }

  initTabs();
  initLanguage();
  initInstall();
  initContactForm();
})();


(function loadSovraAdvisor() {
  if (document.getElementById('sovra-ai-advisor-loader')) return;
  var script = document.createElement('script');
  script.id = 'sovra-ai-advisor-loader';
  script.src = 'https://www.sovra.network/assets/sovra-advisor.js';
  script.setAttribute('data-api', 'https://www.sovra.network/api/advisor');
  script.setAttribute('data-site', 'TVK Group Türkiye');
  script.setAttribute('data-accent', '#0d2847');
  script.setAttribute('data-context', 'public');
  script.setAttribute('data-support', 'mailto:hq@tvk.group');
  script.setAttribute('data-privacy', 'https://www.sovra.network/advisor-privacy/');
  document.head.appendChild(script);
})();
