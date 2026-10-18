#!/usr/bin/env bash
# Stitch AI-generated walkthrough clips into one film.
#
#   ./tools/stitch-walkthrough.sh <clips-dir> [out.mp4] [fade-seconds]
#
# Clips are joined in filename order, so name them 01-front.mp4, 02-door.mp4 ...
# Everything is normalised to a common size, frame rate and pixel format first,
# because clips straight out of different generations rarely agree on all three
# and concat fails silently or judders when they do not.

set -euo pipefail

DIR="${1:?usage: stitch-walkthrough.sh <clips-dir> [out.mp4] [fade-seconds]}"
OUT="${2:-walkthrough.mp4}"
FADE="${3:-0.4}"          # crossfade between shots; 0 gives hard cuts
W=1920; H=1080; FPS=30

command -v ffmpeg >/dev/null || { echo "ffmpeg not found"; exit 1; }

mapfile -t CLIPS < <(find "$DIR" -maxdepth 1 -type f \
  \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' -o -iname '*.m4v' \) | sort)

[ "${#CLIPS[@]}" -gt 0 ] || { echo "no clips found in $DIR"; exit 1; }
echo "found ${#CLIPS[@]} clips:"
printf '  %s\n' "${CLIPS[@]}"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# --- normalise every clip ----------------------------------------------------
# scale to fit, pad to exact size, force frame rate, strip audio.
i=0
for c in "${CLIPS[@]}"; do
  printf 'normalising %s\n' "$(basename "$c")"
  ffmpeg -hide_banner -loglevel error -y -i "$c" \
    -vf "scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black,fps=${FPS},format=yuv420p,setsar=1" \
    -c:v libx264 -preset medium -crf 18 -an \
    "$WORK/$(printf '%03d' "$i").mp4"
  i=$((i+1))
done

# --- join --------------------------------------------------------------------
if [ "$(echo "$FADE > 0" | bc -l)" -eq 1 ] && [ "${#CLIPS[@]}" -gt 1 ]; then
  # xfade needs an offset per join: running total minus the fades so far.
  inputs=(); filter=""; prev="0:v"; offset=0
  for f in "$WORK"/*.mp4; do inputs+=(-i "$f"); done

  n=0
  for f in "$WORK"/*.mp4; do
    d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
    if [ "$n" -eq 0 ]; then
      offset=$(echo "$d - $FADE" | bc -l)
    else
      label="x$n"
      filter+="[$prev][$n:v]xfade=transition=fade:duration=$FADE:offset=$offset[$label];"
      prev="$label"
      offset=$(echo "$offset + $d - $FADE" | bc -l)
    fi
    n=$((n+1))
  done
  filter="${filter%;}"
  echo "joining with ${FADE}s crossfades"
  ffmpeg -hide_banner -loglevel error -y "${inputs[@]}" \
    -filter_complex "$filter" -map "[$prev]" \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart -an "$OUT"
else
  echo "joining with hard cuts"
  : > "$WORK/list.txt"
  for f in "$WORK"/*.mp4; do echo "file '$f'" >> "$WORK/list.txt"; done
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$WORK/list.txt" \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart -an "$OUT"
fi

echo
echo "wrote $OUT"
ffprobe -hide_banner -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
echo
echo "To use it as a scroll-scrubbed hero, re-encode it keyframe-dense:"
echo "  ffmpeg -i $OUT -c:v libx264 -preset slow -crf 25 -g 1 -keyint_min 1 \\"
echo "    -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an site/media/hero.mp4"
