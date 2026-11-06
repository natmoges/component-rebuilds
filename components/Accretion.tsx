/*
 * Accretion: build #7 of the closer ladder.
 * Reference: none. The first build with nothing to copy.
 *
 * My record, read from deep space. Every object in it comes from Notion, the
 * substrate it has always lived in, read on the server before the page
 * reaches you. Nothing is polished to match: each object is shown at the
 * quality it really had, so the distance between them can be seen.
 *
 * BEFORE LOAD: pitch black, and the only light is the stars, twinkling.
 *
 * THE FIRST BAR: a satellite drifts in and holds its position.
 *
 * SCROLLING: scrolling is travel. Objects stream past like a comet shower,
 * oldest first, so the further you go, the later they are.
 *
 * THE SCAN: as each object passes, the satellite hunts. Then the record
 * decides.
 *
 * KEPT: if the record can prove it, the scan locks and the tractor beam holds
 * it. Its data decodes onto a green, see-through HUD like my TextScrambler
 * (build #2): date, title, what changed, credit. Tap it to land on the real
 * thing. Then it is pulled into a body that grows as you scroll. That is the
 * accretion.
 *
 * DEBRIS: if the record can't prove it yet, the beam loses its hold, its lock
 * condition shows for a moment, and it falls back into the debris. When the
 * proof arrives in Notion, the next visit keeps it.
 *
 * THE TEMPO: scan, lock and decode land on one beat, SignalLocation's
 * one-second bar of eight ticks.
 *
 * SCROLLING BACK: objects reverse with the scroll. No re-scan; a decision
 * stays made.
 *
 * THE END: the body, one line on where the data came from, kept and debris
 * counted, and a link to /before, the index this page grew out of.
 *
 * FAILURE: if the substrate can't be reached, the satellite reads the stored
 * copy and the HUD says "from cache".
 *
 * IPHONE: the same scene; tap where a desktop would hover.
 *
 * REDUCED MOTION: the stars hold still, and the HUD becomes a list read top
 * to bottom, kept first, then debris.
 */

/*
 * INTEGRATION PASS, ITEM 4 — one space.
 * What I found: each build placed itself, so nothing knew where anything
 * else was. The satellite's orbit carried it straight across the planet.
 * The count sat on the planet's face, crossed by the moons' path. The
 * moons' blank title slots drew little lines in the air before they had
 * anything to say. Here the scene keeps one rule: everything knows where
 * the planet is, and nothing sits on top of it by accident.
 *
 * THE PLANET IS THE LANDMARK: HeroOrbit already tells the page its radius
 * and how far it has slid. Everything below reads those two numbers.
 *
 * THE SATELLITE KEEPS ITS DISTANCE: a second invisible ring, around the
 * planet this time, the planet's radius plus a margin. The satellite
 * glances off it and slides around the curve, the same way it already
 * circles the lock instead of covering it. Thrown at the planet, it
 * bounces off the atmosphere.
 *
 * THE COUNT SITS AT THE LIMB: under the planet, just past its edge, and
 * it moves out as the planet grows. It belongs to the planet, but it's
 * never painted on it, and the moons' path never crosses it.
 *
 * THE MOONS SAY NOTHING UNTIL THEY'VE EARNED IT: no blank slot, no line.
 * A title appears only when it decodes.
 *
 * THE KNOBS: the planet's ring at its radius plus 32 px · the count 20 px
 * below the limb · the moons' slots hidden until named.
 *
 * WHAT STAYS: the planet is see-through, the way Tim made it, so stars
 * and meteors behind it show through its skin. (Decided: hologram, not a
 * stone.)
 *
 * FAILURE: if WebGL can't start, the grey sphere's own size stands in for
 * the planet's radius, and everything keeps its distance from that.
 *
 * PHONE: the same rules, at the phone's planet size.
 *
 * REDUCED MOTION: unchanged. The plain record list, no scene.
 */

/*
 * INTEGRATION PASS, ITEM 6 — the frame.
 * What I found: once the boot hands over, the page never says whose it is
 * or where its record comes from. The only way back up 30,000 px of record
 * is to scroll it. And the end is a dead end: one link, to /before. Back2Top
 * (build #3) was finished and sitting unused. Here the page names itself
 * inside the HUD it already has, lends you the rocket for the ride home,
 * and makes the end of the record its payoff. No new frame and no nav
 * bar: the satellite's HUD is the only chrome.
 *
 * WHOSE IT IS: once the boot hands over, the HUD's top line stays put:
 * NAT MOGES · READ LIVE FROM NOTION. From the stored copy, it says so.
 *
 * THE ROCKET: past 30% of the record, Back2Top appears bottom right,
 * breathing, the same rocket as build #3 and natmoges.com, clear of the
 * planet and its count. Tap it and the record rides back past you to the
 * top, inside three seconds. The ride doesn't scan: nothing hunts while
 * you're carried. Scroll, and the ride breaks where you are, and scanning
 * resumes from there.
 *
 * RESCAN, NOW WITH THE RIDE: everything goes back to zero, and the rocket
 * carries you to the start, so the record begins again from the first
 * object.
 *
 * THE END IS THE PAYOFF: the grown planet, both moons named, and the HUD's
 * last transmission. The record's numbers, then where to go:
 * the build, commit by commit (the repo: every paragraph above its code,
 * every commit in order) · natmoges.com · contact · the index this page
 * grew out of. The seam stays findable. Rescan last.
 *
 * THE KNOBS: the rocket at 30% · the ride inside three seconds · the
 * proof link to the repo.
 *
 * FAILURE: if the record comes from the stored copy, the HUD's top line
 * and the end card say so. The links don't depend on it.
 *
 * PHONE: the rocket is a tap, the links are taps, and the HUD keeps its
 * width. Where the HUD fills the screen's width, the rocket rides just
 * above the HUD's left corner instead, in thumb reach.
 *
 * KEYBOARD: tab to the rocket, enter, and focus lands at the top of the
 * page, as in build #3.
 *
 * REDUCED MOTION: the plain record list ends with the same lines: whose
 * it is, the record's numbers, the repo, natmoges.com, contact, /before.
 * The rocket jumps instead of riding.
 */

/*
 * INTEGRATION PASS, ITEM 9 — polish.
 * What I found: with the pieces integrated, what's left is rhythm and
 * composition. The meteors fall like rain: eighteen streaks, one angle,
 * one pace. The left third of the screen holds nothing but passing
 * matter. Every object gets the same 90vh, kept or debris, so the record
 * reads as a list, not a history. And sometimes the planet's rings turn
 * edge-on and read as stripes. Here the sky gets weather, the record gets
 * chapters, and the planet keeps its face.
 *
 * METEORS: rare and varied. Fewer at once, each with its own angle (within
 * one shared direction), speed, length and brightness, and every so often
 * a bright one with a teal tail. Scrolling still stretches them.
 *
 * THE LEFT THIRD: the record's chapters. As you cross into a stratum, its
 * name and years surface on the left in my portfolio's telemetry voice
 * (THE SUBSTRATE · 2023–2024), then fade as you read on. Not a frame and
 * not a position readout: a chapter title that comes and goes.
 *
 * THE RHYTHM: measured, not guessed. Passages tighten from 90vh to 75vh, so
 * the record reads as one sitting, while each object still holds at the
 * lock long enough to decode at an easy scroll. Debris passes quicker than
 * what's kept. A short breath between strata marks the chapters.
 *
 * THE RINGS: tilted toward the camera, so they always read as nested
 * curves, as on my hero, whatever the spin.
 *
 * THE KNOBS: meteor count and spread · the chapter title's hold · the
 * passage heights, kept and debris · the breath between strata · BAR stays
 * 1000 ms, and the tempo is confirmed as final.
 *
 * PHONE: the chapter title sits above the HUD, not in a left third the
 * phone doesn't have.
 *
 * REDUCED MOTION: meteors still. The plain list gets the strata as
 * headings.
 */

import Link from "next/link";
import { readRecord } from "../lib/record";
import { tempoStyle, recordCountOf } from "../lib/tempo";
import { REPO_URL, PORTFOLIO_URL, CONTACT_URL } from "../lib/links";
import Scan from "./Scan";
import StarCloud from "./StarCloud";
import Gravity from "./Gravity";
import styles from "./Accretion.module.css";

function starField(count: number, seed: number): string {
    let state = seed;
    const next = () => {
        state = (state * 16807) % 2147483647;
        return state / 2147483647;
    };
    return Array.from(
        { length: count },
        () => `${Math.round(next() * 2560)}px ${Math.round(next() * 1600)}px #fff`
    ).join(", ");
}

// Integration item 8: SAT_1, a probe drawn in the planet's own language. Its dish is a record:
// grooves in Tim's green inside the world's teal rim, a highlight sweeping round at 33⅓. Lit by the
// planet's key light (upper left): the body's top catches it, its left face is half lit, its
// right face is in shade. The grooves light as the planet fills (Scan's data-grooves).
function Satellite() {
    return (
        <svg className={styles.satellite} viewBox="0 0 120 64" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
                <line x1="51" y1="17" x2="16.4" y2="11.9" />
                <circle cx="14" cy="11.5" r="2.6" fill="currentColor" fillOpacity="0.25" />
                <line x1="69" y1="17" x2="99" y2="25.5" />
                <rect x="99" y="23" width="11" height="5.5" rx="1.5" transform="rotate(16 104.5 25.75)" fill="currentColor" fillOpacity="0.14" />
                <polygon points="55.5,18.3 51,15 51,21 55.5,24.3" fill="currentColor" fillOpacity="0.18" />
                <polygon points="64.5,18.3 55.5,18.3 55.5,24.3 64.5,24.3" fill="currentColor" fillOpacity="0.1" />
                <polygon points="69,15 64.5,18.3 64.5,24.3 69,21" fill="currentColor" fillOpacity="0.04" />
                <polygon points="69,15 64.5,18.3 55.5,18.3 51,15 55.5,11.7 64.5,11.7" fill="currentColor" fillOpacity="0.32" />
                <line x1="60" y1="24.3" x2="60" y2="30.8" />
                <g className={styles.dish}>
                    <g transform="translate(60 40) scale(1 0.42)">
                        <circle className={styles.rim} r="22" />
                        <circle className={styles.groove} data-groove="1" r="19.5" />
                        <circle className={styles.groove} data-groove="2" r="17" />
                        <circle className={styles.groove} data-groove="3" r="14.5" />
                        <circle className={styles.groove} data-groove="4" r="12" />
                        <circle className={styles.groove} data-groove="5" r="9.5" />
                        <circle className={styles.groove} data-groove="6" r="7" />
                        <g className={styles.sweep}>
                            <circle r="22" stroke="none" />
                            <path d="M0 0 L22 0 A22 22 0 0 1 15.6 15.6 Z" stroke="none" />
                        </g>
                        <circle className={styles.beacon} r="2.5" stroke="none" />
                    </g>
                </g>
            </g>
            <text className={styles.tag} x="86" y="49">SAT_1</text>
        </svg>
    );
}

export default async function Accretion() {
    const { entries, source } = await readRecord();
    const record = recordCountOf(entries);

    return (
        <main className={styles.space} style={tempoStyle}>
            <div className={styles.stars} aria-hidden="true">
                <span className={styles.starLayer} style={{ boxShadow: starField(140, 7) }} />
                <span className={styles.starLayer} style={{ boxShadow: starField(60, 23) }} />
                <span className={styles.starLayer} style={{ boxShadow: starField(24, 41) }} />
                <StarCloud />
            </div>

            <Gravity>
                <Satellite />
            </Gravity>
            <Scan entries={entries} source={source} />

            <ol className={styles.record}>
                {entries.map((entry) => (
                    <li key={entry.id} className={styles.entry} data-state={entry.state}>
                        <span className={styles.when}>{entry.when}</span>
                        <h2 className={styles.title}>
                            {entry.link ? <a href={entry.link}>{entry.title}</a> : entry.title}
                        </h2>
                        <p>{entry.whatChanged}</p>
                        {entry.credit && <p className={styles.credit}>{entry.credit}</p>}
                        {entry.state === "Debris" && (
                            <p className={styles.lock}>Locks when: {entry.lockCondition}</p>
                        )}
                    </li>
                ))}
            </ol>
            <p className={styles.source}>
                Nat Moges · {source === "substrate" ? "Read live from Notion" : "From the stored copy"} ·{" "}
                {record.kept} kept ·{" "}
                {record.debris} debris
            </p>
            <nav className={styles.seam} aria-label="Where to go from here">
                <a href={REPO_URL}>The build, commit by commit</a> · <a href={PORTFOLIO_URL}>natmoges.com</a> ·{" "}
                <a href={CONTACT_URL}>Contact</a> · <Link href="/before">The index this page grew out of</Link>
            </nav>
        </main>
    );
}