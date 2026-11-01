"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import TextScrambler from "./TextScrambler";
import type { Entry } from "../lib/record";
import styles from "./Accretion.module.css";

const BAR_MS = 1000;
const HUNT_MS = 2 * BAR_MS;
const HOLD_TOLERANCE_PX = 6;
const COMETS_PER_ENTRY = 8;

type Decision = "kept" | "debris";
type Phase = "rest" | "travelling" | "held" | "end";
type Reading = "rest" | "searching" | "hunting" | "kept" | "debris" | "end";

type Comet = {
    left: number;
    top: number;
    length: number;
};

function showerOf(count: number): Comet[] {
    let state = 97;
    const next = () => {
        state = (state * 16807) % 2147483647;
        return state / 2147483647;
    };
    return Array.from({ length: count }, () => {
        const side = next() < 0.5 ? -1 : 1;
        return {
            left: 50 + side * (10 + next() * 38),
            top: next() * 100,
            length: 6 + Math.round(next() * 18),
        };
    });
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
    const objectRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const shower = useMemo(() => showerOf(entries.length * COMETS_PER_ENTRY), [entries.length]);

    useEffect(() => {
        let frame: number | null = null;

        function locate() {
            frame = null;
            const scanLine = window.innerHeight / 2;

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
    const mass = Object.values(decisions).filter((decision) => decision === "kept").length;

    return (
        <div className={styles.scan}>
            <ol className={styles.passages}>
                {shower.map((comet, index) => (
                    <span
                        key={`comet-${index}`}
                        className={styles.comet}
                        aria-hidden="true"
                        style={{
                            left: `${comet.left}%`,
                            top: `${comet.top}%`,
                            height: `${comet.length}px`,
                        }}
                    />
                ))}
                {entries.map((entry, index) => (
                    <li key={entry.id} className={styles.passage}>
                        <span
                            ref={(element) => {
                                objectRefs.current[index] = element;
                            }}
                            className={styles.object}
                            data-decision={decisions[entry.id] ?? "unscanned"}
                        />
                    </li>
                ))}
            </ol>

            <div className={styles.sight} data-reading={reading} aria-hidden="true">
                <span className={styles.sightline} />
                <span className={styles.reticle} />
            </div>

            <div
                className={styles.body}
                style={{ "--mass": mass } as CSSProperties}
                aria-hidden="true"
            />

            <aside className={styles.hud} data-reading={reading} aria-live="polite">
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
            </aside>
        </div>
    );
}