# Luxury Villa Walkthrough — Prompt Pack (Palm Jumeirah)

Five shots of a contemporary beachfront villa on Palm Jumeirah, Dubai, at golden hour: the villa from the air, then the entrance hall, living room, master suite and infinity pool. That's **six prompts**: one image prompt per shot, plus one video prompt you reuse for every clip. About 28 seconds once trimmed.

It's written for Google Flow (Veo 3.1) and works the same way in any image-to-video tool (Higgsfield, Kling, Runway). The workflow is the same as `DUBAI-WALKTHROUGH-PROMPTS.md`, whose sections 5–9 explain why these rules work.

---

## 1. How to use it

1. **Make the five stills first.** Start with Shots 1 and 2, the two masters. For Shots 3 and 4, attach Shot 2's still. For Shot 5, attach Shot 1's still. Those prompts start with "Same villa as this image", which is what keeps the house consistent. Reject any still where the floor, walls or pool have changed. Stills are cheap, so re-roll them freely.
2. **Then animate every still with the same video prompt.** Drop the still in as the start frame (Flow: Video → Frames → "+ Add start frame") and paste the video prompt. Every clip is a slow push-in, so the five clips read as one walk through the house. Never paste an image prompt into the video box.
3. **Use 8-second clips and one aspect ratio throughout.** Pick 16:9 for YouTube and the website, or 9:16 for Reels and TikTok (your Emirat tour was 9:16).

---

## 2. Image prompts

### Shot 1 — Aerial over the lagoon *(exterior master)*

Aerial view from above a calm turquoise lagoon of a contemporary white and travertine beachfront villa on Palm Jumeirah, Dubai: flat cantilevered roofs, floor-to-ceiling glass, long infinity pool, white sand beach, date palms, city towers hazy behind. Golden hour, sun behind the camera. 24 mm, deep focus, photoreal architectural photography, unoccupied. Avoid: people, on-screen text, lens flare.

### Shot 2 — Entrance hall *(interior master)*

Chest height, lens level, from just inside the front door: double-height entrance hall of a luxury Palm Jumeirah villa. Honed travertine floor, white plaster walls, floating travertine staircase on the left, blown-glass globe pendants, travertine console. Straight ahead, the living room opens fully to the pool and turquoise lagoon. Golden-hour sun raking in from the left, lights on. 35 mm, deep focus, straight verticals, photoreal, quiet luxury, unoccupied. Avoid: people, on-screen text, lens flare.

### Shot 3 — Living room *(attach Shot 2's still)*

Same villa as this image. Chest height, lens level: living room with a glass wall slid fully open to the travertine terrace, infinity pool and lagoon. Cream bouclé sofas, travertine coffee table, oak lounge chairs, sheer linen curtains. Golden-hour sun from the left, lights on. 35 mm, deep focus, photoreal, unoccupied. Avoid: people, on-screen text, lens flare.

### Shot 4 — Master suite *(attach Shot 2's still)*

Same villa as this image. Chest height, lens level, from the doorway: master bedroom facing a glass wall slid open to a balcony over the pool and lagoon. Low bed in white linen against a fluted oak wall on the right, alabaster lamps on, bouclé chairs, sheer linen curtains. Golden-hour sun from the left. 35 mm, deep focus, photoreal, unoccupied. Avoid: people, on-screen text, lens flare.

### Shot 5 — Infinity pool *(attach Shot 1's still)*

Same villa as this image. Low camera just above the travertine deck, lens level, looking down a long infinity pool whose edge meets the turquoise lagoon at the horizon. Pale green stone lining, glowing turquoise water, cream loungers and a white parasol on the left. Golden hour, sun out of frame left, sky in the top third only. 24 mm, deep focus, photoreal, unoccupied. Avoid: people, on-screen text, lens flare.

---

## 3. Video prompt — use it for all five clips

Slow continuous push-in toward the centre of the frame, constant speed, camera height and angle held. Faint slow ripples on the water. Golden-hour light. Wide lens, deep focus. Avoid: people, on-screen text, lens flare.

One prompt works for every shot because the start frame already shows the room, each still puts the view at the centre of the frame, and every shot has water in it.

---

## 4. Trim and stitch

Veo eases into and out of every move, so keep the middle six seconds of each clip. Save the downloaded clips as `raw/01.mp4` … `raw/05.mp4`, then run this from the repository root:

```bash
mkdir -p walk
for i in 01 02 03 04 05; do
  ffmpeg -y -i "raw/$i.mp4" -ss 1 -t 6 -an -c:v libx264 -crf 18 -pix_fmt yuv420p "walk/$i.mp4"
done
./tools/stitch-walkthrough.sh walk film_mute.mp4   # soft 0.4 s dissolves; add 0 at the end for hard cuts
```

**For 9:16,** change line 16 of `tools/stitch-walkthrough.sh` from `W=1920; H=1080` to `W=1080; H=1920`. Otherwise vertical clips get black bars at the sides.

Last, lay one continuous music bed under the film, with a fade to black and a music fade-out at the end. Strip Veo's own audio, because five clips would give you five different soundtracks:

```bash
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 film_mute.mp4)
ffmpeg -i film_mute.mp4 -stream_loop -1 -i music.mp3 -map 0:v -map 1:a -shortest \
  -vf "fade=t=out:st=$(echo "$D - 1.5" | bc -l):d=1.5" \
  -af "afade=t=out:st=$(echo "$D - 3" | bc -l):d=3" \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart film.mp4
```

The result is about 28 seconds. For music, slow piano or ambient strings suit this film.

---

## 5. If a shot comes out wrong

- **Walls bend or the floor swims.** Change "Slow continuous push-in" to "Slow short push-in" in the video prompt for that clip. In the image prompt, keep the stone "honed", never "polished".
- **The pendants shimmer, multiply or melt.** In Shot 2's image prompt, ask for "three large blown-glass globe pendants" instead.
- **Glass walls ghost or fill with reflections.** Make sure the still shows them slid fully open.
- **The pool turns into a flat blue slab.** Keep "faint slow ripples", never "still" or "glassy", and keep the sky to a narrow band of the frame.
- **A person walks in.** Re-roll. Near-static clips are where Veo invents motion, so the push-in has to be a real move.
- **Anything else:** see section 9 of `DUBAI-WALKTHROUGH-PROMPTS.md`.
