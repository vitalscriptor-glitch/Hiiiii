# Casa Horizonte

A scroll-driven property page. One hero video scrubs forward as you scroll down
and backward as you scroll up; below it the page settles into an ordinary
website with specification, location and an enquiry form.

**Casa Horizonte is fictional.** The property, address, price, specification and
photography were invented for this build. The page says so in its footer. If you
reuse this for a real listing, replace that disclaimer with real particulars.

---

## Running it

```bash
npx http-server site -p 8099    # then open http://localhost:8099
```

Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies, no
framework. The only external request is the Google Fonts stylesheet.

```
site/
├── index.html
├── css/styles.css
├── js/main.js          ← the scroll-scrub logic
└── media/
    ├── hero.webm       ← VP9, short GOP      (Chrome, Firefox, Android)
    ├── hero.mp4        ← H.264, all-keyframe (Safari, iOS)
    ├── hero-poster.jpg ← fallback still
    └── plate-01..03.jpg
```

## Replacing the placeholder media

Every file in `media/` is procedurally generated stand-in art. Swap each one for
real footage and the page needs no code changes, provided the filenames match.

### The hero video

Export **16:9, 1920×1080 or larger, 5–8 seconds, no audio**, then re-encode. The
encode matters as much as the footage: scrubbing means seeking to an arbitrary
frame on every scroll event, and a normal web encode only has a keyframe every
few seconds, so seeks land on the nearest keyframe and the video appears to
stick. Both commands below fix that.

```bash
# MP4 — every frame a keyframe. Largest file, perfect seeking.
ffmpeg -i yours.mp4 -c:v libx264 -preset slow -crf 25 \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart -an site/media/hero.mp4

# WebM — keyframe every 5 frames. Much smaller, still scrubs smoothly.
ffmpeg -i yours.mp4 -c:v libvpx-vp9 -crf 36 -b:v 0 \
  -g 5 -keyint_min 5 -deadline good -cpu-used 4 -row-mt 1 \
  -pix_fmt yuv420p -an site/media/hero.webm

# Poster, taken from wherever the title lands
ffmpeg -i site/media/hero.mp4 -ss 5.0 -frames:v 1 -vf scale=1600:-2 -q:v 4 \
  site/media/hero-poster.jpg
```

Aim to keep each under about 5 MB. Visitors on phone data pay for every byte of
a hero video, and this one loads before anything else is readable.

### Prompt for the hero video

Written for a scroll-scrubbed hero, which wants different things from a normal
AI video prompt. **One continuous move, no cuts, no people, nothing fast.** A cut
looks like a glitch when scrubbed. A person walking looks absurd scrubbed
backward. Sudden exposure changes strobe as the visitor scrolls.

> Aerial architectural film. Continuous camera move, constant speed. The camera
> rises slowly from just above the Atlantic surface toward a modernist concrete and
> glass house cantilevered over a black basalt sea cliff on the Portuguese coast.
> The house sits in the right third of frame and stays there. Late afternoon, low
> golden sun behind thin coastal haze, long slow ocean swell below, empty sky.
> Cinematic, anamorphic, muted teal and warm gold, natural colour, deep focus,
> unoccupied, 16:9. Avoid: people, on-screen text, lens flare.

Keep the lower third relatively plain. The property name, price and the scroll
cue sit there, and busy footage underneath makes all three hard to read.

**On phrasing.** This prompt is written positively on purpose. Google Flow has no
negative prompt field, so words after an "Avoid:" header still reach the text
encoder as ordinary requested words — diffusion text encoders do not process
negation, and "no people, no birds" can summon people and birds. Control it by
naming what you do want ("empty sky", "unoccupied") and keep the avoid tail to
the two or three high-frequency failure modes that do respond slightly to being
named. Enforced negatives exist only on the Gemini API / Vertex AI Veo endpoint,
which has a real `negativePrompt` parameter.

### Prompts for the three photographs

Shot as one set, so they read as the same house on the same afternoon.

**`plate-01.jpg` — 16:9, the living floor**

> Interior architectural photograph at dusk, shot from inside a minimalist
> concrete and glass living room cantilevered over a sea cliff. Twenty metres of
> floor-to-ceiling glazing with slim dark mullions fills the frame; beyond it the
> Atlantic and a low orange horizon. Warm interior light from the left, cool blue
> light outside. Board-marked concrete ceiling, oak floor, almost no furniture.
> Wide angle, tripod level, no people. Architectural Digest, natural colour.

**`plate-02.jpg` — 4:3, the stair**

> Architectural detail photograph of a board-marked concrete stair descending
> inside a modernist house. Raw cast concrete showing the grain of the timber
> formwork, floating treads, a single hard diagonal shaft of afternoon sun across
> the wall. Muted warm grey, deep shadow, no people, no clutter. Medium format,
> natural light only.

**`plate-03.jpg` — 4:3, the terrace**

> Architectural photograph of a stone terrace and an eighteen metre infinity pool
> on a clifftop, the pool edge aligned exactly with the Atlantic horizon so the
> water appears continuous. Late afternoon, low sun to the right throwing a glint
> path across the sea. Pale limestone paving, still water, no people, no
> furniture, no umbrellas. Wide angle, level horizon, natural colour.

Keep aspect ratios as listed. `plate-01` runs full width at 16:9; the other two
sit side by side at 4:3. Different ratios will crop.

---

## Publishing it free on GitHub Pages

No host account needed; the repository can serve it.

GitHub Pages will not serve an arbitrary folder like `/site` when deploying
straight from a branch — only the repository root or `/docs`. So
`.github/workflows/pages.yml` assembles the sites and deploys that instead.

One-time setup:

1. Repository **Settings** → **Pages**
2. **Source**: **GitHub Actions** (not "Deploy from a branch")

This site then lives at `https://<user>.github.io/<repo>/casa/`, and The Emirat
is at the root.

---

## How the scrub works

`index.html` gives the hero a tall scroll track (`--hero-scroll`, 420vh) with a
`position: sticky` stage inside it. `js/main.js` converts scroll depth through
that track into a 0–1 value, multiplies by the video's duration, and eases the
playhead toward it inside a `requestAnimationFrame` loop. Easing matters: writing
`currentTime` straight from the scroll handler on a fast flick queues more seeks
than the decoder can service, and the video stutters.

Three things it also handles:

- **Decoder priming.** Many mobile browsers will not decode a frame until the
  element has played once, so it plays muted and pauses immediately.
- **Seek failure.** If seeks silently do nothing for 45 consecutive frames, it
  adds `.no-scrub`, hides the video and lets the poster carry the section.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, the scrub is never
  started and the hero collapses to a single screen.

Adjust `--hero-scroll` in `styles.css` to change how far you scroll to play the
clip. Lower feels faster. Below about 250vh the captions get no room to breathe.

## Known gaps

- The enquiry form validates and then says it was not sent, because no mail
  service is connected. Point it at a form endpoint or a serverless function.
- Copy, price and specification are invented placeholders.
