# Animesh & Dakshita — Wedding Invitation

A responsive, illustrated wedding invitation based on the Jain family's printed invitation cards. Built with plain HTML, CSS, and JavaScript, with no build step or runtime dependencies.

## Run locally

```sh
python -m http.server 3000 --bind 0.0.0.0
```

Open `http://localhost:3000`. The same files can be hosted on GitHub Pages or any static web host; no API keys, environment variables, or backend are needed.

## Cinematic scroll experience

The page opens on a full-screen pair of illustrated burgundy-and-gold mandap gates. **Scroll down** to swing the gates open in 3D and reveal Animesh & Dakshita inside a flower-draped mandap. Scrolling back reverses the opening.

- A sticky opening scene uses native page scrolling, not wheel/touch interception or a scroll library.
- Separate landscape and portrait mandap artwork and door designs keep the scene composed on desktops and phones.
- Layered garden zoom, foreground foliage, falling petals, and the name reveal move at different speeds.
- The invitation follows with staggered typography, ceremony-card entrances, venue reveals, gently moving artwork, and a reading-progress line.
- **Skip intro** jumps directly to the invitation and moves keyboard focus to the invitation heading.
- **Motion on / off** lets guests disable the effects without losing their place in later sections; the choice lasts for the browser session.
- A system `prefers-reduced-motion` setting takes priority: gates stay open, pinning is removed, and all content remains visible. Live preference changes are supported. Without JavaScript, the mandap also remains open.
- A single on-demand `requestAnimationFrame` updates scroll transforms. Section reveals use `IntersectionObserver`, and intro petals pause when the scene is offscreen.

## Design and interactions

- Warm ivory, burgundy, and antique-gold styling, with desktop and mobile layouts.
- Custom AI-generated wedding illustration, optimized as WebP; original inline SVG ceremony illustrations. Artwork is decorative, not a photograph of the couple or the actual venues.
- Animated petals, gently moving ceremony artwork, subtle sparkles, and scroll reveals. `prefers-reduced-motion` disables nonessential animation.
- Locally hosted Cormorant Garamond, Manrope, and Noto Serif Devanagari fonts. Licenses are included in `assets/fonts/`.
- Keyboard-accessible day tabs, mobile navigation, visible focus states, and a native calendar dialog.
- Countdown to **20 November 2026, 00:00 India Standard Time**, independent of the visitor's timezone. It updates its message when the wedding day arrives and after it ends.
- Google Calendar link for the two-day celebration and an Apple/Outlook-compatible `.ics` download containing all eight timed programme items. Calendar times are stored in UTC so calendar apps display them correctly in the viewer's timezone.
- Google Maps search links for both venues and the family residence.
- Music attempts to start on the first scroll, touch swipe, or keyboard scroll using the existing `music/din-shagna-da.mp3`. Browsers that block audible playback on scrolling show a ‘Tap for music’ hint and retry on the next tap/click or scroll key. Guests can pause or resume using the music button; later scrolling never overrides a manual pause. Confirm rights to the supplied recording before public distribution.
- Native sharing with clipboard and manual-copy fallbacks.

## Programme

All printed times are **India Standard Time (UTC+05:30)**.

### Thursday, 19 November 2026

| Event          | Time             |
| -------------- | ---------------- |
| Haldi          | 10:30 AM onwards |
| Chak           | 2:00 PM          |
| Ladies Sangeet | 4:00 PM          |
| Dinner         | 6:30 PM          |
| Bhaat          | 8:00 PM          |

**The Royal Dreams Banquet**

A-1/23, Opp. Dashrath Puri Metro Station, Gate No. 1, Dwarka Sector-1A, Dabri Palam Road, New Delhi-110045.

### Friday, 20 November 2026

| Event                             | Time    | Location         |
| --------------------------------- | ------- | ---------------- |
| Ghurchari                         | 5:00 PM | Family residence |
| Departure of Baraat               | 6:30 PM | Family residence |
| Baraat re-assembly near the venue | 7:30 PM | Wisteria         |

**Family residence:** A-82, Dashrath Puri, New Delhi-110045.

**Wedding venue:** Wisteria, DDA Sports Complex, Gate No. 3, Sector-11, Dwarka, New Delhi-110075.

The invitation does not specify a separate wedding ceremony time or event end times; none have been invented. The calendar entries record the printed start times. The RSVP section is omitted; the family welcome and grandparents’ best compliments remain.

## Files and editing

```text
index.html          Invitation, family details, SVG artwork, event and venue markup
styles.css          Responsive styling, typography, and animations
app.js              Countdown, calendar data, navigation, tabs, sharing, and music
motion.css          Mandap, 3D gates, scene layers, reveals, motion controls
motion.js           Scroll choreography, parallax, reveal observers, motion preferences
assets/
  wedding-portrait.webp
  mandap-garden.webp
  mandap-garden-mobile.webp
  mandap-door.svg
  mandap-door-mobile.svg
  favicon.svg
  fonts/            Self-hosted fonts and licenses
music/
  din-shagna-da.mp3  Existing audio asset
```

If an event changes, update both its visible details in `index.html` and the `programme` / `googleDetails` calendar data in `app.js`. Map links use the full printed address rather than unverified coordinates. The share button uses the current page URL, so after deployment it shares the production invitation automatically.

## Verification

Checked in headless Chromium at viewport widths **320, 360, 390, 760, 768, 1024, and 1440 pixels**, with no horizontal overflow. Verified mobile menu, keyboard tab switching, dialog dismissal, music play/pause, calendar download with eight entries and RFC-compliant line folding, reduced-motion behavior, image/font loading, and the post-wedding countdown. Automated axe WCAG 2 A/AA and WCAG 2.1 AA checks passed on the default rendered page. External Maps and Google Calendar links require internet access.

### Cinematic regression checks

Verified gate transforms at closed, partially open, and fully open scroll positions; reversing the scroll; keyboard focus after skipping; preservation of reading position when motion is toggled; live reduced-motion changes; seven responsive widths; 320×568 portrait and 844×390 landscape layouts; and the no-JavaScript open-gate fallback. Automated axe WCAG A/AA checks passed for the closed/open intro, both programme tabs, and the calendar dialog. Existing calendar, navigation, sharing UI, countdown, and audio behavior remain in place.
