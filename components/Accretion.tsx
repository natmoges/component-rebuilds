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

import Link from "next/link";
import { readRecord } from "../lib/record";
import { tempoStyle, recordCountOf } from "../lib/tempo";
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

function Satellite() {
    return (
        <svg className={styles.satellite} viewBox="0 0 120 64" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                <rect className={styles.panel} x="2" y="22" width="38" height="16" rx="1" />
                <line x1="11.5" y1="22" x2="11.5" y2="38" />
                <line x1="21" y1="22" x2="21" y2="38" />
                <line x1="30.5" y1="22" x2="30.5" y2="38" />
                <line x1="2" y1="30" x2="40" y2="30" />
                <rect className={styles.panel} x="80" y="22" width="38" height="16" rx="1" />
                <line x1="89.5" y1="22" x2="89.5" y2="38" />
                <line x1="99" y1="22" x2="99" y2="38" />
                <line x1="108.5" y1="22" x2="108.5" y2="38" />
                <line x1="80" y1="30" x2="118" y2="30" />
                <line x1="40" y1="30" x2="48" y2="30" />
                <line x1="72" y1="30" x2="80" y2="30" />
                <rect x="48" y="20" width="24" height="20" rx="3" />
                <line x1="60" y1="20" x2="60" y2="10" />
                <path d="M53 10 Q60 2 67 10" />
                <path d="M55 40h10l-2 6h-6z" />
            </g>
            <circle className={styles.beacon} cx="60" cy="30" r="2.5" />
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
                Read from {source === "substrate" ? "the substrate" : "cache"} · {record.kept} kept ·{" "}
                {record.debris} debris
            </p>
            <p className={styles.seam}>
                <Link href="/before">The index this page grew out of</Link>
            </p>
        </main>
    );
}