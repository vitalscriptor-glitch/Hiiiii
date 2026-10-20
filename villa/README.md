# Villa 24 — Arabian Ranches

A conversion-led property page built around your AI-generated tour. The video is
scrubbed by scroll position rather than played: scrolling down walks you through
the villa, scrolling up walks you back out. Bold captions call out a selling
point at each room, and the page lands on the price and a viewing request.

**Villa 24 is not a real listing.** The address, price, figures, specification and
availability were invented to demonstrate the design, and the tour is
AI-generated. The footer says so. Replace all of it before showing this to a real
buyer, and delete the footer notice once the content is genuine.

---

## Running it

```bash
npx http-server villa -p 8100     # then open http://localhost:8100
```

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no
dependencies. The only external request is the Google Fonts stylesheet.

```
villa/
├── index.html
├── css/styles.css
├── js/main.js            ← scroll-scrub, sticky bar, form
└── media/
    ├── tour.webm         VP9,   5-frame GOP   (Chrome, Firefox, Android)
    ├── tour.mp4          H.264, 4-frame GOP   (Safari, iOS)
    ├── poster.jpg        fallback still, also the blurred desktop backdrop
    └── exterior / entrance / hall / kitchen / stair / bedroom / pool .jpg
```

## About your source video

Your upload was 720×1280 HEVC, 21 seconds, with **six keyframes in the whole
clip**. Two things had to change before it could drive a scroll:

- **HEVC does not play in many browsers.** It is re-encoded to H.264 and VP9.
- **Six keyframes means seeking lands up to three seconds away from where you
  scrolled.** Both encodes now carry a keyframe every four or five frames, so a
  seek decodes at most a few frames and the video tracks your finger.

To swap in a new tour, keep the filenames and re-run:

```bash
ffmpeg -i yours.mp4 -c:v libx264 -preset slow -crf 25 \
  -g 4 -keyint_min 4 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart -an villa/media/tour.mp4

ffmpeg -i yours.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 \
  -g 5 -keyint_min 5 -deadline good -cpu-used 4 -row-mt 1 \
  -pix_fmt yuv420p -an villa/media/tour.webm

ffmpeg -i yours.mp4 -ss 2 -frames:v 1 -q:v 3 villa/media/poster.jpg
```

Aim to stay near 5 MB per file. The hero loads before anything else is readable,
and buyers browsing on phone data pay for every byte.

### The watermark

Your clip carries a **"Veo" watermark in the bottom-right corner**. It is still
there. On a wide screen the hero letterboxes the vertical frame so the corner is
usually out of view, and the gallery stills are cropped to 4:5 above it, but on a
phone the hero shows the full frame including the mark.

Removing it is your call, not mine: it may conflict with the terms you generated
under, and Veo output also carries an invisible SynthID watermark that survives
any crop regardless. If you decide to, the cleanest route is to crop rather than
paint over it, which costs you a strip of the frame:

```bash
ffmpeg -i tour.mp4 -vf "crop=720:1200:0:0" ...   # drops the bottom 80px
```

### The video is vertical, and the layout handles it

9:16 fills a phone screen perfectly. On a landscape screen the hero puts a
blurred, darkened copy of the poster behind the sharp frame rather than
stretching or hard-cropping it, so the shape reads as deliberate. That switch is
one media query on `min-aspect-ratio: 1/1`.

## Making the enquiry form actually send

Right now it validates and then says plainly that nothing was sent, because no
mail service is connected. That is deliberate — a form that silently does nothing
loses leads without telling you.

To wire it up, give the `<form>` an `action` pointing at a form endpoint
(Formspree, Basin, a Google Apps Script, or your own handler) and remove the
`e.preventDefault()` branch at the end of `js/main.js`. Then test it by actually
submitting and checking the inbox.

Two more things worth adding before this goes near real buyers:

- **A phone and WhatsApp link.** Both CTAs currently point at the form. In Dubai,
  WhatsApp converts better than a form. Add `<a href="https://wa.me/9715XXXXXXXX">`
  with your real number. I left the number out on purpose rather than invent one
  that might belong to a real person.
- **Your brokerage details and RERA permit number.** Dubai listings legally need a
  permit number displayed. There is none here because the listing is fictional.

## Publishing it free on GitHub Pages

1. Repository **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`, **Folder**: `/villa`, then **Save**

Note that `/site` (Casa Horizonte) and `/villa` cannot both be the Pages root at
once. Pick one, or move the other under it.

## How the scrub works

The hero has a tall scroll track (`--hero-scroll`, 560vh) with a `position:
sticky` stage inside. `js/main.js` turns scroll depth through that track into a
0–1 value, multiplies by the video's duration, and eases the playhead toward it
inside a `requestAnimationFrame` loop. The easing matters: writing `currentTime`
straight from the scroll handler on a fast flick queues more seeks than the
decoder can service, and the video stutters instead of tracking.

It also handles three things that break scrubbing in the wild:

- **Decoder priming.** Many mobile browsers will not decode a frame until the
  element has played once, so it plays muted and pauses immediately.
- **Seek failure.** If seeks silently do nothing for 45 consecutive frames it adds
  `.no-scrub`, hides the video, and lets the poster carry the hero.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` the scrub never
  starts and the hero collapses to a single screen.

### Tuning it

- `--hero-scroll` in `styles.css` sets how far you scroll to play the tour.
  Lower feels faster. Below about 300vh the captions get no room.
- Caption timing lives in `index.html` as `data-in` and `data-out` on each
  `.cap`, as fractions of the scroll. They are currently set against this video's
  content: kitchen at 0.45–0.57, bedrooms at 0.72–0.85, pool at 0.86–0.93. **If
  you swap the video, retime these**, or captions will name rooms you are not
  looking at.

## Verified

Driven in Chromium at 390×844 and 1440×900: the playhead tracks scroll linearly,
each caption fires over the room it names, the video covers the phone viewport
and letterboxes cleanly on desktop, the sticky bar appears past the hero, there
is no horizontal overflow, and the console is clean.
