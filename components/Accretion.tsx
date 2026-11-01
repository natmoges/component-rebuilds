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

import Link from "next/link";
import { readRecord } from "../lib/record";
import Scan from "./Scan";
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
        <svg className={styles.satellite} viewBox="0 0 120 60" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="22" width="38" height="16" rx="1" />
                <line x1="15" y1="22" x2="15" y2="38" />
                <line x1="28" y1="22" x2="28" y2="38" />
                <rect x="80" y="22" width="38" height="16" rx="1" />
                <line x1="93" y1="22" x2="93" y2="38" />
                <line x1="106" y1="22" x2="106" y2="38" />
                <line x1="40" y1="30" x2="48" y2="30" />
                <line x1="72" y1="30" x2="80" y2="30" />
                <rect x="48" y="20" width="24" height="20" rx="3" />
                <line x1="60" y1="20" x2="60" y2="10" />
                <path d="M53 10 Q60 2 67 10" />
            </g>
            <circle className={styles.beacon} cx="60" cy="30" r="2.5" />
        </svg>
    );
}

export default async function Accretion() {
    const { entries, source } = await readRecord();
    const keptCount = entries.filter((entry) => entry.state === "Kept").length;
    const debrisCount = entries.length - keptCount;

    return (
        <main className={styles.space}>
            <div className={styles.stars} aria-hidden="true">
                <span className={styles.starLayer} style={{ boxShadow: starField(140, 7) }} />
                <span className={styles.starLayer} style={{ boxShadow: starField(60, 23) }} />
                <span className={styles.starLayer} style={{ boxShadow: starField(24, 41) }} />
            </div>
            <Satellite />
            <Scan entries={entries} source={source} keptCount={keptCount} debrisCount={debrisCount} />

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
                Read from {source === "substrate" ? "the substrate" : "cache"} · {keptCount} kept ·{" "}
                {debrisCount} debris
            </p>
            <p className={styles.seam}>
                <Link href="/before">The index this page grew out of</Link>
            </p>
        </main>
    );
}