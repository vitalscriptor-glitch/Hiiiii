# Dubai Villa Walkthrough — Prompt Pack for Google Flow (Veo 3.1)

## Before you start — read this once

1. **Make the pictures first, then the videos.** For every shot you make one still image, then turn that still into an 8-second video. Images are cheap and re-rollable. Videos cost credits. Fix every problem in the image stage.
2. **Always choose 8 seconds, 16:9, 720p.** Flow charges the same for 4, 6 and 8 seconds. 16:9 is correct for a house tour.
3. **Use Veo 3.1 Lite (10 credits) for your first pass.** Use Fast (20 credits) only for Shot 1 and Shot 9, which carry the look of the whole film. Free tier gives 50 credits a day and they do not roll over.
4. **Plan for failures.** Budget 15–20 generations for nine shots. That is 3–4 days of free credits with Lite. Write nothing new on the day — the prompts below are ready to paste.
5. **One room per clip. One camera move per clip. Never ask the camera to go through a wall or a closed door.** The single most important rule. Every room-to-room change happens at the cut, not inside a clip. The one exception in this pack is Shot 8 → Shot 9, through a doorway that is already wide open and visible in the first frame.
6. **Long "Avoid:" lists do not work — this pack keeps one short tail line only.** Flow has no negative prompt field, so a banned word is fed to the text encoder as an ordinary requested word; diffusion text encoders do not process negation. Writing "marble, gold, chandelier" under "Avoid" asks for marble, gold and a chandelier. So every prompt below ends with exactly three words — `Avoid: people, on-screen text, lens flare.` — which are high-frequency Veo failure modes that respond slightly to being named. Everything else is controlled positively, by naming the cheap material you do want. See section 5. Real enforced negatives exist only on the Gemini API / Vertex AI Veo endpoint, which has a `negativePrompt` parameter. Not in Flow.
7. **The image prompts are long on purpose and the video prompts are short on purpose.** A still is a single pass with good prompt adherence, so 300 words helps it. Veo stops weighting evenly past roughly 80–120 words and starts discarding — and the first thing it discards is your camera instruction. Every video prompt below is 70–95 words in a fixed order: camera move, room, light, lens. **Never paste an image prompt into the video box.** All the material detail reaches the video through the start frame for free.
8. **Where to find image-to-video in the Flow app:** tap the model name at the bottom, choose Video, then Frames. Drop your still into "+ Add start frame".
9. Free accounts get throttled at peak times — not on a published schedule, so just check your own credit balance and queue speed before committing to a session. Upscaling and output resolution limits vary by tier; confirm in-app.

---

## 1. Shot list

The house is a modest two-storey G+1 villa in Mirdif. **Front door faces west.** Ground floor: entrance hall, kitchen, formal majlis. Upstairs: landing, two bedrooms, and a family living room whose sliding doors open east onto the flat roof terrace with a small plunge pool. The camera walks eastward through the whole house, which is why the clips run in this order and why each move is physically possible.

| # | Name | Length | Its job in the film |
|---|---|---|---|
| 1 | Street from above | 8s | Shows the whole house, the open gate, and the pool on the roof — so the ending is promised in the first shot. |
| 2 | Driveway to front door | 8s | Puts the viewer on the ground, walking up to the open door. |
| 3 | Entrance hall | 8s | The moment of entering. Lands on the open kitchen door. |
| 4 | Kitchen | 8s | The working heart of the house. Ends looking back at the hall and the foot of the stairs. |
| 4B | Up the staircase *(optional, recommended)* | 8s | Makes the floor change undeniable. The highest-value extra clip in this pack. |
| 5 | Upstairs landing | 8s | Explains the floor change and arrives square-on at the bedroom door. |
| 6 | Main bedroom | 8s | The private part of the house. |
| 7 | Second bedroom | 8s | Shows it is a family house, not a show flat. |
| 8 | Family living room | 8s | The main social space, and it walks you to the terrace threshold. |
| 9 | Roof terrace and pool | 8s | The ending. The payoff shot. |

**If credits run short:** cut Shot 7 first, then Shot 4B if you added it. Only cut the kitchen (Shot 4) if you are still short after that — your brief asks for it. **Never cut Shot 5.** Without Shot 4B it is the only shot that explains how the camera got upstairs.

**Order note:** professionals usually put the living room right after the entrance. You asked for kitchen and bedrooms first, which is fine — the living room is *upstairs*, as a family hall, which real Mirdif villas have. So the camera path is still one continuous eastward walk and your order is kept exactly.

---

## 2. Continuity block

This is the fixed description of your house. Every fact in it is already woven into the image prompts below. If you write any extra prompt yourself, paste this into it word for word.

> Modest two-storey G+1 villa in Mirdif, Dubai. Plain beige cement-render walls, flat roof with parapet, white aluminium window frames, matching beige boundary wall, grey interlock driveway. Front door faces west; the roof terrace and plunge pool are on the east side. Dark walnut front door, white lacquer internal doors, half-glazed white lacquer kitchen door, all with brushed stainless lever handles. Inside: warm white walls, 800 mm ivory matt porcelain floor tiles, white gypsum ceiling with cove LED and white slot AC vents. Ivory porcelain stair treads with a plain painted balustrade. Roof terrace in beige travertine-look porcelain deck tile behind a one-metre rendered parapet. Two white condenser units on the side wall at ground level and three on the roof. Flat beige neighbouring rooftops and date palm tops fading into dust haze on every horizon. Late afternoon, low warm sun from the west. Furnished with mainstream retail furniture, lived-in, no people.

---

## 3. Fixed rules — do not change these between shots

- **Orientation.** The front door faces west. The camera walks east through the whole house. The terrace and pool are on the east side, so the sun is behind the camera in Shots 1, 2 and 9. Interior windows: the hall and kitchen windows are in the west front wall behind the camera; the landing window is in the west wall over the stairwell; both bedroom windows are in the south side wall and the sun rakes in from the right.
- **Interior lens: 35 mm, deep focus.** Not 20 mm. Extreme wide-angle plus forward motion is the main cause of bending, swimming walls — the per-pixel motion at the frame edge is more than the model can track. A 35 mm push-in through a modest hallway is one of the most reliable interior moves Veo does. If a room genuinely will not read at 35 mm, 28 mm is the floor. Let the rooms feel smaller.
- **Exterior lens: 24 mm, deep focus — Shots 1 and 2 only.** Shot 9 stays at 35 mm because it is chained out of Shot 8; changing lens inside a chained move is what makes the model reshape the room mid-take. Shot 2 also sits at the same chest height as the interiors so the cut into Shot 3 matches; the lens change happens at the cut, which is normal film grammar.
- **Camera height: chest height, lens perfectly level, every interior shot.** Do not try to enforce this with numbers in the video prompt — Veo has no metric model and the start frame sets the height anyway. Enforce it in the image stage: generate Shot 3's still first and use it as the reference image for every other interior. The eyeline carries over through the picture, which is the only thing that does carry over.
- **No numbers in video prompts.** "Chest height, lens level." "Large-format porcelain floor." "A small plunge pool." Numerals buy you nothing and measurably raise the odds of rendered digits appearing on a wall.
- **Pure single-axis moves.** Push in, or track sideways. Never a push-in that also drifts right — a compound two-axis move is where the walls bend. You get screen direction from **composition** instead: in every still, the doorway that hands over to the next room sits on the **right** of frame. (Shot 5 is the deliberate exception: it lands square-on into the bedroom.)
- **Ask for a short move.** You only keep the middle few seconds of each clip, so a long travel is motion you pay for and throw away. Short move, constant speed, half walking pace.
- **Veo always decelerates at the end of a clip. You cannot prompt it away.** That is exactly why you trim and keep the middle.
- **Time of day: late afternoon, about ninety minutes before sunset.** Same in all shots. If you later want the dusk pool version you must regenerate **every** exterior at dusk too — never mix the two.

---

## 4. The shots

---

### SHOT 1 — Street from above

**IMAGE PROMPT**

High-angle aerial view from roughly forty metres up, looking down a quiet suburban street at a shallow thirty-degree downward angle. A row of near-identical modest two-storey G+1 villas in Mirdif, Dubai, with our villa in the centre of frame, distinguished by a honed beige limestone panel on its entrance bay, a shallow cornice band under the parapet, and a frangipani and two date palms in the gravel bed inside its boundary wall; only the centre one has a furnished roof terrace and plunge pool. Plain beige cement-render walls, flat roofs with plain parapets, white aluminium window frames, matching beige boundary walls about two metres high around each plot with a grey slatted sliding metal vehicle gate, grey interlock-paver driveways laid in herringbone, two white split air-conditioning condenser units on the side wall at ground level and three on each flat roof, plus a small white water tank on each flat roof. The centre villa's roof is a terrace behind a one-metre rendered parapet, with a beige fabric shade pergola on a slim galvanised steel frame, two grey sun loungers, terracotta pots of magenta bougainvillea and a small rectangular plunge pool of light-blue water in the far corner. The centre villa's grey slatted sliding gate stands fully open and its dark walnut front door stands open. One ordinary silver hatchback parked under a beige fabric shade sail on a galvanised steel frame in that driveway. Wide smooth pale tarmac road with sand-coloured kerbs, Washingtonia and date palms along the verge, beige gravel beds with drip irrigation lines, magenta bougainvillea cascading over the boundary walls, a fine beige dust film on the pavers and the parked car. Late afternoon, low warm sun from the west behind the camera, long soft shadows raking across the road, pale hazy blue-white sky, flat beige rooftops and palm tops fading into dust haze on the horizon. Shot on a 24 mm wide-angle lens, deep focus, everything sharp, consistent exposure, realistic documentary architectural photography, builder-standard finishes, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Aerial architectural film. Slow continuous descent toward a quiet suburban street, downward angle held, constant speed, our villa staying centred and growing larger, ending framed on its driveway and open sliding gate. A row of near-identical beige two-storey villas in Mirdif, Dubai: flat roofs with parapets, white window frames, interlock driveways, a silver hatchback under a shade sail, the centre villa's roof terrace with pergola and plunge pool. Low warm sun from the west behind the camera, long raking shadows, hazy sky. Wide angle, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 2 — Driveway to front door

**IMAGE PROMPT**

Wide shot, camera at chest height about 130 cm above the ground with the lens perfectly level, taken from the open sliding gate, three-quarter corner view of the villa so that the front facade and one side wall are both visible. A modest two-storey G+1 family villa in Mirdif, Dubai, plain beige cement-render walls, flat roof with a plain parapet and a shallow cornice band, a single honed beige limestone panel on the entrance bay, white aluminium window frames with deep reveals and tinted glass, a dark walnut veneer front door standing wide open with a brushed stainless lever handle, the top of a beige fabric shade pergola just visible above the roof parapet. Grey interlock-paver driveway in herringbone leading to a beige fabric shade sail over an ordinary silver hatchback, matching beige boundary wall with flat coping, beige gravel beds with a frangipani and two date palms, magenta bougainvillea over the wall top, two white split air-conditioning condenser units on the side wall at ground level and three on the roof, a fine beige dust film on the pavers and the wall base. Late afternoon, low warm sun from the west directly behind the camera, front-lighting the facade evenly, long soft shadows stretching toward the camera across the driveway, pale hazy blue-white sky, flat beige rooftops and palm tops fading into dust haze beyond the house. Shot on a 24 mm wide-angle lens, deep focus, everything sharp, consistent exposure, realistic documentary architectural photography, builder-standard finishes, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Exterior architectural film. Slow continuous push-in up the driveway from the open gate toward the house, chest height, lens level, constant speed, ending with the open front door centred. A modest beige two-storey villa in Mirdif, Dubai: flat roof with parapet and shallow cornice, honed limestone entrance panel, white window frames, dark walnut front door standing open, interlock driveway, silver hatchback under a shade sail, beige boundary wall, date palms, bougainvillea. Low warm sun from the west behind the camera front-lighting the facade. Wide angle, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 3 — Entrance hall

**This is your master still. Generate it first and get it perfect.**

**IMAGE PROMPT**

Wide shot from just inside an open front door, camera at chest height about 130 cm above the floor with the lens perfectly level, the open dark walnut door leaf and a bright sliver of grey interlock driveway caught at the left edge of frame. The entrance hall of a modest two-storey G+1 family villa in Mirdif, Dubai. Warm white painted walls, 800 by 800 mm ivory matt porcelain floor tiles with very thin grout lines and matching tile skirting, a flat white gypsum false ceiling about three metres high with a dropped perimeter cove hiding a warm LED strip, small round recessed downlights, a white linear slot air-conditioning diffuser. A simple straight staircase with ivory porcelain treads and a plain painted stringer and balustrade rising on the left, a low console table with a small potted jasmine, a half-glazed white lacquer kitchen door standing open on the right with a brushed stainless lever handle, showing a sliver of light grey laminate base cabinets and a speckled grey quartz worktop, and a narrow opening ahead giving a partial glimpse of a formal ground-floor majlis beyond, with low cream fabric bench seating along the walls, a patterned wool rug and a brass-tray side table. A hard shaft of low warm sunlight entering through a tall window in the front wall behind the camera, with white aluminium frames and deep reveals, falling away from the camera across the porcelain tiles, the room itself cool and calm, all interior lights switched on. Shot on a 35 mm lens, deep focus, everything sharp from front to back, straight vertical walls, furniture kept away from the frame edges, consistent exposure, realistic documentary interior photography, mainstream retail furniture, builder-standard finishes, plain painted plaster, matt porcelain, painted MDF, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow continuous push-in, chest height, lens level, constant speed, ending with the staircase edge passing the left and the open half-glazed kitchen door arriving at the right. Entrance hall of a modest beige villa in Mirdif, Dubai: warm white walls, large-format ivory porcelain floor, grout lines barely visible, flat white ceiling with a warm cove light, a plain staircase on the left. Low warm late-afternoon sun through a tall window in the front wall behind the camera, a hard shaft falling away across the floor. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 4 — Kitchen

**IMAGE PROMPT**

Wide shot from inside a semi-open kitchen, camera at chest height about 130 cm above the floor with the lens perfectly level, looking along the run of the counter, the extractor hood seen at an angle rather than square-on to the camera. A modest family kitchen in a two-storey G+1 villa in Mirdif, Dubai. Flat-slab handleless cabinets in light grey laminate on the base units and light woodgrain laminate on the wall units, a plain speckled grey quartz worktop, a single uninterrupted plain ivory panel splashback, a brushed stainless four-burner hob with a matt-finish extractor hood, a drop-in stainless sink under a window in the west front wall looking onto the gravel bed and the beige boundary wall, an electric kettle and a wooden chopping board left out on the worktop, a floor-standing white water dispenser in the corner, a plain white fridge, unbranded front. Warm white painted walls, 800 by 800 mm ivory matt porcelain floor tiles with thin grout lines and matching tile skirting, flat white gypsum false ceiling with a dropped perimeter cove hiding a warm LED strip, recessed downlights under the wall units, a white square air-conditioning ceiling grille. A half-glazed white lacquer door standing open on the far side showing a sliver of the entrance hall and the bottom two treads of the staircase beyond, and a second plain white door to a rear service yard. Late afternoon, low warm sunlight from the west coming through the window above the sink, falling in a soft band across the quartz worktop, window panes bright and slightly blown out, the room cool, all interior lights switched on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, cabinets kept away from the frame edges, consistent exposure, realistic documentary interior photography, builder-standard finishes, plain painted plaster, matt porcelain, laminate and painted MDF, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous sideways track to the right along the kitchen counter, staying parallel to the worktop, chest height, lens level, constant speed, ending with the open half-glazed door, the entrance hall and the foot of the staircase entering the right of frame. Modest family kitchen in a beige Mirdif villa: light grey laminate base cabinets, woodgrain wall cabinets, grey quartz worktop, plain ivory panel splashback, stainless hob and matt hood, large-format ivory porcelain floor, grout lines barely visible. Low warm sun from the west through the window above the sink. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 4B — Up the staircase *(optional, recommended)*

**IMAGE PROMPT**

Wide shot from the foot of a straight staircase looking straight up the flight, camera at chest height about 130 cm above the floor with the lens perfectly level, the flight centred and running away from the camera. The staircase of a modest two-storey G+1 family villa in Mirdif, Dubai. Ivory porcelain treads with matching risers, a plain painted stringer and a plain painted balustrade with a simple painted handrail, warm white painted walls, 800 by 800 mm ivory matt porcelain floor tiles in the hall at the bottom of frame, a flat white gypsum ceiling with a dropped cove hiding a warm LED strip, a slice of the first-floor landing ceiling and its warm cove glow visible at the top of the flight. Late afternoon, low warm sunlight from the west spilling in from the hall behind the camera and laying a soft band across the lower treads, the upper flight in warm bounced light, all interior lights switched on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, consistent exposure, realistic documentary interior photography, builder-standard finishes, plain painted plaster, matt porcelain, painted MDF, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in toward the foot of the stair, looking straight up the centre of the flight, chest height, lens level, constant speed. Staircase of a modest beige villa in Mirdif, Dubai: ivory porcelain treads, plain painted balustrade and handrail, warm white walls, warm cove light glowing on the landing at the top of the flight. Low warm late-afternoon sun spilling in from the hall behind the camera across the lower treads. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 5 — Upstairs landing *(never cut this)*

**IMAGE PROMPT**

Wide shot along a first-floor landing, camera at chest height about 130 cm above the floor with the lens perfectly level, with the top three ivory porcelain treads, the plain painted balustrade and the handrail newel filling the lower foreground of frame, as if the camera has just stepped off the last tread. The upstairs landing of a modest two-storey G+1 family villa in Mirdif, Dubai. Warm white painted walls, 800 by 800 mm ivory matt porcelain floor tiles with thin grout lines and matching tile skirting, a flat white gypsum false ceiling with a dropped perimeter cove hiding a warm LED strip and small recessed downlights, a white linear slot air-conditioning diffuser. Two white lacquer veneered doors with brushed stainless lever handles and matching white architraves, the far one square-on at the end of the landing standing wide open, showing the foot of a bed and a window beyond, the nearer one on the right closed. A single low plant pot with a jasmine against the wall, no other furniture. Late afternoon, low warm sunlight entering through a tall window with white aluminium frames and deep reveals in the west wall behind the camera over the stairwell, throwing a long soft pool of light down the porcelain floor away from the camera toward the open far door, the landing calm, all interior lights switched on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, door frames kept away from the frame edges, consistent exposure, realistic documentary interior photography, builder-standard finishes, plain painted plaster, matt porcelain, painted MDF, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in along the landing, chest height, lens level, constant speed, beginning with the top treads and handrail newel in the lower foreground and ending with the open far doorway centred and the bedroom floor continuing through it. First-floor landing of a modest beige villa in Mirdif, Dubai: warm white walls, large-format ivory porcelain floor, grout lines barely visible, white cove-lit ceiling, white lacquer doors with stainless lever handles. Low warm sun from a tall window in the west wall behind the camera laying a long pool of light down the floor. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 6 — Main bedroom

**IMAGE PROMPT**

Wide shot from inside a bedroom doorway on the axis of the room, camera at chest height about 130 cm above the floor with the lens perfectly level. The main bedroom of a modest two-storey G+1 family villa in Mirdif, Dubai. Warm white painted walls, 800 by 800 mm ivory matt porcelain floor tiles with thin grout lines and matching tile skirting, a soft beige loose rug beside the bed, a flat white gypsum false ceiling with a dropped perimeter cove hiding a warm LED strip, small recessed downlights, a white square air-conditioning ceiling grille. A plainly made double bed with a low fabric headboard and white bedding, two simple bedside tables with small lamps switched on, a run of built-in wardrobes with full-height flush matt white sliding doors across the far wall, a white lacquer veneered en-suite door standing ajar on the left. A large window in the south side wall on the right, with white aluminium frames, deep reveals and tinted glass, dressed with a white sheer and a folded-back grey blackout curtain on a double track, the view through it showing the flat parapet roofs of neighbouring beige villas and date palm tops fading into dust haze. Late afternoon, low warm sunlight from the west raking in from the right across the window reveal, laying a soft rectangle of light across the porcelain floor and the foot of the bed, window panes bright and slightly blown out, the room warm and calm, all interior lights switched on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, furniture kept away from the frame edges, consistent exposure, realistic documentary interior photography, mainstream retail furniture, builder-standard finishes, plain painted plaster, matt porcelain, painted MDF, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in from the bedroom doorway into the room, chest height, lens level, constant speed, ending with the window and its deep reveal at the right of frame, the en-suite door ajar at the left and the wardrobe run across the far wall. Main bedroom of a modest beige Mirdif villa: warm white walls, large-format ivory porcelain floor, grout lines barely visible, made double bed with white bedding, bedside lamps switched on, flush matt white wardrobes. Low warm sun from the west raking in from the right across the window reveal. Standard wide lens, deep focus, unoccupied, curtains still. Avoid: people, on-screen text, lens flare.

---

### SHOT 7 — Second bedroom *(cut this first if credits run short)*

**IMAGE PROMPT**

Wide shot of a small second bedroom composed from one corner of the room, camera at chest height about 130 cm above the floor with the lens perfectly level, the desk toward the lower left and the window ahead. The second bedroom of a modest two-storey G+1 family villa in Mirdif, Dubai. Warm white painted walls, 800 by 800 mm ivory matt porcelain floor tiles with thin grout lines and matching tile skirting, a small pale grey loose rug, a flat white gypsum false ceiling with a dropped perimeter cove hiding a warm LED strip, small recessed downlights, a white square air-conditioning ceiling grille. A simple single bed with plain white bedding and a light grey throw, a small wooden study desk with an empty chair and a desk lamp switched on, a narrow empty shelf unit, a run of built-in wardrobes with full-height flush matt white hinged doors. A narrower window than the main bedroom's in the south side wall, with a single opening casement, white aluminium frames, deep reveals and tinted glass, dressed with a white roller blind pulled halfway up, showing flat beige parapet roofs and a date palm top fading into dust haze. Late afternoon, low warm sunlight from the west raking in from the right across the window reveal, laying a soft band across the desk and the porcelain floor, window panes bright and slightly blown out, the room warm and quiet, all interior lights switched on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, furniture kept away from the frame edges, consistent exposure, realistic documentary interior photography, mainstream retail furniture, builder-standard finishes, plain painted plaster, matt porcelain, painted MDF, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in from the corner of the room toward the desk and window, chest height, lens level, constant speed, ending with the desk in the lower left of frame and the narrow window and its half-raised roller blind centred. Second bedroom of a modest beige Mirdif villa: warm white walls, large-format ivory porcelain floor, grout lines barely visible, single bed with white bedding, a small wooden desk with its lamp switched on, flush matt white wardrobes. Low warm sun from the west raking in from the right across the window reveal. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 8 — Family living room

**IMAGE PROMPT**

Wide shot of an upstairs family living room looking east toward the terrace doors, camera at chest height about 130 cm above the floor with the lens perfectly level, composed with the corner of a sofa in the near foreground. The first-floor family hall of a modest two-storey G+1 family villa in Mirdif, Dubai. Warm white painted walls, 800 by 800 mm ivory matt porcelain floor tiles with thin grout lines and matching tile skirting, a large flat-weave beige loose rug, a flat white gypsum false ceiling with a dropped perimeter cove hiding a warm LED strip, small recessed downlights, a white linear slot air-conditioning diffuser. A mainstream retail grey fabric L-shaped sofa with two cushions, a low MDF coffee table with a tray and a small glass of mint tea, a wall-mounted flat television switched off above a low white console, a six-seat dining table with simple wooden chairs in the far corner, a tall potted areca palm. Across the far wall a wide white aluminium-framed sliding door standing fully open, angled slightly so the glass is not facing the camera square-on, showing part of the flat roof terrace beyond, with beige travertine-look porcelain deck tiles beginning at a low brushed aluminium door threshold strip where the ivory interior tile stops, a beige fabric shade pergola on a slim galvanised steel frame, a one-metre rendered beige parapet, and the far corner of a small plunge pool of light-blue water. Late afternoon, low warm sunlight from the west entering through a tall side window on the right behind the camera, laying a long soft rectangle of light across the porcelain floor and the rug and up the wall beside the open sliding door, the terrace beyond in open shade with warm bounce off the pale deck tiles, the room calm, all interior lights switched on. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, furniture kept away from the frame edges, consistent exposure, realistic documentary interior photography, mainstream retail furniture, builder-standard finishes, plain painted plaster, matt porcelain, painted MDF, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Interior architectural film. Slow short continuous push-in across the room toward the fully open sliding door, chest height, lens level, constant speed, ending on the threshold with the open doorway filling the frame, the low brushed aluminium threshold strip at the bottom of frame and the shaded terrace deck beyond. First-floor family hall of a modest beige Mirdif villa: grey L-shaped sofa, low coffee table, wall-mounted television switched off, dining table in the far corner, large-format ivory porcelain floor, grout lines barely visible. Low warm sun from a tall side window on the right behind the camera. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

### SHOT 9 — Roof terrace and pool

This shot has **two** stills. The first is the start frame, the second is the end frame. Do not mix them up — if you drop the terrace still into "+ Add start frame" the clip begins where it was meant to finish.

**IMAGE PROMPT — START FRAME (camera on the threshold, looking out)**

Wide shot from just inside an open sliding door looking east out onto a flat roof terrace, camera at chest height about 130 cm with the lens perfectly level, standing on the threshold so that a low brushed aluminium threshold strip runs across the bottom of frame where the 800 mm ivory interior porcelain tile stops and beige travertine-look porcelain deck tile begins, and the near tiled coping of a small plunge pool is just entering the bottom of frame. The roof terrace of a modest two-storey G+1 family villa in Mirdif, Dubai. Beige travertine-look porcelain deck tiles, a small rectangular plunge pool lined in light blue glass mosaic with simple tiled coping and one underwater light, faint slow ripples crossing the water and catching the low sun, soft caustic light moving on the pool walls. A rendered beige parapet wall about one metre high with flat coping running around the terrace, a simple beige fabric shade pergola on a slim galvanised steel frame, two plain grey sun loungers with white cushions, a low white side table, two terracotta pots of magenta bougainvillea and one frangipani, three white split air-conditioning condenser units and a small white water tank in the far corner. Beyond the low parapet, flat rooftops of beige neighbouring villas and date palm tops, fading into dust haze, pale hazy blue-white sky filling only a narrow band of frame. Late afternoon, low warm sun from the west behind the camera, long soft shadows raking across the deck tiles, the terrace only about a stop brighter than the shaded interior. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, consistent exposure, realistic documentary architectural photography, builder-standard finishes, plain render, matt porcelain, painted steel, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**IMAGE PROMPT — END FRAME (camera out on the deck)**

Wide shot standing out on a flat roof terrace a short way from an open sliding door, camera at chest height about 130 cm with the lens perfectly level, framing a small plunge pool from one corner so the water fills the lower half of frame and the pale sky takes only a narrow band at the top. The roof terrace of a modest two-storey G+1 family villa in Mirdif, Dubai. Beige travertine-look porcelain deck tiles, a small rectangular plunge pool lined in light blue glass mosaic with simple tiled coping and one underwater light, faint slow ripples crossing the surface and catching the low sun, soft caustic light moving on the pool walls. A rendered beige parapet wall about one metre high with flat coping, a simple beige fabric shade pergola on a slim galvanised steel frame, two plain grey sun loungers with white cushions, a low white side table, two terracotta pots of magenta bougainvillea and one frangipani, three white split air-conditioning condenser units and a small white water tank in the far corner. Beyond the low parapet, flat rooftops of beige neighbouring villas and date palm tops, fading into dust haze. Late afternoon, low warm sun from the west behind the camera, long soft shadows raking across the deck tiles, pale hazy blue-white sky. Shot on a 35 mm lens, deep focus, everything sharp, straight vertical walls, consistent exposure, realistic documentary architectural photography, builder-standard finishes, plain render, matt porcelain, painted steel, modest, lived-in, not luxury, unoccupied. Avoid: people, on-screen text, lens flare.

**VIDEO PROMPT**

Architectural film. Slow continuous push forward through the already fully open sliding doorway and a short way onto the roof terrace, crossing the low brushed aluminium threshold strip where the interior tile gives way to beige deck tile, chest height, lens level, constant speed. Roof terrace of a modest beige Mirdif villa: a small mosaic-lined plunge pool, faint slow ripples catching the low sun, soft caustic light moving on the pool walls, a shade pergola, two loungers, a low beige parapet. Low warm sun from the west behind the camera, exposure settling smoothly as the camera moves out into daylight. Standard wide lens, deep focus, unoccupied. Avoid: people, on-screen text, lens flare.

---

## 5. How to control what you don't want

There is no negative prompt in Flow, and an "Avoid:" header does not flip the polarity of the words after it. Every word you write is a requested word. So:

- **Name the cheap material, don't ban the expensive one.** "Plain painted plaster, matt porcelain, laminate, painted MDF" excludes marble and gold far more reliably than listing marble and gold ever could. Every prompt above does this.
- **Describe the thing you want in the place of the thing you fear.** Not "wardrobes with no mirrors" — "wardrobes with flush matt white doors". Not "a fridge with no logos" — "a plain white fridge, unbranded front". Explicit negation summons the noun.
- **Keep one short tail line and nothing more.** `Avoid: people, on-screen text, lens flare.` These three are high-frequency Veo failure modes and respond slightly to being named. A sixty-noun list does not work and eats roughly half your prompt's attention budget, which is why the camera move gets dropped.
- **Skip the anti-warp incantations.** "Fixed architecture, rigid walls, stable floor plan, rectilinear perspective, one unbroken take, no stop at the end" are inert, and cut-and-take vocabulary actually nudges the model toward inserting coverage. The one phrase worth keeping is **"continuous camera move, constant speed"**. Warping is suppressed mechanically, not verbally: shorter moves, 35 mm instead of 20 mm, a clean start frame, fewer specular and gridded surfaces.
- **If you truly need enforced negatives,** use the Gemini API / Vertex AI Veo endpoint, which exposes a real `negativePrompt` parameter that works moderately well. Flow does not have one.

---

## 6. Chaining instructions — making it look like one house

### Step A — make the stills first, anchored to one master

Generate **Shot 3's still first** and get it exactly right: wall colour, floor, ceiling cove, window frames, eyeline. That is your master.

For every other interior, **attach Shot 3's still to the request** and write:

> Same house as this image — same wall colour, same floor, same ceiling cove, same window frames, same camera height. Now show the kitchen: *(paste the Shot 4 image prompt)*

Attach the master every time. **Never rely on chat history, and never reference the previous image** — chat carry-over is weak and the look slides away from where you started.

Two more anchoring rules:
- For **Shot 2**, attach Shot 1's still and say "same villa as the centre house in this image" so the limestone panel, cornice band, palms and gate match.
- For **Shot 9**, generate both stills **from Shot 8's still** the same way, so the pool, deck tile, pergola and parapet are identical in the two shots that both show them. Generated independently, the pool changes shape at the cut.

Images do not cost Flow video credits, so re-roll freely. Reject any still where the floor tile, wall colour, ceiling cove or window frame colour has changed.

### Step B — trim first, then pull the last frame

Order matters. Extract the chain frame from the **trimmed** clip, not the raw one, or you will chain from a frame the viewer never sees.

```
# 1. trim clip08 first (see section 7 for the per-shot numbers)
ffmpeg -i clip08.mp4 -ss 2 -t 6 -an -r 24 -s 1280x720 \
  -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p t08.mp4

# 2. then take the final frame of the trimmed file
ffmpeg -sseof -0.1 -i t08.mp4 -update 1 -q:v 2 last08.png
```

Use exactly these flags. Do **not** add `-frames:v 1` — `-update 1` lets each frame in the final 0.1 s overwrite the last, so you land on the true final frame; `-frames:v 1` would hand you a frame two or three early, which is what makes chained clips jump.

### Step C — which joins to chain

**Chain nothing except 8 → 9.** A chain across a room change makes the model reconcile two different rooms, and it throws away the still you paid attention to.

| Join | What to do |
|---|---|
| 1 → 2 | Do not chain — use Shot 2's own still. |
| 2 → 3 | **Do not chain** — different height and lens, and the start frame would be a dark door rectangle with no interior information. Use Shot 3's own still. |
| 3 → 4 | Do not chain — use Shot 4's own still. |
| 4 → 4B → 5 | Do not chain — use each shot's own still. |
| 5 → 6 | **Do not chain** — use Shot 6's own still. |
| 6 → 7 | Do not chain — use Shot 7's own still. |
| 7 → 8 | Do not chain — use Shot 8's own still. |
| 8 → 9 | **Chain.** `last08.png` goes in "+ Add start frame" for Shot 9. This is the only join where the camera keeps moving through one space: the doorway is wide open and visible in the very first frame, the move is a straight line, and there is no rotation. |

**You get the feeling of continuity at the other cuts for free, by building it into the stills.** Shot 3's still holds the open front door and a bright sliver of driveway at the edge of frame, so cutting from Shot 2's door-filling frame to Shot 3's threshold frame reads as one continuous walk. Shot 4 ends looking back through the hall door at the foot of the stairs; Shot 5 opens with the top treads in the foreground. Shot 5 ends square-on in the open bedroom door; Shot 6 opens on that same axis. That is how real estate editors actually do it, it costs nothing, and it cannot melt.

Before you use any frame as a start frame, **look at it properly.** If it is dark, blurry, or the walls have gone crooked, re-roll the clip instead — those errors propagate into everything after it.

### Step D — the end-frame trick (most control, best results)

For Shot 9, and any shot that keeps failing, you can give Flow **both** ends of the move. But **never generate the second frame from text.**

Generate frame one. Then feed **that image** back to the image model as a reference and ask for a repositioned camera:

> Same room, same furniture, same light, same lens. Move the camera forward a short way, out through the open door onto the deck, so the pool fills the lower half of frame. Change nothing else.

Nano Banana handles this well — it is image editing, not image generation. Running the same text prompt twice gives you two **different rooms**, and handing Veo two different rooms is precisely how you get one warping into the other.

Then **flip between the two frames.** If any object sits in a different place relative to its neighbours, re-roll. Only use Frames end-frame mode when the two stills pass that flip test. And with both ends supplied, give no distances at all — the two frames define the travel. That is what Frames mode is for.

### Step E — with a start frame, cut the prompt down

**Cut the prompt to the camera sentence, the light sentence and the lens.** The model can already see the room; the words should only tell it how to move. Re-describing the layout in 300 different words creates a second, competing target that the model has to reconcile with the frame — and reconciling two descriptions of one room is exactly how walls bend. Long prompt plus start frame is measurably worse than short prompt plus start frame.

Every shot in this pack uses a start frame, which is why every video prompt above is already trimmed to that shape. Paste them as written. Full scene description belongs in the image prompt only.

### Step F — never chain more than four or five clips in a row

Quality falls apart after about the fifth link. This pack chains exactly one pair, so you are safe.

### Step G — do not use Extend, and do not use timestamp blocks

Extend costs a full generation and drifts. And never write `[00:00-00:02]` style timestamp blocks: that is a real Veo feature, but it manufactures cuts inside the clip, which is the opposite of what a walkthrough needs.

---

## 7. Stitching it in ffmpeg

**Trim first. Do not glue nine 8-second clips together.** Property videos hold each shot for 3–4 seconds; nine untrimmed clips is a 72-second film where every shot overstays. Keep the part where the camera is moving at constant speed and throw away the acceleration and the tail settle.

But trim the chained and matched joins **asymmetrically**: keep the outgoing clip's tail and the incoming clip's head. If you trim both symmetrically you delete the exact frames the continuity was built on, and the cut lands mid-move with a two-second spatial jump.

| Clip | Trim | Why |
|---|---|---|
| 1 | `-ss 1 -t 6` | Hero. Held longer, tail settle cut off. |
| 2 | `-ss 1.5 -t 6.5` | Keep the tail — it has to arrive at the open door. |
| 3 | `-ss 0 -t 5` | Keep the head — it has to start on the threshold. |
| 4 | `-ss 2 -t 3.5` | Symmetrical. |
| 4B | `-ss 2 -t 3` | Symmetrical. Optional clip. |
| 5 | `-ss 2.5 -t 5.5` | Keep the tail — it has to land on the open bedroom door. |
| 6 | `-ss 0 -t 4.5` | Keep the head — it starts on the bedroom axis. |
| 7 | `-ss 2 -t 3.5` | Symmetrical. |
| 8 | `-ss 2 -t 6` | Keep the tail — this is the chained match frame. |
| 9 | `-ss 0 -t 8` | Whole clip. It is the ending; let it breathe. |

**Never trim the tail of a clip that is chained into the next one, or the head of a clip that was generated from a chained start frame.**

Trim and normalise each clip the same way, substituting its own numbers, and strip the audio:

```
ffmpeg -i clip01.mp4 -ss 1 -t 6 -an -r 24 -s 1280x720 \
  -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p t01.mp4
```

Then a text file called `list.txt` (drop `t04b.mp4` if you did not shoot it):

```
file 't01.mp4'
file 't02.mp4'
file 't03.mp4'
file 't04.mp4'
file 't04b.mp4'
file 't05.mp4'
file 't06.mp4'
file 't07.mp4'
file 't08.mp4'
file 't09.mp4'
```

Join with plain hard cuts. **No crossfades, no wipes, no transition effects** — hard cuts are what property editors use for about ninety percent of joins.

```
ffmpeg -f concat -safe 0 -i list.txt -c copy walkthrough_mute.mp4
```

Finally lay one continuous music bed over the whole thing. Veo 3.1 generates audio natively, so nine clips means nine different soundtracks and nine audible jumps — the loudest giveaway of an AI video. You already stripped it with `-an`, so:

```
ffmpeg -i walkthrough_mute.mp4 -stream_loop -1 -i music.mp3 \
  -map 0:v -map 1:a -shortest -c:v copy -c:a aac -b:a 192k \
  -movflags +faststart walkthrough_final.mp4
```

`-stream_loop -1` must come **before** the `-i` it applies to, and the explicit `-map` pair matters: without them, a music file shorter than the cut silently truncates your video and you lose the ending.

Result: about 49 seconds, ten shots, one house, one piece of music. Cut Shot 7 and Shot 4B and it is about 42 seconds, which is still a complete film.

---

## 8. Credit plan

| Day | What to generate | Credits (Lite at 10 each) |
|---|---|---|
| 1 | Shot 3's still first as the master, then all other stills anchored to it (free; Shot 9 needs two). Then Shot 1 and Shot 9 with Veo 3.1 Fast — these two carry the film's identity and will need re-rolls | 40–60 |
| 2 | Shot 2, Shot 3, Shot 8 with Lite, plus re-rolls. Once Shot 8 is good, re-run Shot 9 chained from `last08.png` if you want the continuous exit | 50 |
| 3 | Shot 4, Shot 5, Shot 6 with Lite, plus re-rolls | 50 |
| 4 | Shot 7 and the optional staircase shot with Lite — skip if you are happy already | 20–40 |

Generate the two bookends on day one. On day one, run Shot 9 from its own start-frame still just to prove the look; the chained version comes after Shot 8 exists. If a middle room fails, the film still has its identity. If the front of the house or the pool fails, you have nothing.

---

## 9. If a shot comes out wrong

- **Walls bend, ceiling lines swim, the room stretches at the edges.** Three mechanical fixes, in order: shorten the move (ask for "a slow short push-in", not a long travel), drop the lens to 28 mm in the image prompt and regenerate the still, and cut the video prompt back to the camera sentence, the light sentence and the lens. If you re-described the room in the video box while also supplying a start frame, that is almost certainly the cause — the model is trying to reconcile two accounts of one room.
- **A person walks in, or the camera invents a drifting zoom.** The move you asked for was too small. Near-static is where Veo manufactures motion, and a figure entering frame is the most common unwanted addition in empty-room clips. Give it a real short push-in at constant speed, keep "unoccupied", and re-roll — do not try to fix it with more words.
- **The pool surface boils, crawls, or flattens to an opaque blue slab.** You asked for a mirror. Make sure the prompt says "faint slow ripples catching the low sun, soft caustic light moving on the pool walls" and nothing about still, glassy or mirrored water, and reframe the still so the sky reflection is a narrow band rather than a large flat plate. Moving water is also what makes the clip read as video rather than a panning still.
- **Shot 9 blows the terrace to flat white, or the brightness snaps like a cut.** That is the three-stop swing from shaded interior to Dubai daylight. Use a start frame that sits **on** the threshold with the terrace already only about a stop brighter, keep the move short, and make sure "exposure settling smoothly as the camera moves out into daylight" is in the prompt and "consistent exposure" is not. If it still fails after three re-rolls, cut at the threshold and open Shot 9 from its own terrace still — you lose the continuous exit and you keep the ending.
- **A cut jumps forward two seconds.** You trimmed a chained join symmetrically, or you extracted `last08.png` from the raw clip instead of the trimmed one. Re-trim using the section 7 table, re-extract from `t08.mp4`, and regenerate Shot 9.