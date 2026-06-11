(function () {
  const storageKey = "tvk-vision-language";
  const langs = [
    ["en", "English"], ["tr", "Türkçe"], ["de", "Deutsch"], ["fr", "Français"],
    ["it", "Italiano"], ["es", "Español"], ["nl", "Nederlands"], ["pl", "Polski"],
    ["pt", "Português"], ["ro", "Română"], ["sv", "Svenska"], ["da", "Dansk"],
    ["fi", "Suomi"], ["cs", "Čeština"], ["sk", "Slovenčina"], ["hu", "Magyar"],
    ["el", "Ελληνικά"], ["bg", "Български"], ["ru", "Русский"], ["uk", "Українська"],
    ["ar", "العربية"], ["zh", "中文"], ["ja", "日本語"], ["ko", "한국어"], ["hi", "हिन्दी"]
  ];

  const menu = document.getElementById("language-menu");
  langs.forEach(([code, label]) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "language-option";
    btn.type = "button";
    btn.role = "menuitemradio";
    btn.dataset.lang = code;
    btn.textContent = label;
    btn.setAttribute("aria-checked", code === "en" ? "true" : "false");
    li.appendChild(btn);
    menu.appendChild(li);
  });

  const selectors = document.querySelectorAll("[data-language-selector]");
  const status = document.getElementById("language-status");
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  function readSaved() {
    try { return localStorage.getItem(storageKey) || "en"; } catch { return "en"; }
  }

  function save(code) {
    try { localStorage.setItem(storageKey, code); } catch { /* noop */ }
  }

  function closeAll() {
    selectors.forEach((sel) => {
      sel.classList.remove("is-open");
      sel.querySelector(".language-toggle").setAttribute("aria-expanded", "false");
      sel.querySelector(".language-menu").hidden = true;
    });
  }

  function setLanguage(code, label) {
    const copy = { ...TVK_TRANSLATIONS.en, ...(TVK_TRANSLATIONS[code] || {}) };
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.title = copy.pageTitle;
    if (copy.metaDescription) metaDescription.setAttribute("content", copy.metaDescription);
    if (copy.ogTitle) ogTitle.setAttribute("content", copy.ogTitle);
    if (copy.ogDescription) ogDescription.setAttribute("content", copy.ogDescription);
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const val = copy[node.dataset.i18n];
      if (val) node.textContent = val;
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

  let saved = readSaved();
  selectors.forEach((sel) => {
    const toggle = sel.querySelector(".language-toggle");
    const menuEl = sel.querySelector(".language-menu");
    const options = sel.querySelectorAll(".language-option");
    const savedOpt = sel.querySelector(`[data-lang="${saved}"]`);
    if (savedOpt) setLanguage(saved, savedOpt.textContent.trim());

    toggle.addEventListener("click", () => {
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
        toggle.focus();
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-language-selector]")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  /* Scroll reveal */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  /* Vision Engine auto-cycle */
  const stages = document.querySelectorAll(".engine-stage");
  let currentStage = 0;
  if (stages.length) {
    setInterval(() => {
      stages.forEach((s) => s.classList.remove("active"));
      currentStage = (currentStage + 1) % stages.length;
      stages[currentStage].classList.add("active");
    }, 2800);
  }

  /* Constellation canvas */
  const canvas = document.getElementById("constellation-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const nodes = [
      { id: "tvk", label: "T-V-K", x: 0.5, y: 0.5, r: 22 },
      { id: "sovra", label: "SOVRA", x: 0.22, y: 0.28, r: 14 },
      { id: "entelekron", label: "ENTELΞKRON", x: 0.78, y: 0.28, r: 14 },
      { id: "entelscan", label: "EnteleSCAN", x: 0.15, y: 0.55, r: 12 },
      { id: "entelelink", label: "EnteleLINK", x: 0.85, y: 0.55, r: 12 },
      { id: "chronoseal", label: "ChronoSeal", x: 0.3, y: 0.78, r: 12 },
      { id: "graphvault", label: "GraphVAULT", x: 0.7, y: 0.78, r: 12 },
      { id: "entelevault", label: "EnteleVAULT", x: 0.5, y: 0.18, r: 12 },
      { id: "qpresence", label: "Q-Presence", x: 0.5, y: 0.82, r: 12 },
      { id: "labs", label: "TVK Labs", x: 0.5, y: 0.35, r: 13 }
    ];
    const edges = [
      { from: "tvk", to: "sovra", type: "intelligence" },
      { from: "tvk", to: "entelekron", type: "infrastructure" },
      { from: "tvk", to: "labs", type: "knowledge" },
      { from: "sovra", to: "entelscan", type: "data" },
      { from: "entelekron", to: "entelelink", type: "data" },
      { from: "chronoseal", to: "entelevault", type: "trust" },
      { from: "qpresence", to: "entelevault", type: "identity" },
      { from: "graphvault", to: "labs", type: "knowledge" },
      { from: "sovra", to: "entelekron", type: "intelligence" },
      { from: "entelscan", to: "entelelink", type: "data" },
      { from: "chronoseal", to: "qpresence", type: "trust" },
      { from: "graphvault", to: "chronoseal", type: "knowledge" }
    ];
    const colors = {
      data: "#90caf9", trust: "#ffb74d", identity: "#b39ddb",
      intelligence: "#4fc3f7", knowledge: "#81c784", infrastructure: "rgba(255,255,255,.25)"
    };
    const particles = edges.map((e, i) => ({
      edge: e, t: i / edges.length, speed: 0.002 + Math.random() * 0.002
    }));

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = 480 * devicePixelRatio;
      canvas.style.height = "480px";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function getPos(id) {
      const n = nodes.find((x) => x.id === id);
      const w = canvas.width / devicePixelRatio;
      const h = 480;
      return { x: n.x * w, y: n.y * h, r: n.r };
    }

    function draw() {
      const w = canvas.width / devicePixelRatio;
      const h = 480;
      ctx.clearRect(0, 0, w, h);

      edges.forEach((e) => {
        const a = getPos(e.from);
        const b = getPos(e.to);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = colors[e.type] || "rgba(255,255,255,.2)";
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      particles.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const a = getPos(p.edge.from);
        const b = getPos(p.edge.to);
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.edge.type] || "#fff";
        ctx.fill();
      });

      nodes.forEach((n) => {
        const x = n.x * w;
        const y = n.y * h;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, n.r);
        grad.addColorStop(0, "rgba(30,136,229,.5)");
        grad.addColorStop(1, "rgba(7,17,31,.8)");
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(79,195,247,.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = n.r > 14 ? "bold 10px Inter, sans-serif" : "600 9px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, x, y);
      });

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  }
})();
