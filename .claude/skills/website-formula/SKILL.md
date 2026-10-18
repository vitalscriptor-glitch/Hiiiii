---
name: website-formula
description: The user's own "Website Formula", a fixed 5-step recipe that turns one video they supply into a 3D scroll-driven website plus a themed ending page. Use whenever the user says "website formula", "my formula", "use the formula", "run the formula", or /website-formula, with or without a project name. Steps - ask for the video, split it into parts, generate captions (not burned in), build a 3D site where scrolling plays the video and stopping pauses it and shows the caption, then an ending page with reviews, ratings, contact details and more in the video's theme.
---

# Website Formula

The user's personal recipe. When they say the name, run these five steps in
this order, every time. Do not swap in another website workflow (including
`10k-websites`) unless they ask for it.

```
1. Ask for the video
2. Split the video into parts
3. Generate captions (generate only, never burn them into the video)
4. Build a 3D website: scroll down -> video plays, stop scrolling -> video pauses and the caption appears
5. Build an ending page in the video's theme: reviews, ratings, contact details and more
```

## Step 1 - Ask for the video

Your first message asks for the video and nothing is built before it arrives.
Accept any of:

- a file uploaded to this repository (github.com -> Add file -> Upload files; see README),
- a direct download URL,
- a path already in the working directory.

In the same message, ask for the optional details the ending page needs. If the
user skips them, use placeholders and say so:

- name of the business / project,
- real contact details (phone, email, address, socials, hours),
- real reviews and ratings, if they have any.

Once the video is in hand, copy it to `sites/<slug>/source/` (slug = short
kebab-case project name) and run `ffprobe` to record duration, resolution, fps
and whether it has an audio track with speech.

## Step 2 - Split the video into parts

Find natural part boundaries, then cut.

1. Detect scene changes:
   ```bash
   ffmpeg -i in.mp4 -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep pts_time
   ```
2. Merge boundaries closer than ~2 s apart. Aim for 4 to 8 parts. If there are
   no usable cuts (one continuous shot), split into equal parts of 3 to 6 s.
3. Cut each part, re-encoded so cuts are frame accurate:
   ```bash
   ffmpeg -ss <start> -to <end> -i in.mp4 -c:v libx264 -crf 20 -pix_fmt yuv420p -an sites/<slug>/parts/part-01.mp4
   ```
4. Grab a thumbnail per part (middle frame) into `sites/<slug>/parts/part-01.jpg`.
5. Write `sites/<slug>/parts/parts.json`:
   ```json
   [{ "id": 1, "file": "part-01.mp4", "thumb": "part-01.jpg", "start": 0.0, "end": 4.2 }]
   ```

The website itself plays ONE scrub-encoded copy of the full video and uses the
part timestamps as chapters (separate files stutter at the joins). Encode it
for scrubbing, as in `site/README.md`:

```bash
ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 25 -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart -an sites/<slug>/media/video.mp4
ffmpeg -i in.mp4 -c:v libvpx-vp9 -crf 36 -b:v 0 -g 5 -keyint_min 5 -deadline good \
  -cpu-used 4 -row-mt 1 -pix_fmt yuv420p -an sites/<slug>/media/video.webm
ffmpeg -i sites/<slug>/media/video.mp4 -frames:v 1 -q:v 4 sites/<slug>/media/poster.jpg
```

Scale down to 1920 px wide (1080 px for vertical video) if larger. Keep each
encode under about 8 MB; raise CRF if not.

## Step 3 - Generate captions (do NOT add them to the video)

Captions are data files, never burned into the frames.

- **Video has speech:** transcribe it (`pip install faster-whisper` or
  `openai-whisper`), then group the transcript by part.
- **No speech / music only:** extract 2 to 3 frames per part, look at them
  (Read the jpgs), and write one short caption per part describing the
  moment in a voice that fits the video's mood.

Every part gets exactly one caption: a title (2 to 5 words) and a line (max ~14
words). Write:

- `sites/<slug>/captions/captions.json`
  `[{ "part": 1, "start": 0.0, "end": 4.2, "title": "...", "text": "..." }]`
- `sites/<slug>/captions/captions.vtt` (same content as WebVTT, for reuse elsewhere)

Show the user the caption list before building, so they can edit wording.

## Step 4 - The 3D scroll website

Plain HTML/CSS/JS in `sites/<slug>/`, no build step. Three.js as an ES module
from a pinned CDN version (e.g. `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`).

**The 3D scene**
- The video is a `THREE.VideoTexture` on a slightly curved screen (or floating
  panel) in a 3D space: depth fog, a particle field, soft lights tinted with the
  video's palette (from step 5's palette extraction).
- Scroll moves the camera along a path through the scene (dolly in, gentle
  orbit); mouse / device tilt adds a small parallax.
- Part thumbnails can float as 3D cards that light up when their part is active.

**Scroll -> play, stop -> pause + caption**
- A tall scroll track (about 100 to 120 vh per part) with a sticky full-screen
  canvas. Scroll progress (0 to 1) maps to `video.currentTime`, eased toward the
  target in a `requestAnimationFrame` loop. So scrolling down plays the video,
  scrolling up rewinds it, and when the scroll stops the video stops.
- Idle detection: on every `scroll` event hide the caption and restart a
  ~180 ms timer. When it fires (scrolling has stopped) and the eased playhead
  has settled, find the part whose `[start, end)` contains `currentTime` and
  fade in its caption (title + text) from `captions.json`.
- Small chapter dots / progress bar showing which part you are in.

**Reuse the hard-won bits from `site/js/main.js`:** decoder priming (play muted
then pause once), the seek-failure fallback to the poster, and
`prefers-reduced-motion` (no scrub; show parts as a stacked list with captions).
If WebGL is unavailable, fall back to the same sticky `<video>` scrub without
the 3D scene. Must work on phones (touch scroll, `playsinline`, `muted`).

## Step 5 - The ending page (themed to the video)

After the last part, the scroll track releases into a normal page.

**Match the theme:** extract the video's palette from its frames
(`ffmpeg ... -vf palettegen` on a few frames, or a small Python k-means), pick
fonts that fit its mood, and reuse the part thumbnails as imagery. The ending
page should feel like the video kept going.

**Sections (include all, order to taste):**
- Hero / closing line with a call-to-action button
- Ratings summary: average stars, count, per-star breakdown bars
- Reviews: cards or a carousel
- Gallery built from the part thumbnails
- Services / features or highlights
- Stats / counters
- FAQ (accordion)
- Contact details: phone, email, address, hours, map embed, socials
- Contact form and newsletter signup
- Footer

**Honesty rule:** reviews, ratings and contact details come from the user. If
they gave none, write clearly marked samples ("Sample review - replace before
launch") and placeholder contacts, and say so in the chat and in the page footer.
Never present invented reviews as real.

## Finish

1. Serve locally (`npx http-server sites/<slug> -p 8099`), check it in Chromium
   via Playwright at desktop and phone widths: scrub works both ways, the
   caption appears only after scrolling stops, ending page renders. Fix what
   you find.
2. Write `sites/<slug>/README.md`: how to run, how to swap the video, how to
   edit captions and contact details.
3. Commit and push to the session's branch.
4. Tell the user what was built, what is placeholder, and offer publishing
   (GitHub Pages from `/sites/<slug>`, or a hosted preview).

## Output layout

```
sites/<slug>/
├── index.html
├── css/styles.css
├── js/main.js              3D scene, scroll scrub, idle captions
├── media/video.mp4|webm, poster.jpg
├── parts/part-NN.mp4|jpg, parts.json
├── captions/captions.json, captions.vtt
├── source/                 the original upload
└── README.md
```
