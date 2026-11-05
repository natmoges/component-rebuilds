/*
 * Tempo — integration pass, item 2 of Accretion.
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
 * THE KNOBS: the bar at 1000 ms (unchanged here, so nothing moves) · the
 * hunt, two bars · the absorb, one bar of hold and two of flight · the
 * planet's arrival, the absorb's length · the boot's tick, an eighth of a
 * bar. The CSS bar is set from the same number.
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

// The one clock. Every other timing is a number of bars.
export const BAR_MS = 1000;

// The boot types on a tick: an eighth of a bar.
export const TICK_MS = BAR_MS / 8;

// The crosshair hunts for two bars before the record decides.
export const HUNT_MS = 2 * BAR_MS;

// A kept object holds in the beam for one bar, then flies into the planet for two.
export const HOLD_MS = BAR_MS;
export const FLIGHT_MS = 2 * BAR_MS;
export const ABSORB_MS = HOLD_MS + FLIGHT_MS;

// The planet grows when the object lands: after exactly the absorb, read, not copied.
export const ARRIVAL_MS = ABSORB_MS;

// The same numbers, handed to the CSS on Accretion's page.
export const tempoStyle = {
    "--bar": `${BAR_MS}ms`,
    "--hold": `${HOLD_MS}ms`,
    "--flight": `${FLIGHT_MS}ms`,
} as CSSProperties;
