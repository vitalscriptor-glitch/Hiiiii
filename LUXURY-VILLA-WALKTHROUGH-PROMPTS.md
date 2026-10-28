# Luxury Villa Walkthrough — Prompt Pack (Palm Jumeirah)

A ten-shot film of a contemporary beachfront villa on Palm Jumeirah, Dubai: arrival at golden hour, through the house to the infinity pool, then a twilight finale. About 54 seconds once trimmed.

Same workflow as `DUBAI-WALKTHROUGH-PROMPTS.md`, which means you make a still and then animate it. It's written for Google Flow (Veo 3.1) and works the same way in any image-to-video tool (Higgsfield, Kling, Runway). Sections 5–9 of that pack explain *why* the rules below work, so this pack doesn't repeat them.

---

## 1. How to use it

1. **Stills first, then video.** Paste the IMAGE prompt into the image model. When the still is right, drop it in as the start frame (Flow: Video → Frames → "+ Add start frame") and paste the VIDEO prompt. **Never paste an image prompt into the video box.** The start frame already carries the room into the video, so the words only have to say how the camera moves.
2. **Generate Shot 3 first.** It's the master still for every interior, and Shot 1 is the master for every exterior. See section 6.
3. **Use 8-second clips and one aspect ratio for everything.** Pick 16:9 for YouTube and the website, or 9:16 for Reels and TikTok (your Emirat tour was 9:16). Never mix the two in one film.
4. **One room per clip, one camera move per clip.** Room changes happen at the cut.
5. **Shots 1–9 are all golden hour.** Shot 10 is the only time jump. It's joined with a dissolve so it reads as deliberate (section 7).
6. **Paste the prompts as written.** Every video prompt runs in the same order: camera, room, light, lens, then `Avoid:`. Keep that order.

---

## 2. The villa — continuity block

Every fact here is already woven into the prompts. If you write an extra prompt yourself, paste this into it word for word.

> Contemporary signature villa on a beachfront frond of Palm Jumeirah, Dubai. Two storeys of crisp white render and honed cream travertine, deep cantilevered flat roof slabs, slim bronze-framed floor-to-ceiling glass, vertical bronze fins. Entrance court with a shallow reflecting pool, travertine stepping stones and a tall solid oak pivot door with a long bronze pull. Inside: large honed cream travertine floor slabs, warm white plaster walls, pale rift-cut oak joinery, brushed bronze details, cream bouclé and linen, clusters of blown-glass globe pendants. A double-height entrance hall with a floating travertine staircase. Living room, kitchen and dining open through glass walls that slide fully away onto a travertine pool terrace with a long infinity-edge pool lined in pale green stone, a private white sand beach and a calm turquoise lagoon running west to a low hazy horizon; inland, behind the villa, a distant hazy line of city towers. Master suite upstairs with a balcony over the pool. Golden hour, low warm sun. Styled, immaculate, unoccupied.

**Why these materials.** Honed (matt) stone, plaster, oak and brushed bronze look expensive today, and AI video also holds them steady. Polished marble veining crawls, mirror-polished floors double the room, crystal chandeliers boil, mirrors never reflect the right thing, and closed glass walls ghost. Each prompt below asks for the stable version instead: honed stone, globe pendants, mirrors kept behind the camera, and glass walls slid open.

---

## 3. Fixed rules — the same in every shot

- **Light.** Shots 1–9 are golden hour. The sea side of the house faces west. Looking toward the sea, the low sun is always out of frame to the left and rakes in from the left. In Shot 1 it's behind the camera. In Shot 2 it's hidden behind the house, so the entrance facade sits in soft open shade under a warm sky.
- **Lens.** Interiors use 35 mm and exteriors 24 mm, all with deep focus. Go wider and the walls bend once the camera moves.
- **Camera height.** Every interior is shot at chest height with the lens level. Shot 9 is the only low one, sitting close to the deck so the infinity edge meets the horizon.
- **Moves.** Use single-axis moves only: push in, track sideways, or rise. Keep them short, slow and at constant speed. Every sideways track runs to the right, so screen direction stays consistent.
- **No numbers in video prompts.** Numbers go only in the image prompts, where they set the camera height.

---

## 4. Shot list

| # | Shot | Move | Its job |
|---|---|---|---|
| 1 | Aerial over the lagoon | Descend toward the villa | Sets the scene and shows the pool up front |
| 2 | Entrance court | Push in to the open pivot door | Arrival |
| 3 | Entrance hall — **master still** | Push in | The big volume, with a view straight through to the sea |
| 4 | Living room | Track right along the open glass | The view, with foreground parallax |
| 5 | Kitchen and dining | Push in along the island | Lifestyle |
| 6 | Floating staircase | Rise | Explains the move upstairs |
| 7 | Master suite | Push in toward the balcony | The retreat |
| 8 | Master bathroom | Track right past the bathtub | The spa moment, which cuts on water into Shot 9 |
| 9 | Infinity pool | Low push toward the edge | The payoff |
| 10 | Twilight finale | Pull back and rise | The closing shot, at blue hour |

**If credits run short,** cut Shot 5 first, then Shot 8, then Shot 6. Never cut 1, 3, 9 or 10.

---

## 5. The shots

---

### SHOT 1 — Aerial over the lagoon

**IMAGE PROMPT**

High aerial view from about sixty metres above a calm turquoise lagoon, looking back toward the shore at a shallow downward angle, a contemporary signature villa on a beachfront frond of Palm Jumeirah, Dubai, in the centre of frame. Two storeys of crisp white render and honed cream travertine, deep cantilevered flat roof slabs, slim bronze-framed floor-to-ceiling glass, vertical bronze fins. A wide travertine pool terrace with a long infinity-edge pool lined in pale green stone, luminous turquoise water, cream sun loungers under white parasols, a private white sand beach with tall date palms running down to the water's edge. Neighbouring villas set back among palms on either side, a distant hazy line of city towers on the horizon behind the villa. Golden hour, low warm sun behind the camera lighting the villa evenly, long soft shadows across the sand, faint glittering ripples on the lagoon, pale clear sky. Shot on a 24 mm lens, deep focus, everything sharp, realistic high-end architectural photography, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Aerial architectural film. Slow continuous descent toward the villa from above the lagoon, downward angle held, constant speed, the villa staying centred and growing larger, ending framed on the infinity pool and the glass facade. A contemporary white and travertine beachfront villa on Palm Jumeirah, Dubai: infinity pool, white sand beach, date palms, calm turquoise lagoon with faint glittering ripples, distant towers behind. Golden hour, low warm sun behind the camera. Wide angle, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 2 — Entrance court

**IMAGE PROMPT**

Wide shot at chest height, about 130 cm above the ground with the lens perfectly level, from the start of a path of large travertine stepping stones crossing a shallow reflecting pool toward the entrance of a contemporary signature villa on Palm Jumeirah, Dubai. A tall solid oak pivot door with a long vertical bronze pull stands wide open under a deep cantilevered white canopy, the double-height entrance hall glowing warm beyond it. Crisp white render and honed cream travertine walls, slim bronze-framed glass, vertical bronze fins, a sculptural olive tree in a travertine planter, low clipped greenery, two tall date palms with uplights at their base. The entrance facade in soft open shade with the low sun hidden behind the house, a warm golden sky above the roofline, the dark stone reflecting pool catching the glow of the doorway, faint slow ripples crossing its surface. Shot on a 24 mm lens, deep focus, everything sharp, straight vertical lines, realistic high-end architectural photography, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Exterior architectural film. Slow continuous push-in along the stepping stones over the reflecting pool toward the open pivot door, chest height, lens level, constant speed, ending with the open doorway centred and the glowing hall beyond. Contemporary white and travertine villa on Palm Jumeirah, Dubai: tall oak pivot door standing open, deep white canopy, bronze fins, uplit date palms, faint slow ripples on the reflecting pool. Facade in soft open shade under a warm golden sky. Wide angle, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

*Optional — the door swings open on camera.* Generate the still with "a tall solid oak pivot door, closed" in place of "stands wide open", and use this video prompt instead. Budget two or three extra re-rolls:

Exterior architectural film. Locked-off camera, chest height, lens level. The tall oak pivot door swings slowly open on its pivot, revealing the warm glowing double-height hall beyond, faint slow ripples on the reflecting pool in the foreground. Contemporary white and travertine villa on Palm Jumeirah, Dubai: deep white canopy, bronze fins, uplit date palms. Facade in soft open shade under a warm golden sky. Wide angle, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 3 — Entrance hall

**This is your master still. Generate it first and get it right.**

**IMAGE PROMPT**

Wide shot from just inside the open front door, camera at chest height about 130 cm above the floor with the lens perfectly level, the edge of the open oak pivot door at the right of frame. The double-height entrance hall of a contemporary signature villa on Palm Jumeirah, Dubai. Large honed cream travertine floor slabs with hairline joints, warm white plaster walls rising to a flat white ceiling with a long linear skylight, a floating staircase of solid travertine treads cantilevered from the wall on the left with a slim recessed bronze handrail, a tall slot window beside it, a cluster of blown-glass globe pendants hanging at different heights, a long low travertine console with a sculptural ceramic vase and a single olive branch, a large abstract canvas in sand and ochre tones. Straight ahead, through a wide opening, the living room with its glass wall slid fully open, the pool terrace and the turquoise lagoon beyond. Golden hour, warm low sunlight raking in from the left through the slot window, laying long bands across the travertine floor, the hall calm and glowing, all lights on. Shot on a 35 mm lens, deep focus, everything sharp from front to back, straight vertical lines, furniture kept away from the frame edges, realistic high-end interior photography, quiet luxury, honed stone, plaster, oak and brushed bronze, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in from the front door into the double-height hall, chest height, lens level, constant speed, ending with the floating staircase passing on the left and the view through the living room to the lagoon centred. Entrance hall of a contemporary Palm Jumeirah villa: honed travertine floor, warm white plaster walls, floating travertine stair, blown-glass globe pendants. Warm low golden-hour sunlight raking in from the left in long bands across the floor. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 4 — Living room

**IMAGE PROMPT**

Wide shot across a large living room, camera at chest height about 130 cm above the floor with the lens perfectly level, looking toward a wall of glass slid fully open so the room flows straight out onto the pool terrace. The living room of a contemporary signature villa on Palm Jumeirah, Dubai. Large honed cream travertine floor slabs running outside onto the terrace without a step, warm white plaster walls, a flat white ceiling with a recessed linear cove light, the back of a long low cream bouclé sofa in the near foreground, two sculptural oak lounge chairs, a solid travertine coffee table with a ceramic bowl and a stone vase of olive branches, a large oatmeal wool rug, a tall olive tree in a stone planter, sheer white linen curtains gathered at the edge of the opening. Beyond the opening, the travertine terrace, the long infinity-edge pool of luminous turquoise water and the calm lagoon running to a low hazy horizon. Golden hour, warm low sunlight raking in from the left across the floor and the sofa, the room glowing, all lights on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical lines, furniture kept away from the frame edges, realistic high-end interior photography, quiet luxury, honed stone, plaster, oak, bouclé and linen, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous sideways track to the right, parallel to the open glass wall, chest height, lens level, constant speed, the sofa sliding past in the foreground while the pool and lagoon hold in view beyond. Living room of a contemporary Palm Jumeirah villa: honed travertine floor running out to the terrace, cream bouclé sofa, travertine coffee table, sheer linen curtains stirring gently in the breeze, faint slow ripples on the pool. Warm low golden-hour sun raking in from the left. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 5 — Kitchen and dining *(cut this first if credits run short)*

**IMAGE PROMPT**

Wide shot along the length of a kitchen island, camera at chest height about 130 cm above the floor with the lens perfectly level, the island running away from the camera on the right. The kitchen and dining room of a contemporary signature villa on Palm Jumeirah, Dubai. A monolithic island in honed cream travertine with a thick mitred edge and soft natural veining, handleless full-height cabinetry in pale rift-cut oak, a honed travertine splashback, a brushed bronze tap, three blown-glass globe pendants hanging low over the island, a bowl of lemons and two ceramic jugs on the worktop. Beyond the island, a long solid oak dining table with cream upholstered chairs under a sculptural linear pendant, and a glass wall slid fully open onto the pool terrace and the lagoon. Large honed travertine floor slabs, warm white plaster walls, flat white ceiling. Golden hour, warm low sunlight raking in from the left across the floor and the island top, the room glowing, all lights on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical lines, cabinets kept away from the frame edges, realistic high-end interior photography, quiet luxury, honed stone, oak and brushed bronze, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in along the kitchen island toward the dining table and the open glass wall, chest height, lens level, constant speed, ending with the dining table and the pool terrace centred. Kitchen of a contemporary Palm Jumeirah villa: monolithic honed travertine island, pale oak cabinetry, blown-glass globe pendants, long oak dining table. Warm low golden-hour sun raking in from the left across the island top. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 6 — Up the floating staircase

**IMAGE PROMPT**

Wide shot from the foot of a floating staircase in a double-height hall, camera at chest height about 130 cm above the floor with the lens perfectly level, the stair rising across the frame from lower left to upper right. Solid honed travertine treads cantilevered from a warm white plaster wall with no visible supports, a slim recessed bronze handrail along the wall, a cluster of blown-glass globe pendants hanging through the full height of the space, a tall slot window running floor to ceiling beside the stair, and at the top the edge of the first-floor gallery landing with a clear glass balustrade. Large honed cream travertine floor slabs, a flat white ceiling with a long linear skylight. Golden hour, warm low sunlight from the slot window laying long bands of light across the treads and the wall, the hall glowing, all lights on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical lines, realistic high-end interior photography, quiet luxury, honed stone, plaster and brushed bronze, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow continuous vertical rise, the camera lifting straight up alongside the floating staircase, lens level, constant speed, the treads stepping down through the frame, ending level with the first-floor gallery landing. Double-height hall of a contemporary Palm Jumeirah villa: cantilevered travertine treads, recessed bronze handrail, warm white plaster wall, blown-glass globe pendants. Warm low golden-hour sunlight from a tall slot window laying long bands across the treads. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 7 — Master suite

**IMAGE PROMPT**

Wide shot from the doorway of a master bedroom on the axis of the room, camera at chest height about 130 cm above the floor with the lens perfectly level, looking toward a wall of glass slid fully open onto a balcony over the sea. The master suite of a contemporary signature villa on Palm Jumeirah, Dubai. A low king-size bed with its tall oatmeal linen headboard against a fluted oak panel wall on the right, crisp white bedding with a folded sand-coloured throw, floating oak bedside shelves with small alabaster lamps switched on, a pale wool rug, a pair of cream bouclé lounge chairs beside the opening, sheer white linen curtains gathered at its edge. Large honed travertine floor slabs, warm white plaster walls, a flat white ceiling with a recessed cove light. Through the opening, a balcony with a clear glass balustrade, the infinity pool below and the calm turquoise lagoon running to a low hazy horizon. Golden hour, warm low sunlight raking in from the left across the floor and the foot of the bed, all lights on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical lines, furniture kept away from the frame edges, realistic high-end interior photography, quiet luxury, linen, oak, plaster and honed stone, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in from the bedroom doorway toward the open glass wall, chest height, lens level, constant speed, ending with the balcony and the lagoon centred and the bed at the right. Master suite of a contemporary Palm Jumeirah villa: low bed with white linen and an oatmeal headboard, fluted oak wall, alabaster lamps glowing, honed travertine floor, sheer linen curtains stirring gently in the breeze. Warm low golden-hour sun raking in from the left. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 8 — Master bathroom

**IMAGE PROMPT**

Wide shot of a spa-like master bathroom from one side, camera at chest height about 130 cm above the floor with the lens perfectly level, the vanity wall behind the camera. A freestanding sculpted bathtub carved from a single block of honed cream stone stands before a full-height window looking out over the turquoise lagoon. Walls and floor in large honed travertine slabs, a walk-in shower behind a single clear glass panel on the right with a brushed bronze rain head, a low oak bench with folded white towels, a stone tray on the bath rim with a lit candle and a sprig of eucalyptus, a small olive tree in a stone pot. The bath filled with clear water, faint slow ripples catching the light. Golden hour, warm low sunlight raking in from the left across the bathtub and the floor, the room calm and glowing. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical lines, realistic high-end interior photography, quiet luxury, honed stone, oak and brushed bronze, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous sideways track to the right past the freestanding stone bathtub, chest height, lens level, constant speed, the bathtub sliding across the foreground while the lagoon stays framed in the tall window. Master bathroom of a contemporary Palm Jumeirah villa: sculpted stone bathtub, honed travertine walls and floor, bronze rain shower, a lit candle flickering softly, faint slow ripples on the bath water. Warm low golden-hour sun raking in from the left. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 9 — Infinity pool

**IMAGE PROMPT**

Low wide shot on a travertine pool terrace, camera about 60 cm above the deck with the lens perfectly level, looking down the length of a long infinity-edge pool toward the sea so the pool's vanishing edge meets the lagoon at the horizon. The pool terrace of a contemporary signature villa on Palm Jumeirah, Dubai. Large honed travertine deck slabs, the pool lined in pale green stone with luminous turquoise water, faint slow ripples crossing the surface and soft caustic light moving on the pool floor, a thin sheet of water spilling over the far edge. Cream sun loungers with folded white towels under a white parasol on the left, a low stone side table with a glass of iced water, the tops of two date palms and a strip of white sand beach just below the edge, the calm turquoise lagoon running to a low hazy horizon. Golden hour, warm low sun out of frame to the left, long soft shadows across the deck, the water glittering, a clear warm sky filling only the top third of frame. Shot on a 24 mm lens, deep focus, everything sharp, realistic high-end architectural photography, immaculate, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Architectural film. Slow short continuous push-in low along the pool toward the infinity edge, lens level, constant speed, the vanishing edge and the lagoon beyond growing in frame. Pool terrace of a contemporary Palm Jumeirah villa: honed travertine deck, luminous turquoise water with faint slow ripples and soft caustic light moving on the pool floor, water spilling gently over the far edge, cream loungers under a white parasol on the left, the calm lagoon beyond. Warm low golden-hour sun out of frame to the left. Wide angle, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 10 — Twilight finale

This still is **an edit of Shot 1's still, not a new image**, which is what keeps the villa identical at night. Attach Shot 1's finished still to the image model, then paste the prompt below.

**IMAGE PROMPT — edit, with Shot 1's still attached**

Same villa, same camera position, same framing as this image. Change the time to blue hour just after sunset: a deep blue twilight sky fading to soft violet near the horizon, every interior light on so the glass facade glows warm gold, the infinity pool lit from within in luminous turquoise, uplights on the date palms, soft warm lights along the beach path, the lagoon calm and dark blue reflecting the glow, the distant towers behind lit up. Change nothing else. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Aerial architectural film. Slow continuous pull-back and rise away from the villa over the lagoon, downward angle held, constant speed, the villa staying centred and growing smaller as more of the lit shoreline comes into view. Contemporary white and travertine beachfront villa on Palm Jumeirah, Dubai, at blue hour: glass facade glowing warm gold, infinity pool lit turquoise, uplit date palms, calm dark lagoon reflecting the lights, distant towers lit behind. Deep blue twilight sky. Wide angle, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

## 6. Making it one house

The method is the same as section 6 of the Dubai pack.

- **Generate Shot 3's still first** and get it right: floor, walls, pendants, oak, bronze and eyeline. For Shots 4–8, attach it and write:

  > Same villa as this image — same travertine floor, same plaster walls, same oak and bronze, same globe pendants, same light, same camera height. Now show: *(paste the shot's image prompt)*

- **For Shots 2 and 9, attach Shot 1's still** in the same way ("Same villa as this image…") so the facade, stone and pool match.
- **Make Shot 10 as an edit of Shot 1's still**, as described above.
- **Attach the master every time.** Never rely on chat history. Reject any still where the floor, walls, pendants or pool lining have changed. Stills are cheap, so re-roll them freely. Clips are not.

---

## 7. Trim and stitch

Each clip is 8 seconds, and Veo eases into and out of every move, so keep the middle. When two shots connect, keep the **tail** of the clip that arrives somewhere and the **head** of the clip that starts there.

| Clip | Trim | Why |
|---|---|---|
| 01 | `-ss 1 -t 6` | Opening shot, held long. |
| 02 | `-ss 2 -t 6` | Keep the tail, because it arrives at the open door. |
| 03 | `-ss 0 -t 5` | Keep the head, because it starts on the threshold. |
| 04 | `-ss 1.5 -t 5` | Trim both ends equally. |
| 05 | `-ss 2 -t 4` | Trim both ends equally. |
| 06 | `-ss 2 -t 6` | Keep the tail, because it arrives at the landing. |
| 07 | `-ss 0 -t 5` | Keep the head, because it starts in the doorway. |
| 08 | `-ss 2 -t 4` | Trim both ends equally, and cut on the water. |
| 09 | `-ss 1 -t 6` | The payoff. |
| 10 | `-ss 0 -t 8` | The whole clip. Let it breathe. |

Save the downloaded clips as `raw/01.mp4` … `raw/10.mp4`, then run this from the repository root. Shots 1–9 join with hard cuts, followed by a one-second dissolve into the twilight finale. The dissolve is the cut that tells the viewer time has passed.

```bash
mkdir -p walk final
trim() { ffmpeg -y -i "raw/$1.mp4" -ss "$2" -t "$3" -an -c:v libx264 -crf 18 -pix_fmt yuv420p "$4"; }
trim 01 1   6 walk/01.mp4
trim 02 2   6 walk/02.mp4
trim 03 0   5 walk/03.mp4
trim 04 1.5 5 walk/04.mp4
trim 05 2   4 walk/05.mp4
trim 06 2   6 walk/06.mp4
trim 07 0   5 walk/07.mp4
trim 08 2   4 walk/08.mp4
trim 09 1   6 walk/09.mp4
trim 10 0   8 final/2-finale.mp4

./tools/stitch-walkthrough.sh walk final/1-walk.mp4 0   # shots 1–9, hard cuts
./tools/stitch-walkthrough.sh final film_mute.mp4 1     # 1 s dissolve into the finale
```

If you skip a shot, drop its `trim` line. The stitcher joins whatever is in the folder, in filename order.

**For 9:16,** change line 16 of `tools/stitch-walkthrough.sh` from `W=1920; H=1080` to `W=1080; H=1920`. Otherwise vertical clips get black bars at the sides.

Last, lay one continuous music bed under the film, with a fade to black and a music fade-out at the end. Strip Veo's own audio, because ten clips would give you ten different soundtracks:

```bash
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 film_mute.mp4)
ffmpeg -i film_mute.mp4 -stream_loop -1 -i music.mp3 -map 0:v -map 1:a -shortest \
  -vf "fade=t=out:st=$(echo "$D - 1.5" | bc -l):d=1.5" \
  -af "afade=t=out:st=$(echo "$D - 3" | bc -l):d=3" \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart film.mp4
```

The result is about 54 seconds. For music, slow piano or ambient strings suit this film.

---

## 8. If a shot comes out wrong — luxury edition

- **Stone veining crawls or the floor swims.** The surface is too busy or too shiny. Keep it "honed" with "soft natural veining", never "polished" or "book-matched marble", and shorten the move.
- **The pendants shimmer, multiply or melt.** Ask for fewer, larger globes: change "a cluster of blown-glass globe pendants" to "three large blown-glass globe pendants". Never ask for crystal chandeliers.
- **A mirror appears and reflects the wrong room.** Re-roll the still. The prompt already puts the vanity behind the camera, so don't add the word "mirror" to fix it, because naming it summons it.
- **Glass walls ghost, double or fill with reflections.** Check that the still shows them slid fully open. A closed glass wall facing the camera is the most common failure in luxury interiors.
- **Curtains flap wildly.** Change "stirring gently in the breeze" to "hanging still".
- **The infinity edge breaks or the pool turns into a flat blue slab.** Keep "faint slow ripples… soft caustic light", never "still", "glassy" or "mirror". Keep the sky to a narrow band of the frame.
- **The rise in Shot 6 bends the walls.** Fall back to a slow, short push-in toward the foot of the stair, looking up the flight.
- **The twilight lights flicker or switch on mid-clip.** Re-roll. If it keeps happening, ask for "a short pull-back".
- **A person walks in.** The move was too small, and near-static clips are where Veo invents motion. Keep a real push-in and re-roll.
- **Anything else:** see section 9 of `DUBAI-WALKTHROUGH-PROMPTS.md`.
