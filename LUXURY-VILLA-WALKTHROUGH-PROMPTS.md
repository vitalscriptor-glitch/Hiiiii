# Luxury Villa Walkthrough — Prompt Pack (Palm Jumeirah)

One continuous flythrough of a contemporary beachfront villa on Palm Jumeirah, Dubai, at golden hour: in through the front door, through the hall and living room, and out over the infinity pool to the sea. **Four prompts:** three image prompts, plus one video prompt for the whole film.

It's written for Google Flow (Veo 3.1) and works in any video tool that takes reference images (Higgsfield, Kling, Runway).

---

## 1. How to use it

1. **Make Image 1 first, then attach it when you make Images 2 and 3.** Their prompts start with "Same villa as this image", which keeps all three pictures the same house. Re-roll any image where the stone, walls or pool don't match.
2. **Make the video from all three images.** In Flow, choose Video, then Ingredients. Add the three images as ingredients, paste the video prompt, and pick the longest clip length your tool offers (8 seconds in Flow). Make the images in the same aspect ratio as the video: 16:9 for YouTube and the website, 9:16 for Reels and TikTok.
3. **If the clip stops before it reaches the pool,** switch to Frames mode. Use Image 1 as the start frame, Image 3 as the end frame, and the same prompt. That makes the camera travel the whole path.

---

## 2. Image prompts

### Image 1 — Entrance *(make first)*

Chest height, lens level: travertine stepping stones across a dark reflecting pool to the tall open oak pivot door of a contemporary white and travertine villa on Palm Jumeirah, Dubai, under a deep cantilevered canopy, the double-height hall glowing warm inside. Bronze-framed glass, uplit date palms. Golden hour, facade in soft shade under a warm sky. 24 mm, deep focus, photoreal architectural photography, unoccupied. Avoid: people, on-screen text, lens flare.

### Image 2 — Hall and living room *(attach Image 1)*

Same villa as this image. Chest height, lens level, from just inside the front door: double-height hall with a honed travertine floor, white plaster walls, a floating travertine staircase on the left and blown-glass globe pendants. Straight ahead, the living room with cream bouclé sofas and sheer linen curtains, its glass wall slid fully open to the pool and turquoise lagoon. Golden-hour sun raking in from the left, lights on. 35 mm, deep focus, photoreal, quiet luxury, unoccupied. Avoid: people, on-screen text, lens flare.

### Image 3 — Infinity pool *(attach Image 1)*

Same villa as this image. Chest height, lens level, from the terrace just outside the open glass wall, looking down a long infinity pool whose edge merges with the turquoise lagoon at the horizon. Honed travertine deck, pale green stone lining, glowing turquoise water, cream loungers and a white parasol on the left. Golden hour, sun out of frame left, sky in the top third only. 24 mm, deep focus, photoreal, unoccupied. Avoid: people, on-screen text, lens flare.

---

## 3. Video prompt — the whole film

Single continuous camera move, constant speed, chest height, lens level, through a luxury villa on Palm Jumeirah, Dubai, at golden hour. Start on the stepping stones over the reflecting pool, glide straight through the open oak pivot door into the double-height hall, past the floating staircase and globe pendants, through the living room past the sofas and softly stirring curtains, out through the open glass wall, and finish gliding along the infinity pool toward its edge as it merges with the turquoise lagoon. Faint ripples on the water, warm low sun from the left. Wide lens, deep focus, photoreal. Audio: soft piano and gentle waves. Avoid: people, on-screen text, lens flare.

The camera travels in one straight line from the front door to the sea, and every doorway on the way is already open. That's what lets a single move cover the whole house without passing through a wall.

---

## 4. If it comes out wrong

- **Walls bend or the rooms melt into each other.** The path is too long for the clip. Start the camera inside the house instead: replace "Start on the stepping stones over the reflecting pool, glide straight through the open oak pivot door into the double-height hall" with "Start just inside the open front door in the double-height hall, glide straight ahead".
- **The clip cuts to a new angle partway through.** Re-roll it. Don't add "no cuts", because naming cuts tends to produce them.
- **A person walks in.** Re-roll it, and keep the `Avoid:` line as written.
- **The pool turns into a flat blue slab.** Keep "faint ripples", never "still" or "glassy".
- **You'd rather use your own music.** Save the clip as `villa.mp4` and the track as `music.mp3`, then run this command. It replaces Veo's audio and fades the music out over the last two seconds:

  ```bash
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 villa.mp4)
  ffmpeg -i villa.mp4 -stream_loop -1 -i music.mp3 -map 0:v -map 1:a -shortest \
    -af "afade=t=out:st=$(echo "$D - 2" | bc -l):d=2" \
    -c:v copy -c:a aac -b:a 192k -movflags +faststart villa_music.mp4
  ```
