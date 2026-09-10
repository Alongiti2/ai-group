/* AI-Group site engine: i18n, layout, clocks, forms. No build step, no dependencies. */
(function () {
  "use strict";
  const SITE = window.SITE || {};
  const LANGS = ["en", "fr", "pt", "es"];
  const LANG_NAMES = { en: "English", fr: "Français", pt: "Português", es: "Español" };
  const PAGES = [
    ["home", "index.html"], ["services", "services.html"], ["process", "process.html"],
    ["industries", "industries.html"], ["global", "global.html"], ["departments", "departments.html"], ["security", "security.html"],
    ["about", "about.html"], ["contact", "contact.html"]
  ];
  const page = document.body.dataset.page || "home";
  const navPage = page === "education" ? "departments" : page;
  let dict = {};
  let lang = "en";

  // ---------- language detection ----------
  function detectLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.includes(q)) return q;
    try { const s = localStorage.getItem("aig-lang"); if (s && LANGS.includes(s)) return s; } catch (e) {}
    const prefs = navigator.languages || [navigator.language || "en"];
    for (const p of prefs) { const c = p.slice(0, 2).toLowerCase(); if (LANGS.includes(c)) return c; }
    return "en";
  }
  function withLang(href) { return href + (href.includes("?") ? "&" : "?") + "lang=" + lang; }

  async function loadDict(l) {
    const r = await fetch("i18n/" + l + ".json", { cache: "no-cache" });
    if (!r.ok) throw new Error("dict");
    return r.json();
  }
  function get(path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), dict);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  // ---------- layout ----------
  function header() {
    const links = PAGES.map(([k, f]) =>
      `<a href="${withLang(f)}" data-nav="${k}" ${k === navPage ? 'aria-current="page"' : ""}>${esc(get("nav." + k))}</a>`).join("");
    return `<a class="skip" href="#main">${esc(get("nav.skip"))}</a>
    <header class="site-header"><div class="wrap">
      <a class="brand" href="${withLang("index.html")}"><img src="${esc(SITE.logo || "assets/logo.svg")}" alt="" width="54" height="54">
        <span>${esc(SITE.shortName || "AI-Group")}<small>${esc(SITE.tagline || "")}</small></span></a>
      <nav class="nav" id="nav" aria-label="Main">${links}</nav>
      <div class="header-actions">
        <div class="lang" role="group" aria-label="${esc(get("nav.langLabel"))}">${langButtons()}</div>
        <a class="btn teal btn-header" href="${withLang("start-project.html")}">${esc(get("nav.start"))}</a>
        <button class="menu-btn" aria-expanded="false" aria-controls="nav">${esc(get("nav.menu"))}</button>
      </div></div></header>`;
  }
  function langButtons() {
    return LANGS.map(l => `<button type="button" data-lang="${l}" aria-pressed="${l === lang}" lang="${l}" aria-label="${LANG_NAMES[l]}">${l.toUpperCase()}</button>`).join("");
  }
  function footer() {
    const cats = (get("services.categories") || []).map(c => `<li><a href="${withLang("services.html")}#${c.id}">${esc(c.name)}</a></li>`).join("");
    const contact = SITE.email ? `<li><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>` : "";
    const phone = SITE.phone ? `<li><a href="tel:${esc(SITE.phone.replace(/[^+\d]/g, ""))}">${esc(SITE.phone)}</a></li>` : "";
    const gh = SITE.github ? `<li><a href="${esc(SITE.github)}" rel="noopener">GitHub</a></li>` : "";
    const li = SITE.linkedin ? `<li><a href="${esc(SITE.linkedin)}" rel="noopener">LinkedIn</a></li>` : "";
    return `<footer class="site-footer"><div class="wrap">
      <div class="foot-grid">
        <div><h3>${esc(SITE.name || "")}</h3><p>${esc(get("footer.remote"))}<br>${esc(get("footer.founded"))}</p>
          <ul>${contact}${phone}${gh}${li}</ul></div>
        <div><h3>${esc(get("footer.company"))}</h3><ul>
          <li><a href="${withLang("about.html")}">${esc(get("nav.about"))}</a></li>
          <li><a href="${withLang("process.html")}">${esc(get("nav.process"))}</a></li>
          <li><a href="${withLang("industries.html")}">${esc(get("nav.industries"))}</a></li>
          <li><a href="${withLang("global.html")}">${esc(get("nav.global"))}</a></li>
          <li><a href="${withLang("departments.html")}">${esc(get("nav.departments"))}</a></li>
          <li><a href="${withLang("contact.html")}">${esc(get("nav.contact"))}</a></li></ul></div>
        <div><h3>${esc(get("footer.servicesCol"))}</h3><ul>${cats}</ul></div>
        <div><h3>${esc(get("footer.legal"))}</h3><ul>
          <li><a href="${withLang("security.html")}">${esc(get("nav.security"))}</a></li>
          <li><a href="${withLang("privacy.html")}">${esc(get("footer.privacy"))}</a></li>
          <li><a href="${withLang("terms.html")}">${esc(get("footer.terms"))}</a></li></ul></div>
      </div>
      <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${esc(SITE.name || "")}. ${esc(get("footer.rights"))}</span>
        <div class="lang" role="group" aria-label="${esc(get("nav.langLabel"))}">${langButtons()}</div></div>
    </div></footer>`;
  }

  // ---------- renderers for dynamic lists ----------
  const pairs = (arr, cls) => (arr || []).map(([h, p]) => `<div class="${cls || "item"}"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join("");
  const chips = arr => `<ul class="chips">${(arr || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const R = {
    why: () => pairs(get("home.why")),
    caps: () => pairs(get("home.caps")),
    tech: () => chips(get("home.tech")),
    faq: () => (get("home.faq") || []).map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join(""),
    servicesShort: () => (get("services.categories") || []).map(c =>
      `<div class="item"><h3><a href="${withLang("services.html")}#${c.id}">${esc(c.name)}</a></h3><p>${esc(c.desc)}</p></div>`).join(""),
    services: () => (get("services.categories") || []).map(c =>
      `<article class="svc" id="${c.id}"><div><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div><ul>${c.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></article>`).join(""),
    engagement: () => pairs(get("services.engagement")),
    steps: () => `<ol class="steps">${(get("process.steps") || []).map(([h, p]) => `<li><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></li>`).join("")}</ol>`,
    industries: () => pairs(get("industries.items")),
    regions: () => (get("global.regions") || []).map(([r, m, d]) => `<div class="item"><h3>${esc(r)}</h3><p><strong>${esc(m)}</strong><br>${esc(d)}</p></div>`).join(""),
    how: () => pairs(get("global.how")),
    pathways: () => `<ol class="steps two">${(get("education.pathways") || []).map(([h, p]) => `<li><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></li>`).join("")}</ol>`,
    model: () => `<ol class="steps">${(get("education.model") || []).map(([h, p]) => `<li><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></li>`).join("")}</ol>`,
    audience: () => pairs(get("education.audience")),
    departments: () => (get("departments.items") || []).map(([n, p, href, ext]) =>
      `<article class="dept"><h3>${esc(n)}</h3><p>${esc(p)}</p><a class="btn ${ext ? "ghost" : "teal"}" href="${ext ? esc(href) : withLang(href)}" ${ext ? 'rel="noopener"' : ""}>${esc(ext ? get("departments.visit") : get("common.learnMore"))}</a></article>`).join(""),
    principles: () => chips(get("security.principles")),
    controls: () => pairs(get("security.controls")),
    pipeline: () => `<ol class="steps">${(get("security.pipeline") || []).map(h => `<li><div><h3>${esc(h)}</h3></div></li>`).join("")}</ol>`,
    certs: () => `<ul>${(get("about.certs") || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>`,
    values: () => pairs(get("about.values")),
    privacy: () => (get("privacy.body") || []).map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join(""),
    terms: () => (get("terms.body") || []).map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join(""),
    contactEmail: () => SITE.email ? `<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>` : "",
    contactPhone: () => SITE.phone ? `<a href="tel:${esc(SITE.phone.replace(/[^+\d]/g, ""))}">${esc(SITE.phone)}</a>` : `<span class="muted">—</span>`,
    portfolioLink: () => `<a href="${esc(SITE.github || "#")}" rel="noopener">${esc(SITE.github || "")}</a>`
  };
  function options(sel, arr, values) {
    const cur = sel.value;
    sel.innerHTML = `<option value="">${esc(get("start.f.select"))}</option>` +
      (arr || []).map((t, i) => `<option value="${esc(values ? values[i] : t)}">${esc(t)}</option>`).join("");
    if (cur) sel.value = cur;
  }
  function checks(box, arr) {
    box.innerHTML = (arr || []).map(t => `<label><input type="checkbox" name="${box.dataset.name}" value="${esc(t)}">${esc(t)}</label>`).join("");
  }

  // ---------- apply translations ----------
  function apply() {
    document.documentElement.lang = lang;
    const m = get("meta." + page) || {};
    if (m.title) document.title = m.title;
    const md = document.querySelector('meta[name="description"]'); if (md && m.desc) md.content = m.desc;
    const og = document.querySelector('meta[property="og:title"]'); if (og && m.title) og.content = m.title;
    const ogd = document.querySelector('meta[property="og:description"]'); if (ogd && m.desc) ogd.content = m.desc;
    hreflang();

    document.getElementById("site-header").innerHTML = header();
    document.getElementById("site-footer").innerHTML = footer();

    document.querySelectorAll("[data-i18n]").forEach(el => { const v = get(el.dataset.i18n); if (v != null) el.textContent = v; });
    document.querySelectorAll("[data-i18n-html]").forEach(el => { const v = get(el.dataset.i18nHtml); if (v != null) el.innerHTML = v; });
    document.querySelectorAll("[data-render]").forEach(el => { const f = R[el.dataset.render]; if (f) el.innerHTML = f(); });
    document.querySelectorAll("[data-options]").forEach(el => {
      const key = el.dataset.options;
      if (key === "languages") options(el, LANGS.map(l => LANG_NAMES[l]), LANGS);
      else options(el, get(key));
    });
    document.querySelectorAll("[data-checks]").forEach(el => checks(el, get(el.dataset.checks)));
    const topic = new URLSearchParams(location.search).get("topic");
    if (topic) {
      const sel = document.querySelector('select[data-options="contact.categories"]');
      const cats = get("contact.categories") || [];
      const hit = topic === "aigen" ? cats.find(c => /AI-GEN/.test(c)) : topic === "principal" ? cats[2] : null;
      if (sel && hit) sel.value = hit;
    }
    document.querySelectorAll("a[data-href]").forEach(a => a.href = withLang(a.dataset.href));
    document.querySelectorAll('a[href^="mailto:"][data-mail]').forEach(a => { a.href = "mailto:" + SITE.email; a.textContent = SITE.email; });

    const url = new URL(location.href); url.searchParams.set("lang", lang); history.replaceState(null, "", url);
    bindChrome();
  }
  function hreflang() {
    document.querySelectorAll("link[hreflang]").forEach(l => l.remove());
    const base = (SITE.baseUrl || location.origin + location.pathname.replace(/[^/]*$/, "")) + (location.pathname.split("/").pop() || "index.html");
    LANGS.concat(["x-default"]).forEach(l => {
      const link = document.createElement("link"); link.rel = "alternate"; link.hreflang = l;
      link.href = base + "?lang=" + (l === "x-default" ? "en" : l); document.head.appendChild(link);
    });
  }
  function setLang(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l; try { localStorage.setItem("aig-lang", l); } catch (e) {}
    loadDict(l).then(d => { dict = d; apply(); });
  }
  function bindChrome() {
    document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
    const mb = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
    if (mb) mb.addEventListener("click", () => { const o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
    document.querySelectorAll("[data-login]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); alert(get("nav.loginSoon")); }));
  }

  // ---------- world clocks ----------
  function clocks() {
    const list = document.getElementById("clock-list"); if (!list) return;
    const zones = get("home.clocks") || [];
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const you = document.getElementById("clock-you");
    function tick() {
      const now = new Date();
      list.innerHTML = zones.map(([city, zone]) => {
        const t = new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit", hour12: lang === "en", timeZone: zone }).format(now);
        const h = +new Intl.DateTimeFormat("en", { hour: "numeric", hour12: false, timeZone: zone }).format(now) % 24;
        const awake = h >= 8 && h < 20;
        return `<li><span class="city">${esc(city)}</span><span class="time">${esc(t)}</span><span class="dot ${awake ? "awake" : ""}" aria-hidden="true"></span></li>`;
      }).join("");
      if (you) you.textContent = tz.replace(/_/g, " ") + " · " + new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit", hour12: lang === "en" }).format(now);
    }
    tick(); setInterval(tick, 30000);
    document.addEventListener("aig:lang", tick);
  }

  // ---------- forms ----------
  function requestId() {
    const d = new Date(), pad = n => String(n).padStart(2, "0");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let r = ""; const a = new Uint8Array(4); (crypto.getRandomValues ? crypto.getRandomValues(a) : a.fill(Math.random() * 255));
    for (const b of a) r += chars[b % chars.length];
    return `AIG-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${r}`;
  }
  function validate(form) {
    let ok = true;
    form.querySelectorAll("[required]").forEach(el => {
      const wrap = el.closest(".field") || el.parentElement;
      let bad = el.type === "checkbox" ? !el.checked : !el.value.trim();
      if (!bad && el.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
      wrap.classList.toggle("invalid", bad);
      const err = wrap.querySelector(".err");
      if (err) err.textContent = bad && el.type === "email" && el.value ? get("contact.form.invalidEmail") : get("contact.form.required");
      if (bad) ok = false;
    });
    return ok;
  }
  function collect(form) {
    const data = {}; const fd = new FormData(form);
    for (const [k, v] of fd.entries()) { if (k === "_gotcha") continue; data[k] = data[k] ? data[k] + ", " + v : v; }
    return data;
  }
  function labelFor(form, name) {
    const el = form.querySelector(`[name="${name}"]`); if (!el) return name;
    const wrap = el.closest(".field") || el.parentElement; const l = wrap.querySelector("label");
    return l ? l.textContent.trim() : name;
  }
  async function submit(form, kind) {
    if (!validate(form)) { form.querySelector(".invalid input,.invalid select,.invalid textarea")?.focus(); return; }
    const data = collect(form); data.language = LANG_NAMES[lang]; data.page = kind;
    if (kind === "project") data.request_id = requestId();
    data._subject = kind === "project" ? `Project request ${data.request_id}` : `Contact: ${data.category || "General"}`;
    const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = get("contact.form.sending");
    let sent = false;
    if (SITE.formEndpoint) {
      try {
        const r = await fetch(SITE.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        sent = r.ok;
      } catch (e) { sent = false; }
    }
    const out = document.getElementById("form-result"); form.hidden = true; out.hidden = false;
    if (sent) {
      out.innerHTML = kind === "project"
        ? `<div class="notice"><h2>${esc(get("start.successTitle"))}</h2><p>${esc(get("start.successText"))}</p><p class="req-id">${esc(data.request_id)}</p><p>${esc(get("start.successNext"))}</p></div>`
        : `<div class="notice"><p>${esc(get("contact.form.sent"))}</p></div>`;
    } else {
      // GitHub Pages has no server: fall back to a pre-filled email so nothing is lost.
      const lines = Object.entries(data).filter(([k]) => !k.startsWith("_") && k !== "page")
        .map(([k, v]) => `${labelFor(form, k)}: ${v}`).join("\n");
      const href = `mailto:${SITE.email}?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(lines)}`;
      const idBlock = kind === "project" ? `<p>${esc(get("start.successText"))}</p><p class="req-id">${esc(data.request_id)}</p>` : "";
      const txt = kind === "project" ? get("start.fallbackText") : get("contact.form.fallback");
      out.innerHTML = `<div class="notice">${idBlock}<p>${esc(txt)} <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>.</p><p><a class="btn teal" href="${href}">${esc(get("common.email"))}</a></p></div>`;
      location.href = href;
    }
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function forms() {
    document.querySelectorAll("form[data-form]").forEach(f => {
      f.addEventListener("submit", e => { e.preventDefault(); submit(f, f.dataset.form); });
      f.querySelectorAll("[required]").forEach(el => el.addEventListener("input", () => (el.closest(".field") || el.parentElement).classList.remove("invalid")));
    });
  }

  // ---------- boot ----------
  lang = detectLang();
  loadDict(lang).catch(() => loadDict("en")).then(d => {
    dict = d; apply(); clocks(); forms();
    const origApply = apply; // re-tick clocks on language change
    setLang.after = null;
    document.addEventListener("click", e => { if (e.target.closest("[data-lang]")) setTimeout(() => document.dispatchEvent(new Event("aig:lang")), 250); });
    if (location.hash) { const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
  });
})();
