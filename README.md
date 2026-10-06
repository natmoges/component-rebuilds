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
| 03 | BackToTop | The Velox Studio | 1 |
| 04 | AnimatedFolder | Launchly | 2 · Composition + data |
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

## Credits

Every reference is a component from the Framer Marketplace, credited above by its author. **None of their code is in this repo.** Each build is written from scratch; where I reuse a value (an easing curve, a timing), I say so in that build's notes.

**Co-pilot:** Claude (Anthropic) worked alongside me: explaining code, translating it into my own terms, and writing code from my paragraphs. I write the paragraphs, make the design calls, and type, debug and tune every build.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
