# The Water House

A scroll-driven website for a home by the sea, built on your uploaded
walkthrough. Scrolling down walks you across the water, through the front door
and out to the pool. Scrolling up walks you back. Then the page settles into a
short, simple listing with one goal: booking a visit.

Built with the 10K Websites method, minus two steps you asked to skip: no AI
video was generated (your clip is the hero) and no domain or hosting was set up.
All the words are plain and universal: no country, no local fees, no
real-estate jargon.

**The Water House is not a real home for sale.** The house, price and details
were made up to show the design, and the video was made with AI. The footer
says so.

## Preview it

```bash
npx http-server water-house -p 8130
```

Then open http://localhost:8130 in your browser. Use a server that supports
range requests (http-server does). Double-clicking `index.html` shows the
still-image version of the hero, because browsers will not let a local file
load the video. That is the fallback working, not a broken video.

## What is in the folder

```
water-house/
├── index.html
└── assets/
    ├── styles.css
    ├── main.js          scroll engine, floor picker, visit form
    ├── hero-wide.mp4    laptops and desktops: 60 fps, 1600×1200, 6.6 MB
    ├── hero-tall.mp4    phones and tall screens: 60 fps, 864×1536, 5.5 MB
    ├── poster-wide.jpg  first frame, framed for wide screens
    ├── poster.jpg       first frame, full height; also the still hero
    ├── ending.jpg       last frame; behind the booking section
    └── still-*.jpg      four frames from the walk, used in the gallery
```

Plain HTML, CSS and JavaScript. No build step and no dependencies. The only
outside request is Google Fonts.

## The design, in short

- **Colours from the footage.** Dark wood-in-shadow background, warm stone for
  text and cards, the sunset gold for buttons and key numbers, pool blue used
  once in the floor picker.
- **Type.** Marcellus for headings (it looks carved, like the stone), Jost for
  body text, DM Mono for small labels.
- **Signature element: stepping stones.** The marks on the right of the hero are
  five stones that light up one by one as you walk. The visit steps are drawn as
  stones too.
- **Beat map** (video seconds, set as `data-in` / `data-out` on each `.cap`):

  | Seconds | On screen | Caption |
  | --- | --- | --- |
  | 0 to 1.85 | stone steps over the pool | Walk across the water. |
  | 2.05 to 3.6 | the front door | A tall wooden door. |
  | 3.6 to 4.9 | passing the door | (pause, no caption) |
  | 4.9 to 6.95 | the tall living room | A room full of light. |
  | 7.55 to 9.2 | the glass opens onto the pool | The pool meets the sea. |
  | end | rests on the pool and the sea | The Water House, the price, two buttons |

## The video

Your clip was 1080×1920 HEVC at 30 fps, with a keyframe only every 2 seconds.
For the scroll it is rebuilt three ways:

- **60 fps.** New in-between frames are made with motion interpolation, so each
  bit of scroll moves the picture half as far. Slow scrolling no longer steps
  from frame to frame.
- **Sharper on big screens.** A laptop only ever shows the middle band of the
  tall clip. The desktop file is cropped to that band and enlarged to 1600×1200
  with a high-quality filter and a light sharpen, so the browser has far less
  stretching to do, and no bytes are spent on parts nobody sees.
- **Higher quality.** Encoded at a higher quality setting than before, with a
  keyframe every few frames so any scroll position is found quickly.

The picture follows your scroll through time-based easing, so it feels the same
on a 60 Hz laptop and a 120 Hz phone, and the loop stops completely when you stop
scrolling. Only one seek runs at a time, so a fast flick never piles up.

To swap in a new clip, keep the filenames, re-run these, and **retime the
captions**. The crop line (`crop=1080:810:0:500`) assumes a 1080×1920 source;
it keeps the band that a laptop screen shows.

```bash
# 1. make 60 fps by building in-between frames (takes a few minutes)
ffmpeg -i new.mp4 -an -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=yuv420p" \
  -c:v libx264 -preset veryfast -crf 10 mid60.mp4

# 2. laptops: cropped to the visible band, enlarged and lightly sharpened
ffmpeg -i mid60.mp4 -an -vf "crop=1080:810:0:500,scale=1600:1200:flags=lanczos,unsharp=5:5:0.5:5:5:0" \
  -c:v libx264 -preset slow -tune fastdecode -crf 26 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 \
  -profile:v high -level:v 4.2 -pix_fmt yuv420p -movflags +faststart assets/hero-wide.mp4

# 3. phones: the full tall frame
ffmpeg -i mid60.mp4 -an -vf "scale=864:-2:flags=lanczos,unsharp=3:3:0.35:3:3:0" \
  -c:v libx264 -preset slow -tune fastdecode -crf 27 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart assets/hero-tall.mp4

# 4. posters, matching each file's framing
ffmpeg -i mid60.mp4 -frames:v 1 -vf "crop=1080:810:0:500,scale=1600:1200:flags=lanczos" -q:v 3 assets/poster-wide.jpg
ffmpeg -i mid60.mp4 -frames:v 1 -vf "scale=1080:-2:flags=lanczos" -q:v 3 assets/poster.jpg
```

`-tune fastdecode` is the main smoothness setting: in testing it halved the time
each scroll jump takes to decode, with no visible loss.

## Phones

The method normally shows phones a still image instead of the scrolling video.
Your clip is vertical, so a phone is the screen it fits best, and phones get the
scroll too. They still drop to the still image on data saver, a 2G connection,
reduced motion, a failed download or a browser that cannot play the file.

## About your source clip

There is a small **Gemini sparkle watermark** in the bottom-right corner. On
laptops the crop hides it. On phones it is visible in the corner of the hero.
The gallery stills are cropped above it.

## Before this goes live

- **The form does not send anything yet.** It checks the fields, then says
  plainly that nothing was sent. To make it real, point the `<form>` at a form
  service (Formspree, Basin) and replace the thank-you branch at the end of
  `assets/main.js`.
- Replace the made-up price, sizes and answers with real ones, and remove the
  footer notice.
- Not published anywhere public. The GitHub Pages workflow in this repo still
  publishes `villa/` only.
