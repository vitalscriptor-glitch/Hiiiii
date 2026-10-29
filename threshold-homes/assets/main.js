/* Threshold Homes
   The hero walkthrough is driven by scroll: down walks forward, up walks back.
   Laptops scrub a video. Phones and tablets draw still frames on a canvas,
   because in-app browsers often will not paint a paused video after a seek.
   The page is complete without either, so every failure lands on a still. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ hero */

  const FILM_SHARE = 0.88;   // share of the hero scroll the walk takes; the rest holds the last frame
  const SETTLE_AT = 0.9;     // where the name card arrives
  const TAU = 0.11;          // seconds the picture takes to close most of the gap to the scroll; higher is smoother
  const REST = 0.004;        // seconds; closer than this and the loop stops
  const IDLE_MS = 15000;     // no bytes for this long and a download is abandoned

  const hero = $('.hero');
  const stage = $('.stage', hero);
  const video = $('.film', hero);
  const canvas = $('.reel', hero);
  const settle = $('[data-settle]', hero);
  const loader = $('[data-loader]', hero);
  const loaderText = $('[data-loader-text]', hero);
  const loaderFill = $('.loader-fill', hero);
  const hint = $('.hint', hero);
  const stones = $$('.stones li', hero);
  const caps = $$('.cap', hero).map(el => ({ el, a: +el.dataset.in, b: +el.dataset.out }));

  const touch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const wide = matchMedia('(min-aspect-ratio: 1/1)').matches;

  let isStatic = root.classList.contains('static-hero');
  let duration = 10;
  let progress = 0, target = 0, shown = 0;
  let running = false, engine = null;
  let lastCap = -2, lastStones = -1, lastSettle = null, lastHint = null, lastPct = -1;

  // Read the hero's position straight from layout, so this works whichever
  // element is doing the scrolling.
  function readScroll() {
    const r = hero.getBoundingClientRect();
    progress = clamp(-r.top / Math.max(1, r.height - stage.offsetHeight), 0, 1);
    target = clamp(progress / FILM_SHARE, 0, 1) * duration;
  }

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

    if (engine && engine.ready) engine.show(shown, now);
    if (isStatic) { running = false; return; }
    paint();

    if (shown !== target) requestAnimationFrame(tick);
    else { running = false; lastT = 0; }
  }

  function kick() {
    if (running || isStatic) return;
    running = true;
    requestAnimationFrame(tick);
  }

  function reveal(kind) {
    root.dataset.engine = kind;
    root.classList.add('is-ready');
  }

  function showProgress(f) {
    if (f < 0) { loader.classList.add('is-indeterminate'); return; }
    const pct = Math.min(100, Math.floor(f * 100));
    if (pct === lastPct) return;
    lastPct = pct;
    loaderFill.style.strokeDashoffset = String(1 - pct / 100);
    loaderText.textContent = pct < 100 ? 'Loading · ' + pct + '%' : 'Ready';
    if (pct >= 100) setTimeout(() => loader.classList.add('is-gone'), 600);
  }

  // Fetch a file as one Blob, reporting progress as the bytes arrive.
  async function download(url, onProgress) {
    const ctrl = new AbortController();
    let idle;
    const arm = () => { clearTimeout(idle); idle = setTimeout(() => ctrl.abort(), IDLE_MS); };
    arm();
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const total = +res.headers.get('Content-Length') || 0;
      if (!res.body || !total) { const b = await res.blob(); onProgress(b.size, b.size); return b; }
      const reader = res.body.getReader();
      const parts = [];
      let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value);
        got += value.byteLength;
        arm();
        onProgress(got, total);
      }
      return new Blob(parts);
    } finally {
      clearTimeout(idle);
    }
  }

  /* ---------- laptops: scrub a video ---------- */

  function videoEngine(src) {
    const HALF_FRAME = 1 / 120;   // the film runs at 60 fps; nearer than half a frame needs no seek
    const STALL_MS = 1500;        // a seek that takes longer than this counts as a stall
    let inFlight = false, queued = null, seekStart = 0, stalls = 0, played = false;
    const e = { kind: 'video', ready: false };

    function seek(t) {
      t = Math.min(t, duration - 0.04);
      if (inFlight) { queued = t; return; }
      if (Math.abs(video.currentTime - t) < HALF_FRAME) return;
      inFlight = true;
      seekStart = performance.now();
      video.currentTime = t;
    }
    const onSeeked = () => {
      inFlight = false;
      stalls = 0;
      if (e.ready && !root.classList.contains('is-ready')) reveal('video');
      if (queued !== null) { const q = queued; queued = null; seek(q); }
    };
    video.addEventListener('seeked', onSeeked);

    // Some browsers will not paint a seeked frame until the video has played
    // once, and some only allow that after the visitor touches the page.
    const prime = () => video.play().then(() => { played = true; video.pause(); }, () => {});
    const primeOnGesture = () => { if (e.ready && !played) prime().then(() => seek(shown)); };
    ['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, primeOnGesture, { passive: true }));

    function attach(url) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('video did not decode')), 12000);
        video.addEventListener('loadeddata', () => { clearTimeout(timer); resolve(); }, { once: true });
        video.addEventListener('error', () => { clearTimeout(timer); reject(new Error('video error')); }, { once: true });
        video.src = url;
        video.load();
      });
    }

    e.show = (t, now) => {
      if (inFlight && now - seekStart > STALL_MS) {
        inFlight = false;
        if (++stalls >= 3) { goStatic('seeks are not landing'); return; }
      }
      seek(t);
    };

    e.stop = () => {
      video.removeEventListener('seeked', onSeeked);
      if (video.src.startsWith('blob:')) URL.revokeObjectURL(video.src);
      video.removeAttribute('src');
      video.load();
    };

    e.start = async () => {
      if (!video.canPlayType('video/mp4; codecs="avc1.64002A"')) throw new Error('this browser cannot play H.264');
      // Prefer the in-memory copy. If the download or a blob: source is refused,
      // stream the file directly instead.
      let blobUrl = null;
      try {
        blobUrl = URL.createObjectURL(await download(src, (n, total) => showProgress(n / total)));
      } catch (err) { showProgress(-1); }
      if (blobUrl) {
        try { await attach(blobUrl); } catch (err) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
      }
      if (!blobUrl) await attach(src);
      await prime();
      duration = video.duration || duration;
      // a server that cannot answer range requests leaves the film unseekable
      const sk = video.seekable;
      if (!sk.length || sk.end(sk.length - 1) < duration - 0.5) throw new Error('video is not seekable');
      showProgress(1);
      e.ready = true;
      readScroll();
      seek(shown);
      if (!inFlight) reveal('video');
      kick();
    };
    return e;
  }

  /* ---------- phones and tablets: draw still frames ---------- */

  // The frames arrive in rounds: every 32nd frame first, then the gaps halve
  // each round. The walk moves as soon as the first round lands and gets
  // smoother as the rest fill in. Between two frames the next one is faded in
  // by how far the scroll has got, so motion stays smooth at any speed.
  function frameEngine(base) {
    const MAX_DECODED = 24;       // decoded frames kept in memory, nearest first
    const ctx = canvas.getContext('2d', { alpha: false });
    const blobs = [], bitmaps = new Map(), pending = new Set();
    let fps = 30, count = 0, fw = 720, fh = 1280;
    let cw = 0, ch = 0, lastKey = '', lastShown = 0, redrawQueued = false, drawn = false;
    const e = { kind: 'frames', ready: false };

    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr);
      if (w !== cw || h !== ch) { canvas.width = cw = w; canvas.height = ch = h; lastKey = ''; }
    }

    // cover the canvas, matching the poster's object-position of 50% 45%
    function blit(img, alpha) {
      const s = Math.max(cw / fw, ch / fh), dw = fw * s, dh = fh * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - dw) * 0.5, (ch - dh) * 0.45, dw, dh);
    }

    function viaImg(blob) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('frame did not decode'));
        img.src = URL.createObjectURL(blob);
      });
    }
    const decodeBlob = blob => window.createImageBitmap
      ? createImageBitmap(blob).catch(() => viaImg(blob))
      : viaImg(blob);

    function evict() {
      if (bitmaps.size <= MAX_DECODED) return;
      const c = Math.round(shown * fps);
      const far = [...bitmaps.keys()].sort((a, b) => Math.abs(b - c) - Math.abs(a - c));
      while (bitmaps.size > MAX_DECODED) {
        const k = far.shift(), img = bitmaps.get(k);
        if (img.close) img.close();
        else if (img.src) URL.revokeObjectURL(img.src);
        bitmaps.delete(k);
      }
    }

    function decode(i) {
      if (i < 0 || bitmaps.has(i) || pending.has(i) || !blobs[i] || pending.size >= 4) return;
      pending.add(i);
      decodeBlob(blobs[i]).then(img => {
        bitmaps.set(i, img);
        evict();
      }, () => {}).then(() => { pending.delete(i); redraw(); });
    }

    function nearest(has, i) {
      for (let d = 0; d < count; d++) {
        if (i - d >= 0 && has(i - d)) return i - d;
        if (i + d < count && has(i + d)) return i + d;
      }
      return -1;
    }
    const isDecoded = i => bitmaps.has(i);
    const isLoaded = i => !!blobs[i];

    function redraw() {
      if (redrawQueued || isStatic) return;
      redrawQueued = true;
      requestAnimationFrame(() => { redrawQueued = false; e.show(shown); });
    }

    e.show = t => {
      fit();
      const f = clamp(t * fps, 0, count - 1);
      const i0 = Math.floor(f), i1 = Math.min(count - 1, i0 + 1), a = f - i0;
      const dir = t >= lastShown ? 1 : -1;
      lastShown = t;

      // keep the frames around the playhead decoded, further ahead in the direction of travel
      for (let k = -2; k <= 6; k++) decode(nearest(isLoaded, i0 + k * dir));

      const b0 = isDecoded(i0) ? i0 : nearest(isDecoded, i0);
      if (b0 < 0) return;
      const mix = b0 === i0 && i1 !== i0 && isDecoded(i1) ? Math.round(a * 24) / 24 : 0;
      const key = b0 + ':' + mix + ':' + cw + 'x' + ch;
      if (key === lastKey) return;
      lastKey = key;
      blit(bitmaps.get(b0), 1);
      if (mix > 0) blit(bitmaps.get(i1), mix);
      ctx.globalAlpha = 1;
      if (!drawn) { drawn = true; reveal('frames'); }
    };

    e.stop = () => {
      bitmaps.forEach(img => { if (img.close) img.close(); });
      bitmaps.clear();
    };

    e.start = async () => {
      if (!ctx) throw new Error('no canvas');
      const res = await fetch(base + 'index.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const idx = await res.json();
      fps = idx.fps; count = idx.count; fw = idx.w; fh = idx.h;
      duration = (count - 1) / fps;
      let got = 0;
      const fetchFrame = async i => {
        const r = await fetch(base + 'f' + String(i).padStart(3, '0') + '.webp');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        blobs[i] = await r.blob();
        showProgress(++got / count);
        if (e.ready) redraw();
      };

      // the first round all at once; if it cannot load, let the video try instead
      await Promise.all(idx.rounds[0].map(fetchFrame));
      // make sure this browser can decode the frames before committing to them
      const first = await decodeBlob(blobs[0]);
      if (first.close) first.close();
      e.ready = true;
      readScroll();
      kick();

      // the rest, a few at a time, in round order; a missing frame is covered by its neighbours
      const rest = idx.rounds.slice(1).flat();
      let k = 0;
      const worker = async () => {
        while (k < rest.length) {
          const i = rest[k++];
          try { await fetchFrame(i); } catch (err) { showProgress(++got / count); }
        }
      };
      await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
      showProgress(1);
    };
    return e;
  }

  function goStatic(reason) {
    if (isStatic) return;
    const r = hero.getBoundingClientRect();
    const past = -r.top - (r.height - stage.offsetHeight);   // how far below the hero the visitor is
    isStatic = true;
    running = false;
    if (engine && engine.stop) engine.stop();
    engine = null;
    root.classList.add('static-hero');
    root.classList.remove('is-ready');
    loader.classList.add('is-gone');
    // keep the visitor where they were relative to the content below the hero
    if (r.top < 0) scrollTo({ top: past > 0 ? hero.offsetTop + hero.offsetHeight + past : 0, behavior: 'instant' });
    console.info('[hero] showing the still image:', reason);
  }

  async function start() {
    const tall = wide ? 'assets/hero-wide.mp4' : 'assets/hero-tall.mp4';
    const order = touch ? ['frames', 'video'] : ['video', 'frames'];
    for (const kind of order) {
      if (isStatic) return;
      engine = kind === 'frames' ? frameEngine('assets/seq/') : videoEngine(tall);
      try {
        await engine.start();
        return;
      } catch (err) {
        console.info('[hero] ' + kind + ' unavailable:', err && err.message);
        if (engine && engine.stop) engine.stop();
        engine = null;
        lastPct = -1;
      }
    }
    goStatic('no way to show the walk here');
  }

  readScroll();
  shown = target;
  if (!isStatic) {
    paint();
    // capture catches scrolling on the page and on any inner scrolling element
    document.addEventListener('scroll', kick, { capture: true, passive: true });
    addEventListener('resize', kick);
    addEventListener('pageshow', kick);
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
    const fmt = n => n.toLocaleString('en-US');
    if (reduced || end === 0) { el.textContent = fmt(end); return; }
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

  /* ------------------------------------------------------------ home finder */

  const form = $('[data-form]');
  const finder = $('[data-finder]');
  if (finder) {
    const buttons = $$('[role="radio"]', finder);
    const sumEl = $('[data-sum]', finder);
    const pick = name => $('input[name="' + name + '"]:checked', finder).value;

    const summary = () => {
      const beds = pick('beds'), type = pick('type');
      const goal = finder.dataset.mode === 'rent' ? 'to rent' : 'to buy';
      return 'a ' + beds + ' bedroom ' + type + ' ' + goal;
    };
    const update = () => { sumEl.textContent = summary(); };

    const setMode = mode => {
      finder.dataset.mode = mode;
      buttons.forEach(b => {
        const on = b.dataset.mode === mode;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      update();
    };

    buttons.forEach((b, i) => {
      b.addEventListener('click', () => setMode(b.dataset.mode));
      b.addEventListener('keydown', e => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
        e.preventDefault();
        const next = buttons[(i + 1) % buttons.length];
        next.focus();
        setMode(next.dataset.mode);
      });
    });
    buttons[1].tabIndex = -1;
    finder.addEventListener('change', update);

    // carry the visitor's choices into the call form below
    $('[data-finder-go]', finder).addEventListener('click', () => {
      if (!form) return;
      const want = finder.dataset.mode === 'rent' ? 'rent' : 'buy';
      $('input[name="want"][value="' + want + '"]', form).checked = true;
      const s = summary();
      form.elements.need.value = s.charAt(0).toUpperCase() + s.slice(1);
    });
  }

  /* ------------------------------------------------------------ call form */

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
