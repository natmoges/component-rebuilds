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

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TextScrambler.module.css";

const GLYPHS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=?!<>/\\|[]{}");

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
    scrambleColor = "var(--fg)",
    durationMs = 1300,
    flickerRate = 0.3,
}: TextScramblerProps) {
    const characters = Array.from(text);
    const [revealedCount, setRevealedCount] = useState(0);
    const [noise, setNoise] = useState("");
    const frameRef = useRef<number | null>(null);

    const textRef = useRef<HTMLSpanElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = textRef.current;
        if (element === null) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (!entry.isIntersecting) {
                    setRevealedCount(0);
                    setNoise("");
                }
            }, { threshold: 0.5 }
        );
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const isMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isAnimated = durationMs > 0 && !isMotionReduced;
        const total = Array.from(text).length;
        let start: number | null = null;
        const rollEveryMs = flickerRate > 0 ? 1000 / (flickerRate * 20) : Infinity;
        let currentNoise = makeNoise(total);
        let lastRoll: number | null = null;
        function flicker(now: number) {
            if (start === null) start = now;
            const elapsed = now - start;
            const progress = isAnimated ? Math.min(elapsed / durationMs, 1) : 1;
            const count = Math.floor(progress * total);

            setRevealedCount(count);
            if (lastRoll === null || now - lastRoll >= rollEveryMs) {
                currentNoise = makeNoise(total);
                lastRoll = now;
            }
            setNoise(currentNoise.slice(count));
            if (count < total) {
                frameRef.current = requestAnimationFrame(flicker);
            }
        }

        frameRef.current = requestAnimationFrame(flicker);

        return () => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        };
    }, [text, durationMs, flickerRate, isVisible]);


    if (characters.length === 0) return null;

    const signal = characters.slice(0, revealedCount).join("");

    return (
        <span ref={textRef} className={styles.root}>
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