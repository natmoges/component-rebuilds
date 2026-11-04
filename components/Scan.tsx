"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import TextScrambler from "./TextScrambler";
import BootScreen from "./BootScreen";
import type { Entry } from "../lib/record";
import styles from "./Accretion.module.css";

const BAR_MS = 1000;
const HUNT_MS = 2 * BAR_MS;
const HOLD_TOLERANCE_PX = 6;
const DRIFT_PER_ENTRY = 5;
const METEOR_COUNT = 18;

type Decision = "kept" | "debris";
type Phase = "rest" | "travelling" | "held" | "end";
type Reading = "rest" | "searching" | "hunting" | "kept" | "debris" | "end";

// What each era was made of. Line icons on a 24-unit grid, drawn like the satellite.
const MATTER: Record<string, string[][]> = {
    "0": [
        ["M6 12h.01", "M12 8h.01", "M17 14h.01", "M10 17h.01"],
        ["M8 9h.01", "M15 11h.01", "M11 15h.01"],
    ],
    "1": [
        ["M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M11 18h2"],
        ["M7 3h10v18H7z", "M9 6h6v3H9z", "M9 12h.01", "M12 12h.01", "M15 12h.01", "M9 15h.01", "M12 15h.01", "M15 15h.01", "M9 18h.01", "M12 18h.01", "M15 18h.01"],
        ["M8 8h8v8H8z", "M10 4v4", "M14 4v4", "M10 16v4", "M14 16v4", "M4 10h4", "M4 14h4", "M16 10h4", "M16 14h4"],
    ],
    "2": [
        ["M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z", "M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4z"],
        ["M4 5h16v14H4z", "M4 9h16", "M4 15h16", "M7 6v2", "M12 6v2", "M17 6v2", "M7 16v2", "M12 16v2", "M17 16v2"],
        ["M4 8h4l2-2h4l2 2h4v11H4z", "M12 10a3 3 0 1 0 0 6a3 3 0 1 0 0-6z"],
    ],
    "3": [
        ["M4 6h16v12H4z", "M4 14h16", "M16 16h.01"],
        ["M4 4h16v6H4z", "M4 14h16v6H4z", "M7 7h.01", "M7 17h.01"],
        ["M5 19a10 10 0 0 1 0-14l14 14a10 10 0 0 1-14 0z", "M12 12l5-5", "M17 7h.01"],
    ],
    "4": [["M7 3h7l4 4v14H7z", "M14 3v4h4", "M9 11h6", "M9 14h6", "M9 17h4"]],
    "5": [
        ["M9 8l-4 4 4 4", "M15 8l4 4-4 4", "M13 6l-2 12"],
        ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
    ],
};

function eraOf(stratum: string): string {
    const era = stratum.charAt(0);
    return MATTER[era] ? era : "0";
}

function Matter({ era, variant }: { era: string; variant: number }) {
    const shapes = MATTER[era];
    const shape = shapes[variant % shapes.length];
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <g
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {shape.map((d) => (
                    <path key={d} d={d} />
                ))}
            </g>
        </svg>
    );
}

function seeded(seed: number) {
    let state = seed;
    return () => {
        state = (state * 16807) % 2147483647;
        return state / 2147483647;
    };
}

type Drift = {
    era: string;
    variant: number;
    left: number;
    slot: number;
    depth: number;
    turn: number;
};

function driftOf(entries: Entry[]): Drift[] {
    const next = seeded(97);
    return entries.flatMap((entry, index) =>
        Array.from({ length: DRIFT_PER_ENTRY }, () => {
            const side = next() < 0.5 ? -1 : 1;
            return {
                era: eraOf(entry.stratum),
                variant: Math.floor(next() * 3),
                left: 50 + side * (14 + next() * 34),
                slot: index + next(),
                depth: 0.25 + next() * 0.75,
                turn: Math.round(next() * 360),
            };
        })
    );
}

type Meteor = {
    left: number;
    length: number;
    seconds: number;
    delay: number;
    brightness: number;
};

function meteorsOf(count: number): Meteor[] {
    const next = seeded(41);
    // Meteors fall in the outer lanes only, so the centre stays clear for the beam.
    return Array.from({ length: count }, () => ({
        left: next() < 0.5 ? next() * 28 : 72 + next() * 34,
        length: 20 + Math.round(next() * 60),
        seconds: 2 + next() * 3,
        delay: -next() * 5,
        brightness: 0.15 + next() * 0.3,
    }));
}

export interface ScanProps {
    entries: Entry[];
    source: "substrate" | "cache";
    keptCount: number;
    debrisCount: number;
}

export default function Scan({ entries, source, keptCount, debrisCount }: ScanProps) {
    const [heldId, setHeldId] = useState<string | null>(null);
    const [phase, setPhase] = useState<Phase>("rest");
    const [decisions, setDecisions] = useState<Record<string, Decision>>({});
    const [dissolvedId, setDissolvedId] = useState<string | null>(null);
    const [failedImages, setFailedImages] = useState<string[]>([]);
    const scanRef = useRef<HTMLDivElement | null>(null);
    const objectRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const drifts = useMemo(() => driftOf(entries), [entries]);
    const meteors = useMemo(() => meteorsOf(METEOR_COUNT), []);

    useEffect(() => {
        const isMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let frame: number | null = null;
        let settle: ReturnType<typeof setTimeout> | null = null;
        let lastY = window.scrollY;
        let lastTime = performance.now();

        function locate() {
            frame = null;
            const scanLine = window.innerHeight / 2;

            if (!isMotionReduced && scanRef.current !== null) {
                const now = performance.now();
                const speed = Math.abs(window.scrollY - lastY) / Math.max(16, now - lastTime);
                lastY = window.scrollY;
                lastTime = now;
                const style = scanRef.current.style;
                style.setProperty("--scroll", String(window.scrollY));
                style.setProperty("--warp", Math.min(speed * 2.5, 5).toFixed(2));
                if (settle !== null) clearTimeout(settle);
                settle = setTimeout(() => style.setProperty("--warp", "0"), 140);
            }

            let held: string | null = null;
            for (let index = 0; index < entries.length; index++) {
                const object = objectRefs.current[index];
                if (!object) continue;
                const box = object.getBoundingClientRect();
                const middle = box.top + box.height / 2;
                if (Math.abs(middle - scanLine) <= HOLD_TOLERANCE_PX) {
                    held = entries[index].id;
                    break;
                }
            }

            const last = objectRefs.current[entries.length - 1];
            const isPastLast =
                !!last && last.getBoundingClientRect().bottom < scanLine - HOLD_TOLERANCE_PX;

            setHeldId(held);
            if (held !== null) setPhase("held");
            else if (isPastLast) setPhase("end");
            else if (window.scrollY > 0) setPhase("travelling");
            else setPhase("rest");
        }

        function handleScroll() {
            if (frame === null) frame = requestAnimationFrame(locate);
        }

        locate();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (frame !== null) cancelAnimationFrame(frame);
            if (settle !== null) clearTimeout(settle);
        };
    }, [entries]);

    useEffect(() => {
        if (heldId === null || decisions[heldId] !== undefined) return;
        const entry = entries.find((candidate) => candidate.id === heldId);
        if (entry === undefined) return;
        const hunt = setTimeout(() => {
            setDecisions((current) => ({
                ...current,
                [heldId]: entry.state === "Kept" ? "kept" : "debris",
            }));
        }, HUNT_MS);
        return () => clearTimeout(hunt);
    }, [heldId, decisions, entries]);

    const held = entries.find((entry) => entry.id === heldId) ?? null;
    const decision: Decision | undefined = held !== null ? decisions[held.id] : undefined;
    let reading: Reading;
    if (phase === "held" && held !== null) reading = decision ?? "hunting";
    else if (phase === "travelling") reading = "searching";
    else if (phase === "end") reading = "end";
    else reading = "rest";

    const captured = entries.filter((entry) => decisions[entry.id] === "kept");
    const mass = captured.length;

    const hasImage = held !== null && held.image !== null && !failedImages.includes(held.id);
    const hasArtifact = held !== null && (hasImage || held.snippet !== null);
    const isDissolved = held !== null && (dissolvedId === held.id || !hasArtifact);

    function handleDissolve() {
        if (held !== null) setDissolvedId(held.id);
    }

    function handleImageError(id: string) {
        setFailedImages((current) => (current.includes(id) ? current : [...current, id]));
    }

    return (
        <div ref={scanRef} className={styles.scan} data-reading={reading} data-trail-zone>
            <div className={styles.field} aria-hidden="true">
                {meteors.map((meteor, index) => (
                    <span
                        key={`meteor-${index}`}
                        className={styles.meteor}
                        style={
                            {
                                left: `${meteor.left}%`,
                                "--length": `${meteor.length}px`,
                                "--brightness": meteor.brightness,
                                animationDuration: `${meteor.seconds}s`,
                                animationDelay: `${meteor.delay}s`,
                            } as CSSProperties
                        }
                    />
                ))}
            </div>

            <ol className={styles.passages}>
                {drifts.map((drift, index) => (
                    <span
                        key={`drift-${index}`}
                        className={styles.drift}
                        aria-hidden="true"
                        style={
                            {
                                left: `${drift.left}%`,
                                "--slot": drift.slot,
                                "--depth": drift.depth,
                                rotate: `${drift.turn}deg`,
                            } as CSSProperties
                        }
                    >
                        <Matter era={drift.era} variant={drift.variant} />
                    </span>
                ))}
                {entries.map((entry, index) => (
                    <li key={entry.id} className={styles.passage}>
                        <span
                            ref={(element) => {
                                objectRefs.current[index] = element;
                            }}
                            className={styles.object}
                            data-decision={decisions[entry.id] ?? "unscanned"}
                        >
                            <Matter era={eraOf(entry.stratum)} variant={index} />
                        </span>
                    </li>
                ))}
            </ol>

            <div className={styles.sight} data-reading={reading} data-sight aria-hidden="true">
                <span className={styles.beam} />
                <span className={styles.lockOn} />
            </div>

            <div
                className={styles.body}
                style={{ "--mass": mass } as CSSProperties}
                aria-hidden="true"
            >
                <span className={styles.planet} />
                <span className={styles.ring}>
                    {captured.map((entry, index) => (
                        <span
                            key={entry.id}
                            className={styles.moon}
                            style={{ "--angle": `${index * 137.5}deg` } as CSSProperties}
                        >
                            <Matter era={eraOf(entry.stratum)} variant={index} />
                        </span>
                    ))}
                </span>
                <span className={styles.massLabel}>
                    Accreted {String(mass).padStart(2, "0")}
                </span>
            </div>

            <aside className={styles.hud} data-reading={reading} aria-live="polite" data-trail-off>
                <BootScreen objectCount={entries.length} source={source} reading={reading}>
                    {reading === "rest" && <span className={styles.hudHint}>Scroll to travel</span>}

                    {reading === "searching" && <span className={styles.hudHint}>Scanning…</span>}

                    {reading === "hunting" && held !== null && (
                        <TextScrambler
                            key={`${held.id}-hunting`}
                            text="Decoding"
                            className={styles.hudTitle}
                            textColor="var(--muted)"
                            scrambleColor="var(--muted)"
                            durationMs={HUNT_MS}
                        />
                    )}

                    {(reading === "kept" || reading === "debris") && held !== null && (
                        <>
                            <span className={styles.hudWhen}>{held.when}</span>
                            <TextScrambler
                                key={`${held.id}-${reading}`}
                                text={held.title}
                                className={styles.hudTitle}
                                textColor={reading === "debris" ? "var(--muted)" : "var(--signal)"}
                                scrambleColor="var(--muted)"
                                durationMs={BAR_MS}
                            />

                            {reading === "kept" && !isDissolved && (
                                <button
                                    key={`${held.id}-artifact`}
                                    type="button"
                                    className={styles.artifactButton}
                                    onClick={handleDissolve}
                                    aria-label={`${held.title}: read the record`}
                                >
                                    {hasImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={held.image ?? ""}
                                            alt=""
                                            className={styles.artifact}
                                            onError={() => handleImageError(held.id)}
                                        />
                                    ) : (
                                        <pre className={styles.snippet}>{held.snippet}</pre>
                                    )}
                                    <span className={styles.hudHint}>Tap to read</span>
                                </button>
                            )}

                            {(isDissolved || reading === "debris") && (
                                <div key={`${held.id}-readout`} className={styles.readout}>
                                    <p>{held.whatChanged}</p>
                                    {reading === "kept" && held.credit && (
                                        <p className={styles.hudCredit}>{held.credit}</p>
                                    )}
                                    {reading === "kept" && held.link && (
                                        <a href={held.link} className={styles.hudLink}>
                                            Open →
                                        </a>
                                    )}
                                    {reading === "debris" && (
                                        <p className={styles.hudLock}>
                                            Signal lost. Locks when: {held.lockCondition}
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {reading === "end" && (
                        <>
                            <span className={styles.hudHint}>End of record</span>
                            <p>
                                Read from {source === "substrate" ? "the substrate" : "cache"} ·{" "}
                                {keptCount} kept · {debrisCount} debris
                            </p>
                            <Link href="/before" className={styles.hudLink}>
                                The index this page grew out of →
                            </Link>
                        </>
                    )}
                </BootScreen>
            </aside>
        </div >
    );
}