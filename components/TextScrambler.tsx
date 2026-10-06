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

"use client"; // ← new

import { useEffect, useState } from "react"; // ← new
import styles from "./TextScrambler.module.css";

// ← new: the noise pool
const GLYPHS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=?!<>/\\|[]{}");

// ← new: roll a string of random glyphs
function makeNoise(length: number): string {
  let noise = "";
  for (let i = 0; i < length; i++) {
    noise += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return noise;
}

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
  scrambleColor = "var(--fg)", // ← new
}: TextScramblerProps) {
  const characters = Array.from(text); // ← new
  const [revealedCount, setRevealedCount] = useState(characters.length); // ← new
  const [noise, setNoise] = useState(""); // ← new

  // TEMPORARY (step 2 only): freeze halfway so both spans show. Step 3 replaces this.
  useEffect(() => {
    const half = Math.floor(characters.length / 2);
    setRevealedCount(half);
    setNoise(makeNoise(characters.length - half));
  }, [characters.length]);

  if (characters.length === 0) return null; // moved: now below the hooks

  const signal = characters.slice(0, revealedCount).join(""); // ← new

  return (
    <span className={styles.root}>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true" style={{ color: textColor }}>
        {signal}
      </span>
      <span aria-hidden="true" className={styles.noise} style={{ color: scrambleColor }}>
        {noise}
      </span>
    </span>
  );
}