/* Naimi kit runtime (kit.js) — engine nk/0.10.0. Precompiled platform
 * artifact: don't read or edit it, it travels into the bundle byte for byte.
 * Docs for deck authors: ../README.md · MIT License. */
(() => {
  "use strict";
  const ENGINE_VERSION = "0.10.0";
  const STRINGS = {
    en: {
      first: "First slide (Home)",
      prev: "Previous (←)",
      next: "Next (→)",
      last: "Last slide (End)",
      prevShort: "Previous",
      nextShort: "Next",
      slide: (n) => `Slide ${n}`,
      page: (n) => `Page ${n}`,
      swipe: "Swipe →",
      panelShow: "Slides",
      panelHide: "Hide slides (Esc)",
      panelShowAria: "Show slide panel",
      panelHideAria: "Hide slide panel",
      modeSlides: "Slide view",
      modeScroll: "Scroll view",
      modeSlidesAria: "Switch to slide view",
      modeScrollAria: "Switch to scroll view"
    }
  };
  const T = STRINGS[(document.documentElement.lang || "en").slice(0, 2).toLowerCase()] ?? STRINGS.en;
  const STATIC = (() => {
    try {
      return matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).has("nk-static");
    } catch {
      return false;
    }
  })();
  const PAGE_SIZES = { a4: [794, 1123], letter: [816, 1056] };
  let DOC = false;
  let PAGE = null;
  const EMPTY_STATE = { personalization: { companyName: "" }, clientFacts: {}, demoData: {}, canPersist: false, ui: {} };
  const embedded = window.parent !== window;
  let state = null;
  let initReceived = false;
  const stateListeners = /* @__PURE__ */ new Set();
  function normalizeState(raw) {
    const p = raw && typeof raw === "object" ? raw : {};
    return {
      personalization: p.personalization ?? { companyName: "" },
      clientFacts: p.clientFacts ?? {},
      demoData: p.demoData ?? {},
      canPersist: Boolean(p.canPersist),
      ui: p.ui && typeof p.ui === "object" ? p.ui : {}
    };
  }
  function emitState() {
    if (!state) return;
    applyPersonalizationAll();
    syncBoundControls();
    for (const fn of stateListeners) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    }
  }
  window.addEventListener("message", (event) => {
    const msg = event.data || {};
    if (msg.type === "naimi:command") {
      handleHostCommand(msg.payload);
      return;
    }
    if (msg.type !== "naimi:init") return;
    initReceived = true;
    state = normalizeState(msg.payload);
    emitState();
    applyHostStartSlide();
    applyHostViewMode();
  });
  function postReady() {
    window.parent.postMessage({
      type: "naimi:ready",
      payload: { engine: `nk/${ENGINE_VERSION}`, format: DOC ? "document" : "slides", capabilities: ["static", "slideEvents", "panel", "scroll", "defaultMode", "startSlide", "goto", "actions", "inspect", "document"] }
    }, "*");
  }
  const READY_RETRIES_MS = [250, 800, 2e3];
  function startHost() {
    if (embedded) {
      postReady();
      for (const delay of READY_RETRIES_MS) {
        setTimeout(() => {
          if (!initReceived) postReady();
        }, delay);
      }
      setTimeout(() => {
        if (!state) {
          state = EMPTY_STATE;
          emitState();
        }
      }, 1500);
      return;
    }
    fetch("mock/state.json").then((r) => r.ok ? r.json() : null).then((raw) => {
      if (!state) {
        state = normalizeState(raw ?? {});
        emitState();
      }
    }).catch(() => {
      if (!state) {
        state = EMPTY_STATE;
        emitState();
      }
    });
  }
  function personalizationValue(key, fallback = "") {
    const p = (state ?? EMPTY_STATE).personalization;
    const direct = p[key];
    if (typeof direct === "string" && direct.trim()) return direct;
    const custom = Array.isArray(p.customFields) ? p.customFields.find((f) => f && f.key === key) : null;
    if (custom && typeof custom.value === "string" && custom.value.trim()) return custom.value;
    return fallback;
  }
  const liveFields = /* @__PURE__ */ Object.create(null);
  let pendingPatch = null;
  let patchTimer = 0;
  function fieldValue(key, def) {
    if (key in liveFields) return liveFields[key];
    const s = state ?? EMPTY_STATE;
    if (s.demoData[key] !== void 0 && s.demoData[key] !== null) return s.demoData[key];
    if (s.clientFacts[key] !== void 0 && s.clientFacts[key] !== null) return s.clientFacts[key];
    return def;
  }
  function setField(key, value) {
    liveFields[key] = value;
    pendingPatch = Object.assign(pendingPatch ?? {}, { [key]: value });
    clearTimeout(patchTimer);
    patchTimer = setTimeout(flushPatch, 500);
    syncBoundControls();
    for (const fn of stateListeners) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    }
  }
  function flushPatch() {
    clearTimeout(patchTimer);
    if (!pendingPatch || Object.keys(pendingPatch).length === 0) return;
    const data = pendingPatch;
    pendingPatch = null;
    if (embedded) {
      window.parent.postMessage({ type: "naimi:demoDataPatch", payload: { data } }, "*");
    } else {
      console.debug("[naimi-kit] demoData patch (preview, not sent):", data);
    }
  }
  const authoredText = /* @__PURE__ */ new WeakMap();
  function textFallback(el) {
    if (el.dataset.nkFallback !== void 0) return el.dataset.nkFallback;
    if (!authoredText.has(el)) authoredText.set(el, el.textContent ?? "");
    return authoredText.get(el);
  }
  function applyPersonalization(root2) {
    for (const el of root2.querySelectorAll("[data-nk-text]")) {
      el.textContent = personalizationValue(el.dataset.nkText, textFallback(el));
    }
    for (const el of root2.querySelectorAll("[data-nk-hide-empty]")) {
      el.hidden = !personalizationValue(el.dataset.nkHideEmpty);
    }
  }
  function applyPersonalizationAll() {
    for (const section of sections) applyPersonalization(section);
  }
  function coerce(el, raw) {
    const type = el.dataset.nkType ?? (el instanceof HTMLInputElement && (el.type === "range" || el.type === "number") ? "number" : "string");
    if (type === "number") return Number(raw);
    if (type === "boolean") return raw === "true" || raw === true;
    return String(raw);
  }
  const boundControls = /* @__PURE__ */ new Set();
  function bindControls(root2) {
    for (const el of root2.querySelectorAll("[data-nk-field]")) {
      if (boundControls.has(el)) continue;
      boundControls.add(el);
      const key = el.dataset.nkField;
      if (el instanceof HTMLInputElement && (el.type === "range" || el.type === "number")) {
        el.addEventListener("input", () => setField(key, coerce(el, el.value)));
      } else if (el.dataset.nkValue !== void 0) {
        el.addEventListener("click", () => setField(key, coerce(el, el.dataset.nkValue)));
      }
    }
    syncBoundControls();
  }
  function syncBoundControls() {
    for (const el of boundControls) {
      const key = el.dataset.nkField;
      const value = fieldValue(key, void 0);
      if (value === void 0) continue;
      if (el instanceof HTMLInputElement && (el.type === "range" || el.type === "number")) {
        if (document.activeElement !== el) el.value = String(value);
      } else if (el.dataset.nkValue !== void 0) {
        el.setAttribute("aria-pressed", String(String(value) === el.dataset.nkValue));
      }
    }
  }
  function springEasing(stiffness, damping) {
    const w0 = Math.sqrt(stiffness);
    const zeta = damping / (2 * Math.sqrt(stiffness));
    const wd = w0 * Math.sqrt(Math.max(1e-6, 1 - zeta * zeta));
    const duration = 0.66;
    const points = [];
    const steps = 22;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps * duration;
      const x = 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + zeta * w0 / wd * Math.sin(wd * t));
      points.push((i === steps ? 1 : x).toFixed(4));
    }
    return { easing: `linear(${points.join(", ")})`, durationMs: duration * 1e3 };
  }
  const SPRING = springEasing(300, 30);
  function animateSafe(el, keyframes, options) {
    try {
      return el.animate(keyframes, options);
    } catch {
      return el.animate(keyframes, { ...options, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
  }
  function settleOnFinish(anim, el, finalStyle) {
    anim.finished.then(() => {
      for (const [prop, value] of Object.entries(finalStyle)) el.style[prop] = value;
      anim.cancel();
    }).catch(() => {
    });
  }
  const REVEAL_VARIANTS = {
    up: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
    "up-lg": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
    left: { from: { opacity: "0", transform: "translateX(-16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
    right: { from: { opacity: "0", transform: "translateX(16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
    scale: { from: { opacity: "0", transform: "scale(0.8)" }, to: { opacity: "1", transform: "scale(1)" } }
  };
  function revealSection(section) {
    if (STATIC) {
      for (const el of section.querySelectorAll('[data-animate="grow"]')) el.style.height = el.dataset.grow || "100%";
      return;
    }
    for (const box of section.querySelectorAll("[data-stagger]")) {
      const step = Number(box.dataset.stagger) || 0.08;
      const base = Number(box.dataset.staggerBase) || 0.1;
      let i = 0;
      for (const child of box.querySelectorAll(":scope > [data-animate]")) {
        if (!child.dataset.delay) child.dataset.delay = String(base + step * i);
        i += 1;
      }
    }
    for (const el of section.querySelectorAll("[data-animate]")) {
      const variant = el.dataset.animate;
      const delay = (Number(el.dataset.delay) || 0) * 1e3;
      if (variant === "grow") {
        const target = el.dataset.grow || "100%";
        el.style.height = target;
        const anim2 = animateSafe(el, [{ height: "0px" }, { height: target }], {
          duration: 600,
          delay,
          easing: SPRING.easing,
          fill: "backwards"
        });
        settleOnFinish(anim2, el, { height: target });
        continue;
      }
      const spec = REVEAL_VARIANTS[variant] ?? REVEAL_VARIANTS.up;
      for (const [prop, value] of Object.entries(spec.to)) el.style[prop] = value;
      const anim = animateSafe(el, [spec.from, spec.to], {
        duration: 500,
        delay,
        easing: "cubic-bezier(0.21, 0.47, 0.32, 0.98)",
        fill: "backwards"
      });
      settleOnFinish(anim, el, spec.to);
    }
  }
  let sections = [];
  let current = 0;
  let navBusy = false;
  let root, shell, deckRoot, stage, store, dotsBox, counterEl, mobileCounterEl, hintEl;
  let panelEl, panelListEl, panelBtn;
  let panelOpen = false;
  const HINT_MS = 2500;
  let hintDismissed = false;
  let hintTimer = 0;
  let thumbBtns = [];
  let thumbRefreshQueued = false;
  let viewMode = "slides";
  let modeLockedByUser = false;
  let hostModeApplied = false;
  let hostStartApplied = false;
  let scrollEl = null;
  let scrollWraps = [];
  let railDotsBox, modeBtn, mobileModeBtn;
  let lazyIO = null;
  let activeIO = null;
  const scrollRevealed = /* @__PURE__ */ new Set();
  const navButtons = {};
  const readyCallbacks = [];
  let started = false;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ICONS = {
    first: [["path", "m11 17-5-5 5-5"], ["path", "m18 17-5-5 5-5"]],
    prev: [["path", "m15 18-6-6 6-6"]],
    next: [["path", "m9 18 6-6-6-6"]],
    last: [["path", "m6 17 5-5-5-5"], ["path", "m13 17 5-5-5-5"]],
    up: [["path", "m18 15-6-6-6 6"]],
    down: [["path", "m6 9 6 6 6-6"]],
    panel: [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }], ["path", "M9 3v18"]],
    panelClose: [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }], ["path", "M9 3v18"], ["path", "m16 15-3-3 3-3"]],
    galleryV: [["path", "M3 2h18"], ["rect", { width: "18", height: "12", x: "3", y: "6", rx: "2" }], ["path", "M3 22h18"]],
    galleryH: [["path", "M2 3v18"], ["rect", { width: "12", height: "18", x: "6", y: "3", rx: "2" }], ["path", "M22 3v18"]]
  };
  function icon(name) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("nk-ico");
    for (const [tag, attrs] of ICONS[name]) {
      const node = document.createElementNS(SVG_NS, tag);
      if (typeof attrs === "string") node.setAttribute("d", attrs);
      else for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
      svg.appendChild(node);
    }
    return svg;
  }
  function navButton(key, iconName, title, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nk-nav-btn";
    btn.title = title;
    btn.setAttribute("aria-label", title);
    btn.appendChild(icon(iconName));
    btn.addEventListener("click", onClick);
    navButtons[key] = btn;
    return btn;
  }
  function buildPlayer() {
    const source = document.getElementById("deck");
    sections = Array.from(source ? source.querySelectorAll(":scope > section") : []);
    DOC = source?.dataset.nkFormat === "document";
    if (DOC) {
      const [w, h] = PAGE_SIZES[String(source.dataset.nkPage || "a4").toLowerCase()] ?? PAGE_SIZES.a4;
      PAGE = { width: w, height: h };
      const rs = document.documentElement.style;
      rs.setProperty("--nk-sheet-width", `${w}px`);
      rs.setProperty("--nk-sheet-height", `${h}px`);
      rs.setProperty("--nk-page-ratio", `${w} / ${h}`);
    }
    const nameOf = DOC ? T.page : T.slide;
    source?.remove();
    root = document.getElementById("root") ?? document.body.appendChild(Object.assign(document.createElement("div"), { id: "root" }));
    shell = document.createElement("div");
    shell.className = "nk-shell";
    panelEl = document.createElement("aside");
    panelEl.className = "nk-panel";
    panelEl.hidden = true;
    const panelInner = document.createElement("div");
    panelInner.className = "nk-panel-inner";
    panelListEl = document.createElement("div");
    panelListEl.className = "nk-panel-list";
    panelInner.appendChild(panelListEl);
    panelEl.appendChild(panelInner);
    deckRoot = document.createElement("div");
    deckRoot.className = "nk-deck";
    stage = document.createElement("div");
    stage.className = "nk-stage";
    deckRoot.appendChild(stage);
    store = document.createElement("div");
    store.className = "nk-store";
    store.hidden = true;
    for (const section of sections) store.appendChild(section);
    deckRoot.appendChild(store);
    const bar = document.createElement("div");
    bar.className = "z-50 nk-navbar";
    const barInner = document.createElement("div");
    barInner.className = "nk-navbar-inner";
    const left = document.createElement("div");
    left.className = "nk-nav-group";
    left.append(navButton("first", "first", T.first, () => navTo(0)), navButton("prev", "prev", T.prev, () => navTo(current - 1)));
    dotsBox = document.createElement("div");
    dotsBox.className = "nk-dots";
    sections.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "nk-dot";
      dot.title = nameOf(i + 1);
      dot.addEventListener("click", () => navTo(i));
      dotsBox.appendChild(dot);
    });
    const right = document.createElement("div");
    right.className = "nk-nav-group";
    right.append(navButton("next", "next", T.next, () => navTo(current + 1)), navButton("last", "last", T.last, () => navTo(sections.length - 1)));
    barInner.append(left, dotsBox, right);
    bar.appendChild(barInner);
    const counterWrap = document.createElement("div");
    counterWrap.className = "z-50 nk-counter";
    counterEl = document.createElement("div");
    counterWrap.appendChild(counterEl);
    const mbar = document.createElement("div");
    mbar.className = "z-50 nk-mobilebar";
    const mInner = document.createElement("div");
    mInner.className = "nk-mobilebar-inner";
    const mPrev = navButton("mprev", "prev", T.prevShort, () => navTo(current - 1));
    const mNext = navButton("mnext", "next", T.nextShort, () => navTo(current + 1));
    mobileCounterEl = document.createElement("div");
    mobileCounterEl.className = "nk-counter-chip";
    mInner.append(mPrev, mobileCounterEl, mNext);
    mbar.appendChild(mInner);
    hintEl = document.createElement("div");
    hintEl.className = "z-40 nk-swipe-hint";
    hintEl.innerHTML = '<div class="nk-swipe-pill"><span class="nk-swipe-track"><span class="nk-swipe-ball"></span></span>' + T.swipe + "</div>";
    const topbar = document.createElement("div");
    topbar.className = "z-50 nk-topbar";
    panelBtn = document.createElement("button");
    panelBtn.type = "button";
    panelBtn.className = "nk-nav-btn";
    panelBtn.title = T.panelShow;
    panelBtn.setAttribute("aria-label", T.panelShowAria);
    panelBtn.setAttribute("aria-expanded", "false");
    panelBtn.appendChild(icon("panel"));
    panelBtn.addEventListener("click", () => setPanelOpen(!panelOpen));
    modeBtn = document.createElement("button");
    modeBtn.type = "button";
    modeBtn.className = "nk-nav-btn";
    modeBtn.addEventListener("click", toggleMode);
    topbar.append(panelBtn, modeBtn);
    const mtoggle = document.createElement("div");
    mtoggle.className = "z-50 nk-mobiletoggle";
    mobileModeBtn = document.createElement("button");
    mobileModeBtn.type = "button";
    mobileModeBtn.className = "nk-nav-btn";
    mobileModeBtn.addEventListener("click", toggleMode);
    mtoggle.appendChild(mobileModeBtn);
    setModeButtons();
    const rail = document.createElement("div");
    rail.className = "z-50 nk-rail";
    const railInner = document.createElement("div");
    railInner.className = "nk-rail-inner";
    railDotsBox = document.createElement("div");
    railDotsBox.className = "nk-rail-dots";
    sections.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "nk-dot";
      dot.title = nameOf(i + 1);
      dot.addEventListener("click", () => navTo(i));
      railDotsBox.appendChild(dot);
    });
    railInner.append(
      navButton("railPrev", "up", T.prev, () => navTo(current - 1)),
      railDotsBox,
      navButton("railNext", "down", T.next, () => navTo(current + 1))
    );
    rail.appendChild(railInner);
    deckRoot.append(bar, counterWrap, mbar, topbar, mtoggle, rail, hintEl);
    shell.append(panelEl, deckRoot);
    root.appendChild(shell);
    window.addEventListener("keydown", onKeydown);
    document.addEventListener("click", (event) => {
      const el = event.target instanceof Element ? event.target.closest("[data-nk-action]") : null;
      if (el && el.dataset.nkAction) emitAction(el.dataset.nkAction);
    });
    stateListeners.add(scheduleActiveThumbRefresh);
    if (DOC) {
      deckRoot.classList.add("nk-mode-document");
      modeLockedByUser = true;
      enterScroll();
    } else {
      mountSlide(current, 0, null);
    }
    updateChrome();
  }
  function isEditableTarget(t) {
    if (!(t instanceof HTMLElement)) return false;
    return t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
  }
  function onKeydown(event) {
    if (isEditableTarget(event.target)) return;
    if ((event.key === " " || event.key === "Enter") && event.target instanceof HTMLElement && event.target.closest("button, a")) return;
    const isScroll = viewMode === "scroll";
    switch (event.key) {
      case "ArrowRight":
      case " ":
      case "Enter":
        if (isScroll) event.preventDefault();
        navTo(current + 1);
        break;
      case "ArrowLeft":
      case "Backspace":
        if (isScroll) event.preventDefault();
        navTo(current - 1);
        break;
      case "Home":
        if (isScroll) event.preventDefault();
        navTo(0);
        break;
      case "End":
        if (isScroll) event.preventDefault();
        navTo(sections.length - 1);
        break;
      case "ArrowDown":
      case "ArrowUp":
        if (isScroll && scrollEl) {
          event.preventDefault();
          scrollEl.scrollBy({ top: event.key === "ArrowDown" ? 160 : -160, behavior: STATIC ? "auto" : "smooth" });
        }
        break;
      case "PageDown":
      case "PageUp":
        if (isScroll && scrollEl) {
          event.preventDefault();
          scrollEl.scrollBy({ top: (event.key === "PageDown" ? 1 : -1) * scrollEl.clientHeight * 0.85, behavior: STATIC ? "auto" : "smooth" });
        }
        break;
      case "Escape":
        if (!inspectEscape()) setPanelOpen(false);
        break;
    }
  }
  function frameFor(section) {
    const frame = document.createElement("div");
    frame.className = "absolute inset-0 nk-frame";
    frame.appendChild(section);
    attachSwipe(frame);
    return frame;
  }
  function mountSlide(index, direction, previousFrame) {
    const section = sections[index];
    applyPersonalization(section);
    bindControls(section);
    const frame = frameFor(section);
    stage.appendChild(frame);
    if (direction !== 0 && !STATIC) {
      const fromX = direction > 0 ? "100%" : "-100%";
      const slide = animateSafe(frame, [{ transform: `translateX(${fromX})` }, { transform: "translateX(0)" }], {
        duration: SPRING.durationMs,
        easing: SPRING.easing
      });
      settleOnFinish(slide, frame, { transform: "" });
      const fade = frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" });
      settleOnFinish(fade, frame, { opacity: "" });
    }
    revealSection(section);
    void previousFrame;
  }
  function emitSlideChange() {
    if (inspectOn) {
      inspectEl = null;
      inspectSync();
    }
    if (!embedded) return;
    const id = sections[current]?.dataset.nkSlide ?? null;
    window.parent.postMessage({ type: "naimi:event", payload: { kind: "slideChange", index: current, id } }, "*");
  }
  function emitAction(action) {
    flushPatch();
    if (!embedded) {
      console.debug("[naimi-kit] action (preview, not sent):", action);
      return;
    }
    const id = sections[current]?.dataset.nkSlide ?? null;
    window.parent.postMessage({ type: "naimi:event", payload: { kind: "action", action, index: current, id } }, "*");
  }
  function go(index, { instant = false } = {}) {
    if (navBusy || index < 0 || index >= sections.length || index === current) return;
    flushPatch();
    const direction = instant ? 0 : index > current ? 1 : -1;
    const oldFrame = stage.querySelector(":scope > .nk-frame");
    current = index;
    if (index === 0) hintDismissed = false;
    updateChrome();
    emitSlideChange();
    navBusy = true;
    const finish = () => {
      const oldSection = oldFrame?.querySelector(":scope > section");
      if (oldSection) store.appendChild(oldSection);
      oldFrame?.remove();
      mountSlide(index, direction, oldFrame);
      navBusy = false;
    };
    if (oldFrame && !STATIC && !instant) {
      const exit = animateSafe(oldFrame, [
        { transform: "translateX(0)", opacity: 1 },
        { transform: `translateX(${direction > 0 ? "-100%" : "100%"})`, opacity: 0 }
      ], { duration: 240, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" });
      exit.finished.then(finish).catch(finish);
    } else {
      finish();
    }
  }
  function updateChrome() {
    const label = `${current + 1} / ${sections.length}`;
    counterEl.textContent = label;
    mobileCounterEl.textContent = label;
    Array.from(dotsBox.children).forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    Array.from(railDotsBox.children).forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    const atStart = current === 0;
    const atEnd = current === sections.length - 1;
    navButtons.first.disabled = atStart;
    navButtons.prev.disabled = atStart;
    navButtons.mprev.disabled = atStart;
    navButtons.railPrev.disabled = atStart;
    navButtons.next.disabled = atEnd;
    navButtons.mnext.disabled = atEnd;
    navButtons.last.disabled = atEnd;
    navButtons.railNext.disabled = atEnd;
    updateSwipeHint();
    if (panelOpen) {
      const btn = thumbBtns[current];
      if (btn) fillThumbCanvas(btn.firstChild, current);
      syncActiveThumb(false);
    }
  }
  function updateSwipeHint() {
    clearTimeout(hintTimer);
    const show = viewMode === "slides" && current === 0 && !hintDismissed;
    if (show) hintEl.hidden = false;
    hintEl.classList.toggle("is-visible", show);
    if (!show || STATIC) return;
    hintTimer = setTimeout(() => {
      hintDismissed = true;
      hintEl.classList.remove("is-visible");
      hintTimer = setTimeout(() => {
        hintEl.hidden = true;
      }, 400);
    }, HINT_MS);
  }
  function navTo(index) {
    if (index < 0 || index >= sections.length) return;
    if (viewMode === "scroll") {
      if (index !== current) flushPatch();
      scrollWraps[index].scrollIntoView({ block: "start", behavior: STATIC ? "auto" : "smooth" });
    } else {
      go(index);
    }
  }
  function scrollReveal(index) {
    if (scrollRevealed.has(index)) return;
    scrollRevealed.add(index);
    const section = sections[index];
    applyPersonalization(section);
    bindControls(section);
    revealSection(section);
  }
  function startScrollObservers() {
    stopScrollObservers();
    lazyIO = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        scrollReveal(Number(entry.target.dataset.sectionIndex));
        lazyIO.unobserve(entry.target);
      }
    }, { root: scrollEl, rootMargin: "35% 0px 35% 0px" });
    activeIO = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = Number(entry.target.dataset.sectionIndex);
        if (index === current) continue;
        flushPatch();
        current = index;
        updateChrome();
        emitSlideChange();
      }
    }, { root: scrollEl, rootMargin: "-49% 0px -49% 0px" });
    for (const wrap of scrollWraps) {
      if (!scrollRevealed.has(Number(wrap.dataset.sectionIndex))) lazyIO.observe(wrap);
      activeIO.observe(wrap);
    }
  }
  function stopScrollObservers() {
    lazyIO?.disconnect();
    activeIO?.disconnect();
    lazyIO = activeIO = null;
  }
  function slideIndexFor(ref) {
    if (typeof ref === "number" && Number.isInteger(ref) && ref >= 0 && ref < sections.length) return ref;
    if (typeof ref === "string" && ref) return sections.findIndex((s) => s.dataset.nkSlide === ref);
    return -1;
  }
  function handleHostCommand(payload) {
    if (!started) return;
    const cmd = payload && typeof payload === "object" ? payload : {};
    if (cmd.kind === "goto") {
      const index = slideIndexFor(cmd.slide);
      if (index >= 0) navTo(index);
    }
    if (cmd.kind === "inspect") setInspect(cmd.on);
  }
  function applyHostStartSlide() {
    if (hostStartApplied) return;
    hostStartApplied = true;
    if (current !== 0) return;
    const index = slideIndexFor(state?.ui?.startSlide);
    if (index <= 0) return;
    if (viewMode === "scroll") navTo(index);
    else go(index, { instant: true });
  }
  function applyHostViewMode() {
    if (hostModeApplied) return;
    hostModeApplied = true;
    if (modeLockedByUser) return;
    if (state?.ui?.defaultMode === "scroll" && viewMode === "slides") enterScroll({ keepReveal: true });
  }
  function enterScroll({ keepReveal = false } = {}) {
    if (viewMode === "scroll") return;
    flushPatch();
    viewMode = "scroll";
    if (!scrollEl) {
      scrollEl = document.createElement("div");
      scrollEl.className = "nk-scroll";
      scrollWraps = sections.map((_, i) => {
        const wrap = document.createElement("section");
        wrap.className = "nk-scroll-sec";
        wrap.dataset.sectionIndex = String(i);
        return wrap;
      });
      scrollEl.append(...scrollWraps);
      scrollEl.hidden = true;
      deckRoot.insertBefore(scrollEl, store);
    }
    const oldFrame = stage.querySelector(":scope > .nk-frame");
    sections.forEach((section, i) => scrollWraps[i].appendChild(section));
    oldFrame?.remove();
    stage.hidden = true;
    scrollEl.hidden = false;
    deckRoot.classList.add("nk-mode-scroll");
    setModeButtons();
    updateChrome();
    scrollWraps[current].scrollIntoView({ block: "start", behavior: "auto" });
    if (keepReveal) scrollRevealed.add(current);
    for (const i of STATIC && DOC ? sections.keys() : [current - 1, current, current + 1]) if (sections[i]) scrollReveal(i);
    startScrollObservers();
  }
  function exitScroll() {
    if (viewMode !== "scroll") return;
    flushPatch();
    stopScrollObservers();
    viewMode = "slides";
    for (const [i, section] of sections.entries()) {
      if (i !== current) store.appendChild(section);
    }
    scrollEl.hidden = true;
    stage.hidden = false;
    deckRoot.classList.remove("nk-mode-scroll");
    setModeButtons();
    mountSlide(current, 0, null);
    updateChrome();
  }
  function toggleMode() {
    if (DOC) return;
    modeLockedByUser = true;
    if (viewMode === "scroll") exitScroll();
    else enterScroll();
  }
  function setModeButtons() {
    const scroll = viewMode === "scroll";
    for (const btn of [modeBtn, mobileModeBtn]) {
      if (!btn) continue;
      btn.replaceChildren(icon(scroll ? "galleryH" : "galleryV"));
      btn.title = scroll ? T.modeSlides : T.modeScroll;
      btn.setAttribute("aria-label", scroll ? T.modeSlidesAria : T.modeScrollAria);
      btn.setAttribute("aria-pressed", String(scroll));
    }
  }
  const PANEL_ANIM = { duration: 280, easing: "cubic-bezier(0.32, 0.72, 0, 1)" };
  function fillThumbCanvas(canvas, index) {
    const clone = sections[index].cloneNode(true);
    clone.removeAttribute("id");
    clone.removeAttribute("data-nk-slide");
    for (const el of clone.querySelectorAll("[id]")) el.removeAttribute("id");
    for (const el of clone.querySelectorAll('[data-animate="grow"]')) el.style.height = el.dataset.grow || "100%";
    canvas.replaceChildren(clone);
  }
  function buildThumb(index) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nk-thumb";
    btn.dataset.thumbIndex = String(index);
    btn.title = T.slide(index + 1);
    btn.setAttribute("aria-label", T.slide(index + 1));
    const canvas = document.createElement("div");
    canvas.className = "nk-thumb-canvas";
    canvas.setAttribute("inert", "");
    canvas.setAttribute("aria-hidden", "true");
    const num = document.createElement("span");
    num.className = "nk-thumb-num";
    num.textContent = String(index + 1);
    btn.append(canvas, num);
    btn.addEventListener("click", () => navTo(index));
    return btn;
  }
  function rebuildThumbs() {
    if (!thumbBtns.length) {
      thumbBtns = sections.map((_, i) => buildThumb(i));
      panelListEl.replaceChildren(...thumbBtns);
    }
    thumbBtns.forEach((btn, i) => fillThumbCanvas(btn.firstChild, i));
  }
  function syncActiveThumb(instant) {
    if (!panelOpen) return;
    thumbBtns.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === current);
      if (i === current) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });
    thumbBtns[current]?.scrollIntoView({ block: "nearest", behavior: STATIC || instant ? "auto" : "smooth" });
  }
  function scheduleActiveThumbRefresh() {
    if (!panelOpen || thumbRefreshQueued) return;
    thumbRefreshQueued = true;
    requestAnimationFrame(() => {
      thumbRefreshQueued = false;
      if (!panelOpen) return;
      const btn = thumbBtns[current];
      if (btn) fillThumbCanvas(btn.firstChild, current);
    });
  }
  function setPanelOpen(open) {
    if (panelOpen === open) return;
    panelOpen = open;
    panelBtn.replaceChildren(icon(open ? "panelClose" : "panel"));
    panelBtn.title = open ? T.panelHide : T.panelShow;
    panelBtn.setAttribute("aria-label", open ? T.panelHideAria : T.panelShowAria);
    panelBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      rebuildThumbs();
      panelEl.hidden = false;
      if (STATIC) {
        panelEl.style.width = "256px";
      } else {
        const anim = animateSafe(panelEl, [{ width: "0px" }, { width: "256px" }], PANEL_ANIM);
        settleOnFinish(anim, panelEl, { width: "256px" });
      }
      syncActiveThumb(true);
    } else {
      const done = () => {
        panelEl.hidden = true;
        panelEl.style.width = "";
      };
      if (STATIC) {
        done();
      } else {
        const anim = animateSafe(panelEl, [{ width: "256px" }, { width: "0px" }], PANEL_ANIM);
        anim.finished.then(() => {
          anim.cancel();
          done();
        }).catch(done);
      }
    }
  }
  let touchStart = null;
  function attachSwipe(el) {
    el.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY, time: Date.now() };
    }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2 && Date.now() - touchStart.time < 600) {
        go(dx < 0 ? current + 1 : current - 1);
      }
      touchStart = null;
    }, { passive: true });
  }
  const INSPECT_TEXT_CAP = 300;
  let inspectOn = false;
  let inspectEl = null;
  let inspectBox = null;
  function inspectTarget(node) {
    const el = node instanceof Element ? node : null;
    const section = el?.closest("section");
    return section && sections.includes(section) ? el : null;
  }
  function inspectPayload(el) {
    const section = el.closest("section");
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
    const attrs = {};
    for (const a of el.attributes) if (a.name.startsWith("data-nk-")) attrs[a.name] = a.value;
    return {
      index: sections.indexOf(section),
      id: section.dataset.nkSlide ?? null,
      block: el.closest("[data-nk-block]")?.dataset.nkBlock ?? null,
      tag,
      nth: [...section.querySelectorAll(tag)].indexOf(el) + 1,
      text: text.slice(0, INSPECT_TEXT_CAP),
      truncated: text.length > INSPECT_TEXT_CAP,
      personalized: el.hasAttribute("data-nk-text") || Boolean(el.querySelector("[data-nk-text]")),
      attrs
    };
  }
  function inspectMount() {
    if (inspectBox) return;
    const style = document.createElement("style");
    style.textContent = ".nk-inspect-box{position:fixed;top:0;left:0;pointer-events:none;z-index:2147483000;outline:2px solid #0ea5e9;background:rgba(14,165,233,.09)}.nk-inspect-on,.nk-inspect-on *{cursor:crosshair!important}";
    document.head.appendChild(style);
    inspectBox = document.body.appendChild(document.createElement("div"));
    inspectBox.className = "nk-inspect-box";
  }
  function inspectSync() {
    if (!inspectBox) return;
    if (!inspectOn || !inspectEl) {
      inspectBox.style.cssText = "display:none";
      return;
    }
    const r = inspectEl.getBoundingClientRect();
    inspectBox.style.cssText = `transform:translate(${r.left}px,${r.top}px);width:${r.width}px;height:${r.height}px`;
  }
  function onInspectMove(event) {
    const el = inspectTarget(event.target);
    if (el === inspectEl) return;
    inspectEl = el;
    inspectSync();
  }
  function onInspectHit(event) {
    const el = inspectTarget(event.target);
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.type !== "click") return;
    inspectEl = el;
    inspectSync();
    emitInspect(inspectPayload(el));
  }
  function emitInspect(target) {
    if (!embedded) return;
    window.parent.postMessage({ type: "naimi:event", payload: { kind: "inspect", on: inspectOn, target } }, "*");
  }
  function setInspect(on) {
    const next = Boolean(on);
    if (next === inspectOn || next && STATIC) return;
    inspectOn = next;
    const bind = next ? "addEventListener" : "removeEventListener";
    for (const type of ["pointerdown", "click"]) document[bind](type, onInspectHit, true);
    document[bind]("pointermove", onInspectMove, true);
    window[bind]("scroll", inspectSync, true);
    window[bind]("resize", inspectSync);
    if (next) inspectMount();
    else inspectEl = null;
    deckRoot.classList.toggle("nk-inspect-on", next);
    inspectSync();
    emitInspect(null);
  }
  function inspectEscape() {
    if (!inspectOn) return false;
    setInspect(false);
    return true;
  }
  const kit = {
    personalization: personalizationValue,
    field: fieldValue,
    setField,
    onChange(fn) {
      stateListeners.add(fn);
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
      return () => stateListeners.delete(fn);
    },
    state: () => state ?? EMPTY_STATE,
    go: (i) => navTo(i),
    index: () => current,
    count: () => sections.length
  };
  window.naimi = {
    ready(fn) {
      if (started) {
        try {
          fn(kit);
        } catch (e) {
          console.error(e);
        }
      } else readyCallbacks.push(fn);
    },
    kit,
    static: STATIC,
    get format() {
      return DOC ? "document" : "slides";
    },
    get page() {
      return PAGE;
    }
  };
  function init() {
    buildPlayer();
    startHost();
    started = true;
    for (const fn of readyCallbacks) {
      try {
        fn(kit);
      } catch (e) {
        console.error(e);
      }
    }
    readyCallbacks.length = 0;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
