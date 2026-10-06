/*
 * TextScrambler — a signal fighting through noise.
 *
 * Before it's on screen, the text is there but invisible: the page reads as empty
 * space, while search engines and screen readers still get the real words.
 * The instant it scrolls into view (isVisible), every character becomes noise —
 * bright, high-contrast glyphs re-rolling at flickerRate. Then, left to right over
 * durationMs, characters lock in one at a time (revealedCount). Locked characters
 * are the signal: stable, in textColor, pulsing like the vinyl's progress bar.
 * The rest stay noise in scrambleColor, set in a fixed-width font so the chaos
 * doesn't shake the line. Everything scrambles — spaces, apostrophes, numbers,
 * symbols, any language. When the last character locks, the flicker stops
 * (hasRevealed) and the word keeps pulsing for as long as it's on screen.
 * Scroll away and back, and the whole reveal plays again.
 *
 * Edges: no text → render nothing. durationMs of 0 → no noise, just the stable
 * signal. flickerRate of 0 or less → the noise freezes in place. Reduced motion →
 * same as durationMs 0: stable text, no flicker, no pulse.
 *
 * Reference: TextScrambler by Solt Wagner (@solt), Frameblox / Framer Marketplace.
 */

import styles from "./TextScrambler.module.css";

export interface TextScramblerProps {
  text: string;
  textColor?: string;
  scrambleColor?: string;
  durationMs?: number;
  flickerRate?: number;
}

export default function TextScrambler({
  text,
  textColor = "var(--signal)",
}: TextScramblerProps) {
  if (text.length === 0) return null;

  return (
    <span className={styles.root} style={{ color: textColor }}>
      {text}
    </span>
  );
}