# Affu Creator Studio (concept demo)

A sales demo of a creator media-kit and brand-booking site for
@affu_content_creator. One file, `index.html`: plain HTML, CSS and JavaScript,
no build step. The only outside request is Google Fonts.

Open `index.html` in a browser, or run `npx http-server creator -p 8200`.

## What is real and what is a placeholder

| Item | Status |
| --- | --- |
| Name, handle, Instagram links | Real |
| "74 posts created" | Real, from the profile on 1 Nov 2026 |
| Engagement, avg Reel views, paid collabs (marked SAMPLE) | Placeholder |
| Work tiles and their numbers | Placeholder, no real brands named |
| Rate card prices | Placeholder |
| Results report | Placeholder |
| Booking form | Works as page UI; nothing is sent |

The notice bar at the top and the footer both say it is a concept. Remove them
once every placeholder is replaced with Affu's real numbers, Reels and prices.

## What moves

- Hero: three Reel mock-ups in a 3D stack that follows the pointer, sways on
  phones, and fans out as you scroll, inside a slowly turning ring light.
- Floating hearts behind the hero, like a live stream.
- Stories-style progress bar in the nav, one segment per section.
- Launch-tape marquee of categories, tilt on the work tiles, counters on the
  stats, and the collab timeline drawing itself as you scroll.
- Everything stops under `prefers-reduced-motion`.

## Before it goes live for real

- Swap the work tiles for real Reel covers, each linking to the Reel.
- Wire the form to WhatsApp or a form service (Formspree, Basin) so requests
  actually arrive. Today it shows a success screen that says nothing was sent.
- Add a WhatsApp button with Affu's real number.
