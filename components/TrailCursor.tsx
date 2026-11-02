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

import { useRef } from "react";
import styles from "./TrailCursor.module.css";

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

    return <div ref={stageRef} className={styles.stage} aria-hidden="true" />;
}