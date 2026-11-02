# component-rebuilds

The sourced components from my portfolio ([natmoges.com](https://natmoges.com)), rebuilt from scratch in React + TypeScript (Next.js), one layer at a time. Each build has its own page. The home page is build 07, Accretion, given its weight by build 08, SmoothScroll, with build 09, TrailCursor, trailing the mouse through its space; build 10, LogoPreloader, opens every first visit to any page. The index it replaced is kept at [/before](https://component-rebuilds.vercel.app/before).

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
| 05 | [Motion Tiles](https://component-rebuilds.vercel.app/motiontiles) | Motion Tiles by Uzair J., Framer Marketplace | 2 |
| 06 | [SignalLocation](https://component-rebuilds.vercel.app/signallocation) | Live Location by Amr Rashed, Framer Marketplace | 2 |
| 07 | [Accretion](https://component-rebuilds.vercel.app) | None. My own | 2 |
| 08 | [SmoothScroll](https://component-rebuilds.vercel.app) (on Accretion's page) | Smooth Scroll by Nandi Muzsik and Clément Roche, Framer University; built on Lenis by darkroom.engineering | 3 · Page-level behaviour |
| 09 | [TrailCursor](https://component-rebuilds.vercel.app) (on Accretion's page) | Cursor Trail Text by Akın Gündoğan (@akn-gundogan), Framer Marketplace | 3 |
| 10 | [LogoPreloader](https://component-rebuilds.vercel.app) (on every page) | Logo Preloader by Brett Jackson (@brett-jackson), Sukoya Design, Framer Marketplace | 3 |
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

### 05 · Motion Tiles

**Reference:** Motion Tiles by Uzair J., Framer Marketplace (free). It's a design component, not a code component: 15 variants wired with hover and tap interactions, with no code to read. I read the compiled output of my own Framer site for its numbers and behaviour; none of it is here. The close icon is Lucide's `x` (ISC licence), via `lucide-react`.

**Reused, with credit:** the stage tilt (`perspective(5000px) rotateX(-30deg) rotateY(40deg)`), the 100 px depth step between tiles, the 30 px sink on the selected tile, the spring (bounce 0.2 over 0.4 s, approximated as a curve), the 310 × 210 tile, the latch (no mouse-leave), and the tag colours (#616161 inactive, primary when lit).

**Net-new in mine:**
- **Seven refs focus playback.** In the reference, all seven videos play the whole time. Here all seven play until you engage. After that only the selected tile plays, and the other six pause where they are, so one video decodes instead of seven. Opening a tile pauses the whole stack.
- **One rule for the stack.** The depth and spread come from each tile's position in the data, centred on the middle tile. The reference's horizontal steps are uneven (50, 50, 7.5, 7.5, 50, 50), and its own listing describes cursor-driven parallax, which it doesn't have (it's seven hover states).
- **The stack breathes until you engage.** A staggered accordion drift settles smoothly when your pointer enters the stage (or it scrolls into view on a phone), and the title and chapter words fade in on a glass panel.
- **Expand to inspect.** Click the selected tile (second tap on a phone) and it glides from its place in the stack to the centre. Underneath is the photo's camera line, read from the original files' EXIF, or the story for GENESIS and SYNTHESIS. ✕, a click outside or Escape glides it back.
- **Keyboard, phones and fallbacks.** Every tile is a button. Tab moves the selection, Enter opens, and focus comes back on close. On a phone the first tap selects and the second opens. The stack scales down on narrow screens. A video that fails to load becomes a glass placeholder in the same slot. Reduced motion removes the breathing, the sink and the glide, and keeps a thin outline on the selected tile.
- **Bug I hit and fixed:** in 3D, the stack's own invisible box sits at depth 0 like a pane of glass, so every tile behind it was unreachable. ACTION was blocked completely. `pointer-events: none` on the stack and `auto` on the tiles fixed it.

**The media is mine, rebuilt for this page.** The five middle tiles are my 2019–2022 photographs, cropped to 3:2 and animated with depth parallax. I made 02–04 in Parallax Studio (Depth Anything V2). 05 and 06 were rendered in code by my co-pilot from my photos, with depth calculated from the image. GENESIS shows my 2022 site, `shotbynat`, as it was. SYNTHESIS resolves the five photos into NatFTP. Both bookends were rendered in code by my co-pilot from my direction, reusing the glyph set from my TextScrambler (build 02).

### 06 · SignalLocation

**Reference:** Live Location by Amr Rashed, Framer Marketplace. Read for behaviour only; none of its code is here. The rocket is Lucide's `rocket` icon (ISC licence), via `lucide-react`.

**Reused, with credit:** the dot-plus-ring pulse, the first beat of the settle (scale 1 to 2.8, opacity peaking at 0.35 a quarter of the way in), the "Somewhere in the world" fallback, and the city, country order.

**Net-new in mine:**
- **No third-party lookup.** The reference asks an outside IP service, which ad blockers can stop. Mine asks a small route on my own domain (`/api/location`) that reads the location Vercel already attaches to each request. Blockers have nothing third-party to block, there's no rate limit, and no outside company sees a visitor's IP. This is a few lines of server code, which is build 07's new idea arriving one build early.
- **Nothing saved, asked fresh every visit.** The reference keeps a visitor's location for 24 hours, which contradicted my site's own caption ("in real time"). Hotspots, VPNs and travel make a remembered location wrong, so mine asks on every load, and the route tells the network never to cache the answer.
- **Five states instead of four:** hunting, locked (city and country), partial (country only: it settles but keeps breathing), adrift (no place: the dot vibrates, bursts and becomes a rocket) and lost (the request broke: the dot bleeds to red, "Signal unrecoverable"). Only a real failure turns red.
- **One tempo.** Everything runs on a one-second bar of eight ticks: the pulse, the scramble's reveal, its noise and every delay. The pulse's CSS clock is restarted the moment the page wakes up, and the lock waits for the next bar line, so the motion and the words never drift apart.
- **The first paint isn't blank.** The reference draws nothing until its script runs. Mine starts hunting from the first frame.
- **The ladder reusing itself:** every readout scrambles in with my TextScrambler (build 02), which gained an optional `className` so it can sit at body size.
- **Fixed from the reference:** its "Auto" language setting never translated the loading or error text, so I removed language support rather than ship a setting that doesn't work. Turning it off showed the fallback instead of hiding it. Its screen-reader settings switched announcements off at the moment the location arrived. Leaving the page didn't cancel the request.
- **Reduced motion:** the dot stays, the ring is gone, and the rocket simply appears.
- **The honest limit:** any location from an IP address is the network's location. A VPN, iCloud Private Relay or a phone hotspot shows where that network exits, not where the visitor is. On localhost there's no location at all, so it shows "Somewhere in the world".

### 07 · Accretion

**Reference:** none. The first build with nothing to copy. It started as "The Ladder", an index of the builds, and grew into the whole record: from the early years to this page. The paragraph above the code is mine, edited with Claude (Anthropic), which was used as co-pilot.

**What it is:** a satellite in deep space. Scrolling is travel through a meteor field. Each object is held in the crosshair and decoded on a green HUD. If the record can prove it, it's kept: its real artifact develops on the HUD, a tap dissolves it into the text, and it accretes into a body that grows beside the crosshair. If the record can't prove it yet, it's debris and falls away, showing what would lock it.

**Net-new in mine:**
- **It reads my record live.** The page is a server component that queries my Notion database on the server (`revalidate: 60`), so an edit in Notion shows up on the page within a minute. The key never reaches the browser. If Notion can't be reached, it reads a stored copy (`data/accretion.json`) and the end of the record says which one it read from.
- **The record decides, not the animation.** Kept or debris is a field in the database. Nothing is promoted because it looks good scrolling past. Claims I can't make yet (React/TypeScript proficiency, a deployed multi-agent system) sit in the debris with their lock conditions.
- **The scan is a hold test.** Every frame it checks whether an object's centre is within 6 px of the scan line. Objects ride the beam (`position: sticky`) while held. Decisions are remembered, so scrolling back doesn't re-scan.
- **One tempo,** carried over from SignalLocation (build 06): a 1000 ms bar. The satellite arrives on the first bar, and a decode lasts two.
- **Bounded parallax.** The drifting matter moves at its own depth but stays inside its slot, so the page ends where the record ends.
- **The seam is kept.** The old index lives at `/before`: a plain, static page beside the meteor-shower record.
- **The ladder reusing itself:** every HUD title decodes with my TextScrambler (build 02).
- **Reduced motion:** no travel, no scan. The whole record as a plain list, with the source line and the link to `/before`.

**The artifacts are mine:** screenshots of my builds, my 2022 site, the NatFTP frame from Motion Tiles, my homelab diagram, the 56-Day and Recall posts, and my own YouTube thumbnail. They're served from this repo, not from Notion, whose file links expire. The satellite and the era icons are drawn in SVG for this page. Nothing private is published: the database has a Publish field, and only those rows are read.

### 08 · SmoothScroll

**Reference:** Smooth Scroll by Nandi Muzsik and Clément Roche, Framer University, the component running on my Framer site. Read for behaviour only; none of its code is here. It wraps Lenis by darkroom.engineering (MIT), which is installed here as a library: wrapping a library I didn't write is this rung's idea.

**Reused, with credit:** a single knob turned into a glide length, Lenis's ease-out curve, and Lenis's recommended stylesheet.

**Net-new in mine:**
- **One engine, one clock.** The reference runs its own animation loop and only ever cancels the first frame, so when its setting changes (or React mounts it twice in development), the old loop keeps driving the new engine. Mine lets Lenis run its own clock, and each run of the effect destroys exactly the engine it built.
- **0 means off.** The reference falls back to its default when set to 0, so its slider can't turn smoothing off. Here 0 is native scroll, and 1–100 sets the weight: the glide lasts `smoothness ÷ 25` seconds.
- **Reduced motion:** no glide, native scroll, and Accretion's plain list. The reference smooths everyone.
- **A failed start leaves native scroll.** Nothing on the page depends on the engine.
- **Accretion's page only.** It mounts with the page and is destroyed when you leave; `/before` and every other build keep the browser's own scroll. Touch stays native too.
- **Cut what this page doesn't need:** the reference's jump-to-top (it runs before the engine exists, so it never fires), a watcher on every change in the page, a one-time sweep for scrollable boxes that misses `overflow: scroll` and anything added later, and an anchor-link sweep. Current Lenis has an option for each if a page needs it.
- **Current Lenis (1.3)** instead of the 1.1.2 bundled inside the reference.

**Tuned by eye, then measured** on localhost at 40: one wheel tick finishes 90% of its move in about half a second and settles by 1.3 s; a burst of five glides as one move with no bounce-back; flinging into the end of the record stops exactly at the end, with no overshoot. The scan still locks mid-glide.

**Next:** Back2Top (build 03) rides the same engine, so its ride and the page's glide stop fighting. That needs the engine shared between components, which is its own idea.

### 09 · TrailCursor

**Reference:** Cursor Trail Text by Akın Gündoğan (@akn-gundogan), Framer Marketplace, the component running over the case studies on my Framer site. Read for behaviour only; none of its code is here.

**Reused, with credit:** a letter dropped per distance travelled with a longer gap before each word, the envelope (hold for 70% of a letter's life, fade the last 30%), the cube-root fade curve, the shrink to half size, and my own settings from natmoges.com.

**Net-new in mine:**
- **Refs, not state.** This rung's idea. The reference keeps every letter in React state, so the whole trail redraws on every letter and on a cleanup timer 10 times a second, forever, even with nothing on screen. Mine places each letter on the glass by hand and remembers it in a ref; React draws the component once.
- **A real fade.** The reference only updates when React redraws, so its fade moves in 100 ms steps blurred by a CSS transition. Mine runs one animation loop that draws every frame.
- **Sleeps when empty.** The loop stops when the last letter is gone and wakes on the next one. A still mouse costs nothing.
- **One label for the zone.** The Scan is marked `data-trail-zone` and the readout panel `data-trail-off`. The reference hunts up every parent comparing names four ways: any layer named "section" counts as inside, and hovering an SVG icon throws an error.
- **Every pass reads from the start.** Entering the Scan (or coming back into the window) restarts the phrase and drops the first letter right under the pointer.
- **Moved by transform,** not by `left`/`top`, so letters never re-lay out the page.
- **Touch, reduced motion and failure:** no trail on touch screens, none with reduced motion, and none if the Scan isn't on the page.
- **Cut:** a true/false the reference sets on every move and never reads, two window listeners that never fire, and a counter bumped inside a state update (React can run that twice, which skips letters).

**Measured** on localhost at 120 frames a second: a letter holds at full strength until about 490 ms, fades and shrinks over 27 frames, and is gone at 706 ms; with the mouse still, the trail books zero frames. Phrase: INSPECT OBJECTS, kept to 15 characters so a slow pass reads it whole.

### 10 · LogoPreloader

**Reference:** Logo Preloader by Brett Jackson (@brett-jackson), Sukoya Design, Framer Marketplace, the component that opens my Framer site. Read for behaviour only; none of its code is here.

**Reused, with credit:** the four-stop sequence (arrive, hold, leave, gone), the 50 ms beat before the rise, the 0.7 s moves on his curve `cubic-bezier(.7,.2,.2,1)`, the 80 px travel in and out, and my own settings from natmoges.com (a 2.2 s hold, my NatFTP HUD logo, my starfield screen recording).

**Net-new in mine:**
- **It lives in the layout.** This rung's idea: the frame around every page, so it plays on every refresh or first arrival on any route. The layout stays mounted while pages swap, so clicking between pages never replays it.
- **It rises on first paint.** The server prints it into the page, and the entrance is a CSS animation, so nothing waits for JavaScript. My first cut ran the whole clock in React: on localhost it looked right, but live the logo appeared 1.2 s late, the time the JavaScript took to arrive. Now React only times the exit, and it counts from the start of the visit, so a late wake-up waits only for what's left.
- **No ghost pane.** On my Framer site the component disappears after three seconds, but its frame stays over the hero, catching the mouse. Here, when it's done, it's removed; nothing is left on top.
- **A HUD, not a card.** The logo is cut clear, the video is graded to true black, and the layer uses Screen blending, so only the HUD and the stars land on the page, and the fade changes no colours. On Framer I used Difference blending over the logo's black card; here the card is gone. (Cut and graded by Claude from my originals; 7.9 MB of video down to 1 MB.)
- **Clicks:** blocked during the hold, released the moment it starts leaving.
- **Pinned to the glass.** The reference scrolls away with the page; mine is fixed to the screen.
- **Guards:** if the JavaScript never arrives, the HUD clears itself about 6 s in. With reduced motion it fades in place with no travel. On phones and tablets it's never shown and the video is never downloaded.
- **"Desktop" means a mouse and 810 px or more.** My Framer site only shows it from 1510 px, so 13-inch laptops never see it there.
- **Cut:** the reference's three easing menus and their custom fields, which aren't wired to anything (every move uses the one curve), and its background image and colour options.

**Trade-off:** it covers `/before`'s text for its three seconds. I kept it on every route so Accretion's opening stays seamless.

**Measured** on localhost: the rise is already running before React wakes, it starts leaving at 2251 ms (target 2250) and is gone at 2951 ms, and the backstop clears a JavaScript-less copy at 5.95 s. Live, it's gone at 3.0 s (4.6 s before the fix). At 700 px wide, zero video requests. Logo at 540 px, so the line under the wordmark reads.

## Credits

Every reference is a component from the Framer Marketplace or Framer University, credited above by its author. **None of their code is in this repo.** Each build is written from scratch; where I reuse a value (an easing curve, a timing), I say so in that build's notes. Build 08 installs Lenis (MIT) as a library, which is the point of that build. Build 10's logo and starfield are my own artwork and screen recording.

**Co-pilot:** Claude (Anthropic) worked alongside me: explaining code, translating it into my own terms, and writing code from my paragraphs. I write the paragraphs, make the design calls, and type, debug and tune every build.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.