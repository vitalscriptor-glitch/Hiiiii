/* ============================================================
   Casa Horizonte
   Scroll drives the hero video's currentTime. Nothing autoplays.
   ============================================================ */

(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Reveal-on-enter for content blocks
     --------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------
     Hero scrub
     --------------------------------------------------------- */
  const hero  = document.getElementById('hero');
  const video = document.getElementById('heroVideo');
  const bar   = document.getElementById('heroBar');
  const title = document.querySelector('.hero__title');
  const hint  = document.querySelector('.hero__hint');
  const caps  = [...document.querySelectorAll('.cap')];

  if (!hero || !video) return;

  // Without the scrub we still want the copy legible, so the title shows.
  if (reduced) {
    title?.classList.add('is-on');
    return;
  }

  let duration = 0;
  let target   = 0;   // where scroll says the playhead should be
  let shown    = 0;   // where we have actually seeked to (eased)
  let ticking  = false;
  let seekFails = 0;
  let primed   = false;

  const clamp01 = n => n < 0 ? 0 : n > 1 ? 1 : n;

  function progress() {
    const r = hero.getBoundingClientRect();
    const travel = r.height - window.innerHeight;
    if (travel <= 0) return 0;
    return clamp01(-r.top / travel);
  }

  /* Mobile browsers often will not decode a frame until the element has
     played at least once. Playing muted and pausing immediately primes the
     decoder without the visitor ever seeing it move. */
  function prime() {
    if (primed) return;
    primed = true;
    const p = video.play();
    if (p && typeof p.then === 'function') {
      p.then(() => video.pause()).catch(() => { /* fine; seeking may still work */ });
    } else {
      video.pause();
    }
  }

  function onMeta() {
    duration = video.duration;
    if (!isFinite(duration) || duration <= 0) {
      hero.classList.add('no-scrub');
      title?.classList.add('is-on');
      return;
    }
    prime();
    update();
    loop();
  }

  function update() {
    const p = progress();
    target = p * duration;

    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';

    caps.forEach(cap => {
      const a = parseFloat(cap.dataset.in);
      const b = parseFloat(cap.dataset.out);
      cap.classList.toggle('is-on', p >= a && p < b);
    });

    title?.classList.toggle('is-on', p > 0.80);
    hint?.classList.toggle('is-off', p > 0.04);
  }

  function loop() {
    // Ease toward the target so a fast flick does not become a seek storm.
    shown += (target - shown) * 0.18;

    if (Math.abs(target - shown) < 0.004) shown = target;

    if (video.readyState >= 2 && Math.abs(video.currentTime - shown) > 0.015) {
      const before = video.currentTime;
      try {
        video.currentTime = shown;
      } catch (_) {
        seekFails++;
      }
      // If seeking never takes effect, stop pretending and fall back.
      if (before === video.currentTime && Math.abs(before - shown) > 0.25) {
        if (++seekFails > 45) {
          hero.classList.add('no-scrub');
          title?.classList.add('is-on');
          return;              // leave the loop; poster carries the hero
        }
      } else {
        seekFails = 0;
      }
    }

    requestAnimationFrame(loop);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  ['pointerdown', 'touchstart', 'keydown'].forEach(ev =>
    addEventListener(ev, prime, { once: true, passive: true }));

  if (video.readyState >= 1) onMeta();
  else video.addEventListener('loadedmetadata', onMeta, { once: true });

  video.addEventListener('error', () => {
    hero.classList.add('no-scrub');
    title?.classList.add('is-on');
  }, { once: true });
})();


/* ============================================================
   Enquiry form
   Validates in the browser. There is no server behind it yet, so it
   says so rather than implying a message was sent.
   ============================================================ */

(() => {
  'use strict';
  const form   = document.getElementById('viewingForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = form.elements.name;
    const email = form.elements.email;
    let bad = null;

    [name, email].forEach(f => f.removeAttribute('aria-invalid'));

    if (!name.value.trim()) {
      name.setAttribute('aria-invalid', 'true');
      bad = bad || name;
    }
    if (!emailOk(email.value.trim())) {
      email.setAttribute('aria-invalid', 'true');
      bad = bad || email;
    }

    if (bad) {
      status.textContent = 'Please check the highlighted fields.';
      bad.focus();
      return;
    }

    status.textContent =
      'Validated, but not sent — this demonstration page has no mail service connected yet.';
  });
})();
