# component-rebuilds

The sourced components from my portfolio ([natmoges.com](https://natmoges.com)), rebuilt from scratch in React + TypeScript (Next.js), one layer at a time. Each build has its own page.

## The method

I come from music production, motion design and home automation, so I build the way producers sample: take the finished record apart, keep what matters, credit the source, make it mine.

1. **Read the reference** to understand how it works.
2. **Write the paragraph first:** what the build does at each moment in time (before load, on the interaction, during, at the end, and on failure).
3. **Build it in small steps, one commit each.** The paragraph stays above the code as a comment.
4. **Explain it out loud** without looking at the code before it counts as done.

Each rung is a layer. Each build reuses what the last one taught and adds one new idea.

## The ladder

| # | Build | Reference (credited) | Rung |
|---|---|---|---|
| 01 | [vinyl](https://vinyl-swart.vercel.app) (own repo: [natmoges/vinyl](https://github.com/natmoges/vinyl)) | DiscPlayer by Ahmad (@ohitshmad) | 1 · Single components |
| 02 | [TextScrambler](https://component-rebuilds.vercel.app/textscrambler) | TextScrambler by Solt Wagner (@solt), Frameblox / Framer Marketplace | 1 |
| 03 | [Back2Top](https://component-rebuilds.vercel.app/back2top) | BackToTop by The Velox Studio, Framer Marketplace | 1 |
| 04 | [AnimatedFolder](https://component-rebuilds.vercel.app/animatedfolder) | AnimatedFolder by Launchly, Framer Marketplace (listing no longer available) | 2 · Composition + data |
| 05 | Motion Tiles | Uzair J. | 2 |
| 06 | Live Location | Amr Rashed | 2 |
| 07 | The Ladder | My own (no reference) | 2 |
| 08 | Smooth Scroll | Framer University | 3 · Page-level behaviour |
| 09 | TrailCursor | Akın Gündoğan | 3 |
| 10 | LogoPreloader | Sukoya Design | 3 |
| 11 | StarCloud | Sabo Sugi (v1) | 4 · Drawing the pixels |
| 12 | Gravity | Framer University | 4 |
| 13 | Retro Screen Effect (optional) | Blue Jackson | 4 |
| 14 | The Orbit | Replaces a Spline embed on my site | 5 · 3D / WebGL |

## Build notes

### 02 · TextScrambler

**Reference:** TextScrambler by Solt Wagner (@solt), Frameblox / Framer Marketplace. Read for behaviour only; none of its code is here.

**Reused, with credit:** the left-to-right reveal, replay when it scrolls back into view, the flicker-rate formula (`1000 / (rate × 20)` ms), and my own footer's settings (1300 ms, rate 0.3).

**Net-new in mine:**
- **The speed knob works.** In the reference, the scramble re-rolls every frame no matter what speed is set to. Here `flickerRate` really controls it, and 0 freezes the noise.
- **Two layers instead of one span per letter:** the locked signal, then the noise tail. Nothing is rebuilt per character.
- **The line never moves.** The noise is set in a fixed-width font, and an invisible copy of the final word sizes the box, so the reveal can't shift the layout.
- **Accessibility:** screen readers get the real word once, and the noise is hidden from them. Reduced motion shows the stable word with no flicker and no sheen.
- **Edges written down first:** empty text renders nothing, a duration of 0 shows the stable word, and text is split by real characters, so emoji and other scripts don't break.
- **The signal is lit like my vinyl's meter:** a steady glow with a sheen sweeping across.
- Visibility uses the browser's `IntersectionObserver` directly, not a motion library.

### 03 · Back2Top

**Reference:** BackToTop by The Velox Studio, Framer Marketplace. Read for behaviour only; none of its code is here. The rocket is Lucide's `rocket` icon (ISC licence), via `lucide-react`, turned to point straight up.

**Reused, with credit:** the 25% threshold, the easeInOutCubic ride curve, the 3000 ms cap, the breathing pulse (1.06 over 1.6 s), the 0.18 s transitions, the blue focus ring, and my own site's settings (54 px, bottom-right, 24 / 24).

**Net-new in mine:**
- **The ride follows the page.** The reference's "Scroll Speed" is really a fixed duration. Here the ride moves at a speed (`rideUpPxPerSec`) with a cap (`maxRideMs`), so a longer page is a longer ride.
- **Two redraws per trip, not sixty a second.** The reference stores scroll progress as a number every frame. Mine stores one yes/no: past the threshold or not.
- **Truly gone.** Below the threshold the button is removed, not faded, so Tab can't land on an invisible button and the click ring can't get stuck on (a bug visible on my Framer site).
- **Your scroll wins.** Wheel, touch or keys break the ride instantly, and you take over from where you are.
- **Exhaust.** On click, a fill grows from the rocket's flame for the length of the ride, driven by the same curve that moves the page.
- **Hover only on real mice,** so nothing sticks on iPhone, and the click ring shows in Safari too.
- **Reduced motion:** no breathing, an instant jump, no exhaust. Function over form.
- **Colour knobs:** ring, hover and exhaust colour, and exhaust on/off, are props. The default is Signal green, inside the site's palette.
- **The ladder reusing itself:** the transmission at the top of the page is my TextScrambler (build 02).

### 04 · AnimatedFolder

**Reference:** AnimatedFolder by Launchly, Framer Marketplace (the listing is no longer available). Read for behaviour only; none of its code is here. Icons are Lucide (ISC licence), via `lucide-react`. The demo images were generated for this page with an image model.

**Reused, with credit:** the folder layers and their tilt (back −15°, tab −25°, front +25°, hinged at the bottom), the overshoot easing `cubic-bezier(0.34, 1.56, 0.64, 1)`, the fan's lift, tilt and 80 ms stagger, the 80 × 112 card size, and the viewer's open and slide curves.

**Changed from the reference:**
- The demo page uses one component three times, once per case study, each with its own list of projects. In Framer I made two copies of the component to get three folders.
- The folder takes 1 to 6 cards. The spread and tilt are calculated from the number of cards. The reference has three fixed positions. Passing more than 6 shows the first 6 and logs a warning in the console.
- The viewer is rendered through a portal to the page body. On my Framer site it opens inside the card instead of over the page, because a parent element has `will-change: transform`.
- Moving between images slides. In the reference, two effects set the same value at the same time, so the images cut instead.
- The count, the fan and the viewer all read the same list. One card reads "1 project".
- Colours and border widths are in one `theme` prop (21 values), with my site's colours as defaults. The hover glow and the viewer colours are included; the reference hard-codes them.
- Images fill a fixed 16:9 box, so the viewer keeps the same size for every image. A broken image shows a plain tile.
- While the viewer is open, a Signal green line runs around its border, styled after my vinyl's progress bar. `hasBorderChase={false}` turns it off.
- After the viewer closes, the folder stays closed until the pointer leaves and comes back.
- The cards are buttons. Keyboard focus opens the folder. The viewer is a labelled dialog that keeps focus inside while open and returns it on close.
- On touch screens, a tap opens the folder, a tap outside closes it, the prompt reads "Tap to explore", and the arrows sit at the bottom of the screen.
- With reduced motion on, there is no bounce, zoom, slide or border line. Cards fade in and the folder still tilts open.
- The open animation measures the clicked card, so each card has its own ref. Using many refs is planned as build 05's new idea; it appears here first.

## Credits

Every reference is a component from the Framer Marketplace, credited above by its author. **None of their code is in this repo.** Each build is written from scratch; where I reuse a value (an easing curve, a timing), I say so in that build's notes.

**Co-pilot:** Claude (Anthropic) worked alongside me: explaining code, translating it into my own terms, and writing code from my paragraphs. I write the paragraphs, make the design calls, and type, debug and tune every build.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.