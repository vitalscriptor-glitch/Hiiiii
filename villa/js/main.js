/* ============================================================
   The Emirat
   The tour plays itself so its transitions read at natural speed.
   The moment you scroll, scroll takes over the playhead.
   ============================================================ */

(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- reveal on enter --- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  }

  /* --- sticky conversion bar --- */
  const hero = document.getElementById('hero');
  const bar  = document.getElementById('bar');
  if (hero && bar) {
    const onBar = () => bar.classList.toggle('is-up',
      hero.getBoundingClientRect().bottom < window.innerHeight * 0.65);
    addEventListener('scroll', onBar, { passive: true });
    addEventListener('resize', onBar, { passive: true });
    onBar();
  }

  /* --- the tour --- */
  const video   = document.getElementById('tour');
  const barFill = document.getElementById('heroBar');
  const card    = document.getElementById('heroCard');
  const hint    = document.getElementById('heroHint');
  const caps    = [...document.querySelectorAll('.cap')];

  if (!hero || !video) return;
  if (reduced) { card?.classList.add('is-on'); return; }

  const EASE = 0.14;          // lower is smoother and laggier
  const SNAP = 0.008;         // stop easing inside this many seconds
  const WRITE = 0.012;        // don't write currentTime for less than this

  let duration = 0;
  let mode = 'play';          // 'play' until the visitor scrolls, then 'scrub'
  let target = 0, shown = 0;
  let fails = 0, primed = false, started = false;

  // Scroll maps to time from wherever playback had reached, so handing over
  // never jumps the picture.
  let anchorScroll = 0, anchorTime = 0;

  const clamp = (n, a, b) => n < a ? a : n > b ? b : n;
  const travel = () => Math.max(1, hero.getBoundingClientRect().height - window.innerHeight);

  /* Mobile browsers often refuse to decode until the element has played once. */
  function prime() {
    if (primed) return;
    primed = true;
    const p = video.play();
    if (p && typeof p.then === 'function') p.catch(() => takeOver());
  }

  /* Hand the playhead to the scroll. */
  function takeOver() {
    if (mode === 'scrub') return;
    mode = 'scrub';
    video.loop = false;
    video.pause();
    anchorScroll = window.scrollY;
    anchorTime = video.currentTime;
    shown = video.currentTime;
    target = shown;
  }

  /* Paint whatever the playhead currently is. */
  function paint() {
    if (!duration) return;
    const p = clamp(video.currentTime / duration, 0, 1);
    if (barFill) barFill.style.width = (p * 100).toFixed(2) + '%';
    caps.forEach(c => c.classList.toggle('is-on', p >= +c.dataset.in && p < +c.dataset.out));
    // Only once the visitor is driving, or the looping tour would flash it.
    card?.classList.toggle('is-on', mode === 'scrub' && p > 0.94);
  }

  function loop() {
    if (mode === 'scrub') {
      shown += (target - shown) * EASE;
      if (Math.abs(target - shown) < SNAP) shown = target;

      if (video.readyState >= 2 && Math.abs(video.currentTime - shown) > WRITE) {
        const before = video.currentTime;
        try { video.currentTime = shown; } catch (_) { fails++; }
        if (before === video.currentTime && Math.abs(before - shown) > 0.25) {
          if (++fails > 45) {
            hero.classList.add('no-scrub');
            card?.classList.add('is-on');
            return;
          }
        } else fails = 0;
      }
    }
    paint();
    requestAnimationFrame(loop);
  }

  function onScroll() {
    if (mode === 'play') {
      // Ignore the browser restoring a scroll position before anything played.
      if (!started) return;
      takeOver();
    }
    target = clamp(anchorTime + ((window.scrollY - anchorScroll) / travel()) * duration, 0, duration);
    hint?.classList.toggle('is-off', window.scrollY > 24);
  }

  function onMeta() {
    duration = video.duration;
    if (!isFinite(duration) || duration <= 0) {
      hero.classList.add('no-scrub');
      card?.classList.add('is-on');
      return;
    }
    video.loop = true;              // keep the tour alive until it is taken over
    prime();
    started = true;
    loop();
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { if (mode === 'scrub') onScroll(); }, { passive: true });
  ['pointerdown', 'touchstart', 'keydown'].forEach(ev =>
    addEventListener(ev, prime, { once: true, passive: true }));

  if (video.readyState >= 1) onMeta();
  else video.addEventListener('loadedmetadata', onMeta, { once: true });

  video.addEventListener('error', () => {
    hero.classList.add('no-scrub');
    card?.classList.add('is-on');
  }, { once: true });
})();


/* ============================================================
   Enquiry form — validates here, and says plainly that nothing
   was sent, because no mail service is connected yet.
   ============================================================ */

(() => {
  'use strict';
  const form = document.getElementById('enqForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name, email = form.elements.email;
    let bad = null;

    [name, email].forEach(f => f.removeAttribute('aria-invalid'));
    if (!name.value.trim()) { name.setAttribute('aria-invalid', 'true'); bad = bad || name; }
    if (!emailOk(email.value.trim())) { email.setAttribute('aria-invalid', 'true'); bad = bad || email; }

    if (bad) {
      status.textContent = 'Please check the highlighted fields.';
      status.classList.add('is-err');
      bad.focus();
      return;
    }

    status.classList.remove('is-err');
    status.textContent = 'Validated, but not sent — this demonstration page has no mail service connected yet.';
  });
})();
