"use client";

/*
 * TrailCursor — build #9 of the closer ladder.
 * Reference: Cursor Trail Text by Akın Gündoğan (@akn-gundogan), Framer
 * Marketplace.
 *
 * Leaves the words INSPECT OBJECTS behind the mouse as it moves through
 * Accretion's space, one letter at a time, fading as they go. It runs only
 * over the Scan, where the objects drift past the crosshair; the readout
 * panel at the bottom stays clean.
 *
 * THE KNOBS, carried over from my natmoges.com settings: the phrase · Signal
 * green at 30% strength · a letter every 15 pixels of travel, 30 before a
 * space or a new pass of the phrase · each letter lives 0.7 seconds · at
 * most 15 alive at once · shrink to half size while fading. Kept to 15
 * characters, so a slow pass reads the whole phrase.
 *
 * BEFORE LOAD: Accretion looks exactly as it does now. Nothing on the page
 * belongs to the trail until the mouse moves.
 *
 * THE INSTANT IT ENTERS: the moment the mouse moves into the Scan, the first
 * letter, I, drops right under the pointer.
 *
 * DURING: every 15 pixels of travel drops the next letter. Each one holds
 * still for about half a second, then fades and shrinks over the last fifth
 * of a second. A fast flick leaves gaps between letters, like the original.
 *
 * STOPPING: no new letters. The ones out there finish fading, and once
 * they're gone the trail does no work at all.
 *
 * LEAVING: moving onto the readout panel or off the Scan stops new letters.
 * The ones already dropped finish fading where they are.
 *
 * A REPEAT: coming back in starts the phrase from I again, so every pass
 * reads from the beginning.
 *
 * SCROLLING: the letters belong to the screen, not the page. The objects
 * glide past underneath them while they fade in place.
 *
 * CLICKS: pass straight through the letters to whatever is underneath, so
 * Tap to read still works.
 *
 * FAILURE: if the Scan can't be found, the trail draws nothing and the page
 * works as before.
 *
 * TOUCH: on phones and tablets there is no trail.
 *
 * REDUCED MOTION: no trail. Accretion shows its plain list as before.
 */

import { useEffect, useRef } from "react";
import styles from "./TrailCursor.module.css";

const HOLD_SHARE = 0.7;
const FADE_CURVE = 3;
const SHRINK_TO = 0.5;

interface Letter {
    el: HTMLSpanElement;
    bornAt: number;
    x: number;
    y: number;
}

interface TrailCursorProps {
    text: string;
    letterGapPx?: number;
    wordGapPx?: number;
    lifeMs?: number;
    maxLetters?: number;
    strength?: number;
}

export default function TrailCursor({
    text,
    letterGapPx = 15,
    wordGapPx = 30,
    lifeMs = 700,
    maxLetters = 15,
    strength = 0.3,
}: TrailCursorProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const lettersRef = useRef<Letter[]>([]);
    const lastDropRef = useRef<{ x: number; y: number } | null>(null);
    const nextCharRef = useRef(0);
    const isInsideRef = useRef(false);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage || text.length === 0) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!document.querySelector("[data-trail-zone]")) return;

        const drawFrame = (now: number) => {
            const holdMs = lifeMs * HOLD_SHARE;

            lettersRef.current = lettersRef.current.filter((letter) => {
                const age = now - letter.bornAt;
                if (age >= lifeMs) {
                    letter.el.remove();
                    return false;
                }
                if (age > holdMs) {
                    const progress = (age - holdMs) / (lifeMs - holdMs);
                    const eased = Math.pow(progress, 1 / FADE_CURVE);
                    const scale = 1 - eased * (1 - SHRINK_TO);
                    letter.el.style.opacity = String(strength * (1 - eased));
                    letter.el.style.transform =
                        `translate(${letter.x}px, ${letter.y}px) translate(-50%, -50%) scale(${scale})`;
                }
                return true;
            });

            frameRef.current =
                lettersRef.current.length > 0 ? requestAnimationFrame(drawFrame) : null;
        };

        const dropLetter = (x: number, y: number) => {
            const el = document.createElement("span");
            el.className = styles.letter;
            el.textContent = text[nextCharRef.current % text.length];
            el.style.opacity = String(strength);
            el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            stage.appendChild(el);

            lettersRef.current.push({ el, bornAt: performance.now(), x, y });
            if (frameRef.current === null) {
                frameRef.current = requestAnimationFrame(drawFrame);
            }
            nextCharRef.current += 1;
            lastDropRef.current = { x, y };

            while (lettersRef.current.length > maxLetters) {
                lettersRef.current.shift()?.el.remove();
            }
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;

            const target = event.target as Element | null;
            const isInside =
                !!target?.closest("[data-trail-zone]") &&
                !target?.closest("[data-trail-off]");

            if (!isInside) {
                isInsideRef.current = false;
                return;
            }

            if (!isInsideRef.current) {
                isInsideRef.current = true;
                nextCharRef.current = 0;
                dropLetter(event.clientX, event.clientY);
                return;
            }

            const last = lastDropRef.current;
            if (!last) return;
            const travelled = Math.hypot(event.clientX - last.x, event.clientY - last.y);

            const charIndex = nextCharRef.current % text.length;
            const isGap = text[charIndex] === " " || charIndex === 0;
            const gapPx = isGap ? wordGapPx : letterGapPx;

            if (travelled >= gapPx) {
                dropLetter(event.clientX, event.clientY);
            }
        };

        const handlePointerLeave = () => {
            isInsideRef.current = false;
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", handlePointerLeave);

        return () => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
            window.removeEventListener("pointermove", handlePointerMove);
            document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
            lettersRef.current.forEach((letter) => letter.el.remove());
            lettersRef.current = [];
            isInsideRef.current = false;
        };
    }, [text, letterGapPx, wordGapPx, lifeMs, maxLetters, strength]);

    return <div ref={stageRef} className={styles.stage} aria-hidden="true" />;
}