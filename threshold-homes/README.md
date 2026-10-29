# Threshold Homes

A scroll-driven website for a real estate company that helps people buy, sell
and rent every kind of home. Scrolling down walks you across the water, through
a front door and out to the pool, while four short lines tell the company's
story: find, visit, choose, move in. Then the page settles into the company
site, built to turn visitors into calls.

Built with the 10K Websites method, minus two steps you asked to skip: no AI
video was generated (your clip is the hero) and no domain or hosting was set up.
All the words are plain and universal: no country, no local fees, no jargon.

**Threshold Homes is a sample company.** The services, promises and details are
examples, and the video was made with AI. The footer says so. Replace them with
your real company's details before going live.

## What is on the page

1. **The walk** (hero): Find a home you love · Step inside before you decide ·
   Feel the space for yourself · Then the keys are yours. It ends on the
   company name, "Free home valuation in 24 hours" and the main button,
   **Book a free call**.
2. **Promises**: 24 hours to a free valuation, 7 days a week, no fees for
   buyers, one person from start to finish.
3. **What we do**: Buy, Sell, Rent, Value.
4. **Home finder**, the interactive moment: buy or rent, type of home,
   bedrooms. "Find me this home" carries the choices into the call form.
5. **How it works**: three steps.
6. **Questions**: five plain answers about fees, timing and moving from abroad.
7. **Book a free call**: name, phone, buy / sell / rent, and what they want.

## Preview it

```bash
npx http-server threshold-homes -p 8130
```

Then open http://localhost:8130 in your browser. Use a server that supports
range requests (http-server does). Double-clicking `index.html` shows the
still-image version of the hero, because browsers will not let a local file
load the walk. That is the fallback working, not a fault.

## How the walk plays on each screen

| Screen | What plays | Why |
| --- | --- | --- |
| Laptops and desktops | `hero-wide.mp4`, a 60 fps video scrubbed by scroll | Desktop browsers seek video quickly and reliably |
| Phones and tablets | `seq/`, 301 still frames drawn on a canvas | In-app browsers, like the one inside the Claude app, often refuse to paint a paused video after a seek, which left the picture frozen while the words changed |

If one way fails, the other is tried, and if both fail the hero becomes a still
photo with the company name. Reduced motion, data saver and 2G connections go
straight to the still.

**The frames load in rounds.** Every 32nd frame comes first (11 frames, about
220 KB), then the gaps halve each round, six downloads at a time, so the walk moves within a second or two and gets
smoother as the rest arrive. In testing on a 1.5 Mbps phone connection the walk
was on screen after 2.9 seconds. Between two frames the next one fades in by
how far you have scrolled, so motion stays smooth at any speed: a quick swipe
redrew at a steady 16 ms per frame.

## What is in the folder

```
threshold-homes/
├── index.html
└── assets/
    ├── styles.css
    ├── main.js          scroll engine (video and frames), home finder, call form
    ├── hero-wide.mp4    laptops: 60 fps, 1600×1200, 6.6 MB
    ├── hero-tall.mp4    backup for phones: 60 fps, 864×1536, 5.5 MB
    ├── seq/             phones: 301 WebP frames at 720×1280 (6.6 MB) and index.json
    ├── poster-wide.jpg  first frame, framed for wide screens
    ├── poster.jpg       first frame, full height; also the still hero
    ├── ending.jpg       last frame; behind the call section
    └── still-*.jpg      four frames from the walk, used in "What we do"
```

Plain HTML, CSS and JavaScript. No build step and no dependencies. The only
outside request is Google Fonts.

## The design, in short

- **Colours from the footage.** Dark wood-in-shadow background, warm stone for
  text and cards, the sunset gold for buttons, pool blue for the finder summary.
- **Type.** Marcellus for headings (it looks carved, like stone), Jost for body
  text, DM Mono for small labels.
- **Signature element: stepping stones.** The marks on the right of the hero
  light up one by one as you walk, and the three steps are drawn as stones.
  A threshold is the step into a home, so the name and the motif agree.
- **Beat map** (video seconds, set as `data-in` / `data-out` on each `.cap`):

  | Seconds | On screen | Caption |
  | --- | --- | --- |
  | 0 to 1.85 | stone steps over the pool | Find a home you love. |
  | 2.05 to 3.6 | the front door | Step inside before you decide. |
  | 3.6 to 4.9 | passing the door | (pause, no caption) |
  | 4.9 to 6.95 | the tall living room | Feel the space for yourself. |
  | 7.55 to 9.2 | the glass opens onto the pool | Then the keys are yours. |
  | end | rests on the pool and the sea | Threshold Homes and Book a free call |

## Swapping in a new clip

Keep the filenames and **retime the captions**. The crop line
(`crop=1080:810:0:500`) assumes a 1080×1920 source; it keeps the band a laptop
screen shows.

```bash
# 1. make 60 fps by building in-between frames (takes a few minutes)
ffmpeg -i new.mp4 -an -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=yuv420p" \
  -c:v libx264 -preset veryfast -crf 10 mid60.mp4

# 2. laptops: cropped to the visible band, enlarged and lightly sharpened
ffmpeg -i mid60.mp4 -an -vf "crop=1080:810:0:500,scale=1600:1200:flags=lanczos,unsharp=5:5:0.5:5:5:0" \
  -c:v libx264 -preset slow -tune fastdecode -crf 26 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 \
  -profile:v high -level:v 4.2 -pix_fmt yuv420p -movflags +faststart assets/hero-wide.mp4

# 3. phone backup video: the full tall frame
ffmpeg -i mid60.mp4 -an -vf "scale=864:-2:flags=lanczos,unsharp=3:3:0.35:3:3:0" \
  -c:v libx264 -preset slow -tune fastdecode -crf 27 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart assets/hero-tall.mp4

# 4. phone frames, from the original 30 fps clip
ffmpeg -i new.mp4 -vf "scale=720:-2:flags=lanczos,unsharp=3:3:0.3:3:3:0" \
  -c:v libwebp -quality 55 -compression_level 6 -preset photo -start_number 0 assets/seq/f%03d.webp
# then update seq/index.json: count, and the load rounds (every 32nd frame, then
# every 16th not yet listed, and so on down to the odd frames)

# 5. posters, matching each file's framing
ffmpeg -i mid60.mp4 -frames:v 1 -vf "crop=1080:810:0:500,scale=1600:1200:flags=lanczos" -q:v 3 assets/poster-wide.jpg
ffmpeg -i mid60.mp4 -frames:v 1 -vf "scale=1080:-2:flags=lanczos" -q:v 3 assets/poster.jpg
```

## About your source clip

There is a small **Gemini sparkle watermark** in the bottom-right corner. On
laptops the crop hides it. On phones it is visible in the corner of the hero.
The "What we do" photos are cropped above it.

## Before this goes live

- **The form does not send anything yet.** It checks the fields, then says
  plainly that nothing was sent. To make it real, point the `<form>` at a form
  service (Formspree, Basin) and replace the thank-you branch at the end of
  `assets/main.js`.
- Replace the sample promises and answers with your company's real ones, add
  your phone number, address and licence details, and remove the footer notice.
- Not published anywhere public. The GitHub Pages workflow in this repo still
  publishes `villa/` only.
