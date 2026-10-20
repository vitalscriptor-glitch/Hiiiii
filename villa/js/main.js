/* ============================================================
   Villa 24 — scroll drives the tour video's currentTime.
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

  /* --- sticky conversion bar: show once the hero is behind us --- */
  const hero = document.getElementById('hero');
  const bar  = document.getElementById('bar');
  if (hero && bar) {
    const onBar = () => {
      const past = hero.getBoundingClientRect().bottom < window.innerHeight * 0.65;
      bar.classList.toggle('is-up', past);
    };
    addEventListener('scroll', onBar, { passive: true });
    addEventListener('resize', onBar, { passive: true });
    onBar();
  }

  /* --- the scrub --- */
  const video = document.getElementById('tour');
  const barFill = document.getElementById('heroBar');
  const card  = document.getElementById('heroCard');
  const hint  = document.getElementById('heroHint');
  const caps  = [...document.querySelectorAll('.cap')];

  if (!hero || !video) return;

  if (reduced) { card?.classList.add('is-on'); return; }

  let duration = 0, target = 0, shown = 0, ticking = false, fails = 0, primed = false;
  const clamp01 = n => n < 0 ? 0 : n > 1 ? 1 : n;

  const progress = () => {
    const r = hero.getBoundingClientRect();
    const travel = r.height - window.innerHeight;
    return travel <= 0 ? 0 : clamp01(-r.top / travel);
  };

  /* Mobile browsers often refuse to decode until the element has played
     once. Play muted and pause immediately so the first seek has a frame. */
  function prime() {
    if (primed) return;
    primed = true;
    const p = video.play();
    if (p && typeof p.then === 'function') p.then(() => video.pause()).catch(() => {});
    else video.pause();
  }

  function update() {
    const p = progress();
    target = p * duration;
    if (barFill) barFill.style.width = (p * 100).toFixed(2) + '%';
    caps.forEach(c => c.classList.toggle('is-on', p >= +c.dataset.in && p < +c.dataset.out));
    card?.classList.toggle('is-on', p > 0.94);
    hint?.classList.toggle('is-off', p > 0.03);
  }

  function loop() {
    shown += (target - shown) * 0.18;
    if (Math.abs(target - shown) < 0.004) shown = target;

    if (video.readyState >= 2 && Math.abs(video.currentTime - shown) > 0.015) {
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
    requestAnimationFrame(loop);
  }

  function onMeta() {
    duration = video.duration;
    if (!isFinite(duration) || duration <= 0) {
      hero.classList.add('no-scrub');
      card?.classList.add('is-on');
      return;
    }
    prime();
    update();
    loop();
  }

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
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
   Enquiry form. Validates here; there is no server behind it yet,
   so it says so rather than implying the message went anywhere.
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
