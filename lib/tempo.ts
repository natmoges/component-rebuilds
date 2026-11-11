/*
 * Tempo — the integration pass, for Accretion.
 * Reference: none. This is the page's own wiring, not a rebuild. What's
 * mine: fourteen builds each kept their own time. Scan's bar, BootScreen's
 * bar and the CSS bar were three copies of 1000 ms, and the planet waited
 * 3000 ms because I matched it to the absorb by hand. Here there's one
 * clock and three counts, and every part of the page reads them instead
 * of keeping its own.
 *
 * One clock. Everything keeps time to one bar, written once. The hunt is
 * bars, the absorb is bars, the boot's tick is a slice of a bar, and the
 * planet waits exactly as long as the absorb takes because it reads the
 * same number, not a copy. Change the bar and the whole page moves together.
 *
 * Three counts, and none of them stands in for another. The record is
 * what my database says: kept, debris, and the total. Your scan is what
 * you've seen: every object the crosshair has decided. The planet shows
 * your scan, not the record, so it only grows from the kept objects you've
 * decoded, and its label says so.
 *
 * THE KNOBS: the bar at 1000 ms · the lock's brackets close in over one
 * bar · the hunt, three quarters of a bar, so the record decides the moment
 * the brackets land · the absorb, one bar of hold and one of flight · the
 * planet's arrival, the absorb's length · the boot's tick, an eighth of a
 * bar. The CSS bar is set from the same number. (Nov 5: the hunt and the
 * flight were two bars each, then one; the hunt is now matched to the
 * brackets, which are within 3 px of the lock at 750 ms on their curve.)
 *
 * BEFORE LOAD: nothing counts yet. The server prints the record's totals
 * with the page.
 *
 * THE INSTANT IT ARRIVES: the record's numbers are fixed for the visit.
 * Your scan starts at zero, and so does the planet.
 *
 * ON A LOCK: the hunt runs its bars, the record decides, and your scan
 * goes up by one, kept or debris.
 *
 * KEPT: the object takes the absorb's bars to fall in, and the planet
 * grows the moment it lands, not before. The label reads SCANNED 01 / 41,
 * 02 / 41, and so on.
 *
 * DEBRIS: your scan counts it. The planet doesn't move.
 *
 * SCROLLING BACK: a decision stays made. Nothing is counted twice.
 *
 * THE END: the end card states the record's numbers and the planet states
 * yours, each labelled, so they never read as a contradiction. Making
 * them meet is the finale's job, not this one.
 *
 * FAILURE: if Notion can't be reached, the record comes from the stored
 * copy and says so. The counts work the same.
 *
 * REDUCED MOTION: Accretion becomes the plain record list, so there's
 * nothing to time and no planet to count.
 */

import type { CSSProperties } from "react";
import type { Entry } from "./record";

// The one clock. Every other timing is a number of bars.
export const BAR_MS = 1000;

// The boot types on a tick: an eighth of a bar.
export const TICK_MS = BAR_MS / 8;

// The lock's brackets close in over one bar, easing out, so they land early.
export const LOCK_MS = BAR_MS;

// The record decides when the brackets land: 750 ms into their close, they're within 3 px.
export const HUNT_MS = 0.75 * BAR_MS;

// A kept object holds in the beam for one bar, then flies into the planet for one.
export const HOLD_MS = BAR_MS;
export const FLIGHT_MS = BAR_MS;
export const ABSORB_MS = HOLD_MS + FLIGHT_MS;

// The planet grows when the object lands: after exactly the absorb, read, not copied.
export const ARRIVAL_MS = ABSORB_MS;

// How long the HUD holds a card before the next one may take it: a debris
// card for a bar, a kept card for two, and a card with an artifact (a picture, a snippet, a clip)
// for five, after which its story replaces the artifact.
export const DEBRIS_CARD_MS = BAR_MS;
export const KEPT_CARD_MS = 2 * BAR_MS;
export const ARTIFACT_CARD_MS = 5 * BAR_MS;

// The same numbers, handed to the CSS on Accretion's page.
export const tempoStyle = {
    "--bar": `${BAR_MS}ms`,
    "--lock": `${LOCK_MS}ms`,
    "--hold": `${HOLD_MS}ms`,
    "--flight": `${FLIGHT_MS}ms`,
} as CSSProperties;

// ---------- The three counts ----------

// What the record decides for an object once the crosshair has held it.
export type Decision = "kept" | "debris";

// The record: what my database says. Fixed for the visit.
export interface RecordCount {
    kept: number;
    debris: number;
    total: number;
}

// Your scan: every object the crosshair has decided on this visit.
export interface ScanCount {
    decided: number;
    kept: number;
    debris: number;
}

// The planet: built only from the kept objects you've decoded.
export interface PlanetCount {
    mass: number;
}

export interface Counts {
    record: RecordCount;
    scan: ScanCount;
    planet: PlanetCount;
}

export function recordCountOf(entries: Entry[]): RecordCount {
    const kept = entries.filter((entry) => entry.state === "Kept").length;
    return { kept, debris: entries.length - kept, total: entries.length };
}

// What the record revealed at the finale (or this browser remembered) grows the planet, but it
// is never added to your scan: revealed and scanned are kept apart.
export function countsOf(
    entries: Entry[],
    decisions: Record<string, Decision>,
    revealed: Record<string, Decision> = {}
): Counts {
    const decided = entries.filter((entry) => decisions[entry.id] !== undefined);
    const kept = decided.filter((entry) => decisions[entry.id] === "kept").length;
    const revealedKept = entries.filter(
        (entry) => decisions[entry.id] === undefined && revealed[entry.id] === "kept"
    ).length;
    return {
        record: recordCountOf(entries),
        scan: { decided: decided.length, kept, debris: decided.length - kept },
        planet: { mass: kept + revealedKept },
    };
}
