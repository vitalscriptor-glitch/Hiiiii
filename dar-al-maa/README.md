# Dar Al Maa · Palm Jumeirah

A scroll-driven property page built on your uploaded walkthrough. Scrolling down
walks you in across the water, through the walnut door and out to the pool.
Scrolling up walks you back. Then the page settles into a real listing with one
goal: booking a private viewing.

Built with the 10K Websites method, minus two steps you asked to skip: no AI
video was generated (your clip is the hero) and no domain or hosting was set up.

**Dar Al Maa is not a real listing.** The name, price, figures, fees and
availability were invented to show the design, and the walkthrough is AI
generated. The footer says so. Replace all of it before showing this to a
real buyer.

## Preview it

```bash
npx http-server dar-al-maa -p 8130     # or: cd dar-al-maa && python3 -m http.server 8130
```

Then open http://localhost:8130 in your browser.

Double-clicking `index.html` also works, but browsers will not let a local file
fetch the video, so you see the still-image version of the hero instead. That
is the fallback working as designed, not a broken video.

## What is in the folder

```
dar-al-maa/
├── index.html
└── assets/
    ├── styles.css
    ├── main.js          scroll engine, cost ledger, viewing form
    ├── hero-1080.mp4    3.7 MB, laptops and desktops
    ├── hero-720.mp4     2.5 MB, phones
    ├── poster.jpg       first frame; also the still hero
    ├── ending.jpg       last frame; behind the booking section
    └── still-*.jpg      four frames from the walk, used in the gallery
```

Plain HTML, CSS and JavaScript. No build step and no dependencies. The only
outside request is Google Fonts.

## The design, in short

- **Palette from the footage.** Walnut-in-shadow canvas `#12100e`, travertine
  text `#efe6d8` / `#d8c6ac`, golden-hour accent `#e9b98b` kept for buttons and
  key numbers, pool `#8cc7c6` used once in the ledger.
- **Type.** Marcellus for display (carved, like the stone), Jost for body,
  DM Mono for small labels, Amiri for the Arabic mark دار الماء.
- **Signature element: stepping stones.** The progress marks on the right of the
  hero are five stones, nearest widest, lighting up one per beat. The viewing
  steps below are drawn as stones too.
- **Beat map** (video seconds, set as `data-in` / `data-out` on each `.cap`):

  | Seconds | On screen | Caption |
  | --- | --- | --- |
  | 0 to 1.85 | stones over the reflecting pool | You arrive across the water. |
  | 2.05 to 3.6 | the pivot door | Walnut, four metres tall. |
  | 3.6 to 4.9 | passing the door | (pause, no caption) |
  | 4.9 to 6.95 | double-height living room | Then the ceiling lifts to eight metres. |
  | 7.55 to 9.2 | the glass opens onto the pool | The sea is the last room. |
  | end | rests on the pool and the sea | Dar Al Maa, the price, two buttons |

- **Copy angle.** Dubai buyers' most common complaints are fake listings, deposits
  asked for before viewings, and fees that only appear later. The page answers
  each one: every cost listed up front, no deposit to view, title deed checked
  before listing.

## One deliberate change from the method

The method normally shows phones a still image instead of the scrolling video.
Your clip is vertical, so a phone is the screen it fits best. Phones get the
scroll too, using a lighter 2.5 MB file. They still drop to the still image on
data saver, a 2G connection, reduced motion, a failed download or a browser
that cannot play the file.

## How the hero works

- The whole video downloads as one file in memory, with a real percentage on
  the loading ring, so scrubbing never waits on the network.
- The picture eases toward the scroll position in an animation loop that stops
  completely when you stop scrolling.
- Only one seek runs at a time. A newer one waits its turn, so a fast flick never
  piles up requests. Tested: 56 seeks during a hard flick, zero overlapping, and
  the picture lands on the last frame about 0.6 seconds after the flick stops.
- Each caption has a soft local shade behind it. Measured against the brightest
  frames of each band, text contrast stays between 5.7:1 and 12:1.

### Tuning

- `--scrub` in `styles.css` sets how far you scroll to walk the whole film
  (520vh on laptops, 440vh on phones).
- `EASE` in `main.js` sets smoothness. Lower is smoother but trails your scroll.
- If you swap the video, keep the filenames, re-encode with short keyframe gaps,
  and **retime the captions**:

```bash
ffmpeg -i new.mp4 -vf scale=1080:-2 -c:v libx264 -preset slow -crf 28 -g 5 -keyint_min 5 \
  -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an assets/hero-1080.mp4
ffmpeg -i new.mp4 -vf scale=720:-2 -c:v libx264 -preset slow -crf 28 -g 3 -keyint_min 3 \
  -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an assets/hero-720.mp4
ffmpeg -i new.mp4 -frames:v 1 -vf scale=1080:-2 -q:v 4 assets/poster.jpg
ffmpeg -sseof -0.05 -i new.mp4 -frames:v 1 -vf scale=1080:-2 -q:v 4 assets/ending.jpg
```

## About your source clip

1080×1920 HEVC, 10 seconds, with a keyframe only every 2 seconds and a stereo
audio track. HEVC does not play in many browsers, and keyframes that far apart
make scrubbing jump, so both encodes are H.264 with a keyframe every 3 to 5
frames and no audio.

There is a small **Gemini sparkle watermark** in the bottom-right corner. On
laptops the hero crops it out of view. On phones it is visible in the corner of
the hero. The gallery stills are cropped above it. Removing it is your call:
cropping the bottom 120px is the clean way, and the invisible SynthID mark stays
either way.

## Before this goes in front of real buyers

- **The form does not send anything yet.** It checks the fields, then says
  plainly that nothing was sent. To make it real, point the `<form>` at a form
  service (Formspree, Basin) and replace the thank-you branch at the end of
  `assets/main.js`.
- **Add a WhatsApp link** with your real number. In Dubai it usually beats a form.
- **Add your brokerage name, RERA permit and Trakheesi number.** Dubai listings
  must show them.
- **Check every fee** in the cost ledger against the current Dubai Land
  Department schedule and the bank you use.
- Not published anywhere. The GitHub Pages workflow in this repo still publishes
  `villa/` only.
