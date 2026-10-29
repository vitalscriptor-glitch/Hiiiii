/* The Water House
   The hero film is driven by scroll: down walks forward, up walks back.
   The page is complete without it, so every failure lands on a still. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ hero */

  const FILM_SHARE = 0.88;   // share of the hero scroll the film takes; the rest holds the last frame
  const SETTLE_AT = 0.9;     // where the name card arrives
  const TAU = 0.11;          // seconds the picture takes to close most of the gap to the scroll; higher is smoother
  const HALF_FRAME = 1 / 120; // the film runs at 60 fps; nearer than half a frame needs no seek
  const REST = 0.004;        // seconds; closer than this and the loop stops
  const STALL_MS = 1500;     // a seek that takes longer than this counts as a stall
  const IDLE_MS = 15000;     // no bytes for this long and the download is abandoned

  const hero = $('.hero');
  const stage = $('.stage', hero);
  const video = $('.film', hero);
  const settle = $('[data-settle]', hero);
  const loader = $('[data-loader]', hero);
  const loaderText = $('[data-loader-text]', hero);
  const loaderFill = $('.loader-fill', hero);
  const hint = $('.hint', hero);
  const stones = $$('.stones li', hero);
  const caps = $$('.cap', hero).map(el => ({ el, a: +el.dataset.in, b: +el.dataset.out }));
  // Landscape screens only ever show the middle band of the tall clip, so they
  // get a file cropped to that band at a higher resolution: sharper, and lighter.
  const src = matchMedia('(min-aspect-ratio: 1/1)').matches ? 'assets/hero-wide.mp4' : 'assets/hero-tall.mp4';

  let isStatic = root.classList.contains('static-hero');
  let duration = 10;
  let heroTop = 0, heroSpan = 1;
  let progress = 0, target = 0, shown = 0;
  let running = false, ready = false;
  let inFlight = false, queued = null, seekStart = 0, stalls = 0;
  let lastCap = -2, lastStones = -1, lastSettle = null, lastHint = null, lastPct = -1;

  function measure() {
    heroTop = hero.getBoundingClientRect().top + scrollY;
    heroSpan = Math.max(1, hero.offsetHeight - stage.offsetHeight);
  }

  function readScroll() {
    progress = clamp((scrollY - heroTop) / heroSpan, 0, 1);
    target = clamp(progress / FILM_SHARE, 0, 1) * duration;
  }

  // One seek at a time. A newer request waits for the current one to land.
  function seek(t) {
    t = Math.min(t, duration - 0.04);
    if (inFlight) { queued = t; return; }
    if (Math.abs(video.currentTime - t) < HALF_FRAME) return;
    inFlight = true;
    seekStart = performance.now();
    video.currentTime = t;
  }

  video.addEventListener('seeked', () => {
    inFlight = false;
    stalls = 0;
    reveal();
    if (queued !== null) { const q = queued; queued = null; seek(q); }
  });

  // DOM writes only when something visible changes.
  function paint() {
    const settled = progress >= SETTLE_AT;
    let ci = -1, reached = 0;
    for (let i = 0; i < caps.length; i++) {
      if (shown >= caps[i].a) reached = i + 1;
      if (ci < 0 && shown >= caps[i].a && shown < caps[i].b) ci = i;
    }
    if (settled) { ci = -1; reached = stones.length; }

    if (ci !== lastCap) {
      caps.forEach((c, i) => c.el.classList.toggle('is-on', i === ci));
      lastCap = ci;
    }
    if (settled !== lastSettle) {
      settle.classList.toggle('is-on', settled);
      stage.classList.toggle('is-settled', settled);
      lastSettle = settled;
    }
    if (reached !== lastStones) {
      stones.forEach((s, i) => {
        s.classList.toggle('on', i < reached);
        s.classList.toggle('now', i === reached - 1);
      });
      lastStones = reached;
    }
    const showHint = progress < 0.012;
    if (showHint !== lastHint) { hint.classList.toggle('is-gone', !showHint); lastHint = showHint; }
  }

  // Easing is tied to real time, not to frames, so it feels the same on a
  // 60 Hz laptop and a 120 Hz phone.
  let lastT = 0;
  function tick(now) {
    const dt = lastT ? Math.min(0.1, (now - lastT) / 1000) : 1 / 60;
    lastT = now;
    readScroll();
    const d = target - shown;
    shown = Math.abs(d) < REST ? target : shown + d * (1 - Math.exp(-dt / TAU));

    if (ready) {
      if (inFlight && performance.now() - seekStart > STALL_MS) {
        inFlight = false;
        if (++stalls >= 3) { goStatic('seeks are not landing'); return; }
      }
      seek(shown);
    }
    paint();

    if (shown !== target) requestAnimationFrame(tick);
    else { running = false; lastT = 0; }
  }

  function kick() {
    if (running || isStatic) return;
    running = true;
    requestAnimationFrame(tick);
  }

  function reveal() {
    if (!ready || root.classList.contains('is-ready')) return;
    root.classList.add('is-ready');
  }

  function showProgress(f) {
    if (f < 0) { loader.classList.add('is-indeterminate'); return; }
    const pct = Math.min(100, Math.floor(f * 100));
    if (pct === lastPct) return;
    lastPct = pct;
    loaderFill.style.strokeDashoffset = String(1 - pct / 100);
    loaderText.textContent = 'Loading the video · ' + pct + '%';
  }

  // Fetch the whole film as one Blob, so every seek is served from memory
  // instead of a fresh range request.
  async function download(url) {
    const ctrl = new AbortController();
    let idle;
    const arm = () => { clearTimeout(idle); idle = setTimeout(() => ctrl.abort(), IDLE_MS); };
    arm();
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const total = +res.headers.get('Content-Length') || 0;
      if (!res.body || !total) { showProgress(-1); return await res.blob(); }
      const reader = res.body.getReader();
      const parts = [];
      let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value);
        got += value.byteLength;
        arm();
        showProgress(got / total);
      }
      return new Blob(parts, { type: 'video/mp4' });
    } finally {
      clearTimeout(idle);
    }
  }

  function attach(url) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('video did not decode')), 12000);
      video.addEventListener('loadeddata', () => { clearTimeout(timer); resolve(); }, { once: true });
      video.addEventListener('error', () => { clearTimeout(timer); reject(new Error('video error')); }, { once: true });
      video.src = url;
      video.load();
    });
  }

  // Many mobile browsers will not paint a seeked frame until the element has played once.
  async function prime() {
    try { await video.play(); } catch (e) { /* autoplay refused; seeking still works on most */ }
    video.pause();
  }

  function goStatic(reason) {
    if (isStatic) return;
    isStatic = true;
    running = false;
    const past = scrollY - (heroTop + heroSpan);
    root.classList.add('static-hero');
    root.classList.remove('is-ready');
    loader.classList.add('is-gone');
    if (video.src) {
      if (video.src.startsWith('blob:')) URL.revokeObjectURL(video.src);
      video.removeAttribute('src');
      video.load();
    }
    measure();
    // keep the visitor where they were relative to the content below the hero
    if (scrollY > 0) scrollTo({ top: past > 0 ? hero.offsetHeight + past : 0, behavior: 'instant' });
    console.info('[hero] showing the still image:', reason);
  }

  async function start() {
    if (!video.canPlayType('video/mp4; codecs="avc1.64002A"')) return goStatic('this browser cannot play H.264');
    // Prefer the in-memory copy. If the download or a blob: source is refused
    // (some hosts' security rules block one or the other), stream the file directly.
    let blobUrl = null;
    try { blobUrl = URL.createObjectURL(await download(src)); } catch (e) { loader.classList.add('is-indeterminate'); }
    try {
      if (blobUrl) {
        try { await attach(blobUrl); } catch (e) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
      }
      if (!blobUrl) await attach(src);
      await prime();
      if (isStatic) return;
      duration = video.duration || duration;
      // a server that cannot answer range requests leaves the film unseekable
      const sk = video.seekable;
      if (!sk.length || sk.end(sk.length - 1) < duration - 0.5) throw new Error('video is not seekable');
      ready = true;
      readScroll();
      seek(shown);
      if (!inFlight) reveal();
      kick();
    } catch (err) {
      goStatic(err && err.message ? err.message : 'video unavailable');
    }
  }

  measure();
  readScroll();
  shown = target;
  if (!isStatic) {
    paint();
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', () => { measure(); kick(); });
    addEventListener('load', () => { measure(); kick(); });
    addEventListener('pageshow', () => { measure(); kick(); });
    start();
  }

  /* ------------------------------------------------------------ nav */

  const nav = $('[data-nav]');
  new IntersectionObserver(([e]) => nav.classList.toggle('is-solid', !e.isIntersecting), {
    rootMargin: '0px 0px -92% 0px'
  }).observe(hero);

  /* ------------------------------------------------------------ reveals and counters */

  function countUp(el) {
    const end = +el.dataset.count;
    const sep = el.hasAttribute('data-sep');
    const fmt = n => sep ? n.toLocaleString('en-US') : String(n);
    if (reduced) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const k = clamp((now - t0) / dur, 0, 1);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .reveal-mask, .horizon, .path').forEach(el => io.observe(el));

  /* ------------------------------------------------------------ the floor picker */

  const plan = $('[data-plan]');
  if (plan) {
    const buttons = $$('[role="radio"]', plan);
    const rows = $$('.row', plan);
    const totalEl = $('[data-total]', plan);
    const note = $('[data-note]', plan);
    const notes = {
      ground: 'Every room down here opens onto the pool or the terrace.',
      upper: 'Every bedroom up here has a sea view and its own bathroom.'
    };
    const sum = floor => rows
      .filter(r => r.dataset.floor === floor)
      .reduce((n, r) => n + +$('dd', r).dataset.v, 0);
    let shownTotal = sum('ground'), anim = 0;

    const animateTotal = to => {
      cancelAnimationFrame(anim);
      const from = shownTotal, t0 = performance.now(), dur = reduced ? 1 : 700;
      const step = now => {
        const k = clamp((now - t0) / dur, 0, 1);
        shownTotal = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        totalEl.textContent = String(shownTotal);
        if (k < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    };

    const setFloor = floor => {
      plan.dataset.mode = floor;
      rows.forEach(r => r.classList.toggle('is-off', r.dataset.floor !== floor));
      buttons.forEach(b => {
        const on = b.dataset.mode === floor;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      note.textContent = notes[floor];
      animateTotal(sum(floor));
    };

    buttons.forEach((b, i) => {
      b.addEventListener('click', () => setFloor(b.dataset.mode));
      b.addEventListener('keydown', e => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
        e.preventDefault();
        const next = buttons[(i + 1) % buttons.length];
        next.focus();
        setFloor(next.dataset.mode);
      });
    });
    buttons[1].tabIndex = -1;
    totalEl.textContent = String(shownTotal);
  }

  /* ------------------------------------------------------------ visit form */

  const form = $('[data-form]');
  if (form) {
    const fields = {
      name: { el: form.elements.name, ok: v => v.trim().length >= 2, msg: 'Please add your name.' },
      phone: { el: form.elements.phone, ok: v => v.replace(/\D/g, '').length >= 7, msg: 'Please add a phone number we can call.' }
    };
    const check = key => {
      const f = fields[key];
      const good = f.ok(f.el.value);
      const wrap = f.el.closest('.field');
      wrap.classList.toggle('has-err', !good);
      $('.err', wrap).textContent = good ? '' : f.msg;
      f.el.setAttribute('aria-invalid', String(!good));
      return good;
    };
    Object.keys(fields).forEach(k => fields[k].el.addEventListener('blur', () => {
      if (fields[k].el.value) check(k);
    }));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const bad = Object.keys(fields).filter(k => !check(k));
      if (bad.length) { fields[bad[0]].el.focus(); return; }
      // No mail service is connected, so the thank-you says so plainly.
      const first = fields.name.el.value.trim().split(/\s+/)[0];
      $('[data-done-name]', form).textContent = ', ' + first;
      const done = $('.form-done', form);
      done.hidden = false;
      form.classList.add('is-done');
      done.setAttribute('tabindex', '-1');
      done.focus({ preventScroll: true });
    });
  }
})();
