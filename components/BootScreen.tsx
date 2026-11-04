"use client";

/*
 * BootScreen — build #13 of the closer ladder.
 * Reference: Retro Screen Effect by Blue Jackson, Framer Marketplace
 * (bought). What's mine: on natmoges.com the screen came pinned in his
 * photo of a Mac. I ran its code mode as a boot terminal typing my four
 * principles in my Signal green, made its output frame a kernel status
 * bar, and pasted the log three times because it never loops. Here there's
 * no Mac. Accretion's HUD is the computer: the satellite gathers the
 * signal, and the HUD is where you read it.
 *
 * Powers on Accretion's HUD like a CRT. It boots, types a kernel log
 * written from the record it's about to read, then hands over to the scan.
 *
 * THE LAYERS, bottom to top: the HUD card · an inner shadow · the log,
 * with its line numbers · a phosphor glow on the text · scanlines with one
 * bright band drifting up · a glass sheen across the top. Each is its own
 * layer and switches on its own.
 *
 * THE KNOBS, carried over from my natmoges.com settings: line numbers on ·
 * glow 00FF41 at 0.1 · scanlines Heavy, 1 px, black at 0.3, band speed
 * 0.8 · inner shadow 1.2 · reflection 0.1 at 0.8, Overlay. Text is
 * Signal, 22C55E. His glitch colours, FF0000 and 00FFFF, on one letter.
 *
 * BEFORE LOAD: the server sends the HUD dark, powered off.
 *
 * THE INSTANT IT ARRIVES: on desktop it waits for the preloader to leave,
 * the same handoff StarCloud uses; on a phone it starts right away. The
 * screen flickers on and the log starts typing, each line landing on
 * SignalLocation's tick.
 *
 * DURING: it types for about 8 seconds. The record's real counts print as
 * they're read, and SOURCE says LIVE, or CACHE if the substrate didn't
 * answer.
 *
 * NOT / NAT: once line two is typed, its O glitches to an A and back, a
 * red and cyan split for a tick or two, on its own beat, so it reads NOT
 * FROM THIS PLANET, then NAT FROM THIS PLANET, then NOT again.
 *
 * SCROLLING MID-BOOT: a boot is a boot. It keeps typing, but faster, and
 * the scan waits for it to finish before the HUD shows Decoding.
 *
 * AT THE END: "AWAITING SIGNAL", and the status bar reads Scroll to
 * travel. The log stays up, still glitching, until the first scroll folds
 * it away into Scanning.
 *
 * LOCKED IN: when a scan locks and decodes as kept, the CRT settles.
 * Scanlines, sheen and glow fade out and the full card reads clean. Back
 * to searching, the screen comes back on.
 *
 * DEBRIS: the signal is lost, not locked, so the CRT stays on over the
 * grey card: static for a lost signal.
 *
 * A REPEAT: every refresh boots it again.
 *
 * FAILURE: if the code never arrives, the full log appears printed, so
 * the HUD is never blank.
 *
 * REDUCED MOTION: the log appears whole, nothing drifts, flickers or
 * glitches (it reads NOT), and the HUD moves straight on to Scroll to
 * travel.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./BootScreen.module.css";

// Accretion's tempo: SignalLocation's one-second bar of eight ticks.
const BAR_MS = 1000;
const TICK_MS = BAR_MS / 8;
const CHAR_MS = 20;

type BootPhase = "off" | "typing" | "done";

// "LINK: SATELLITE" + dots + "OK", so every value lines up in one column.
function row(label: string, value: string): string {
    return `${label} `.padEnd(32, ".") + ` ${value}`;
}

// The kernel log. Lines 4 and 5 are read from the record, never written by hand.
function bootLinesOf(objectCount: number, source: "substrate" | "cache"): string[] {
    return [
        "// BOOT: NATFTP_OS :: ACCRETION",
        "// NOT FROM THIS PLANET. READING THE RECORD.",
        row("LINK: SATELLITE", "OK"),
        row("SOURCE: SUBSTRATE", source === "substrate" ? "LIVE" : "CACHE"),
        row(`INDEX: ${objectCount} OBJECTS`, "OLDEST FIRST"),
        "GATE: PROVEN → KEPT · NOT YET → DEBRIS",
        "POLISH: OFF · SEAMS: PUBLISHED",
        "// DIRECTIVES: SYSTEMS · FLOW · SYNTHESIS · INTENT",
        "// STATE: COHERENT. AWAITING SIGNAL.",
    ];
}

export interface BootScreenProps {
    objectCount: number;
    source: "substrate" | "cache";
    reading: string;
    children: ReactNode;
}

export default function BootScreen({ objectCount, source, reading, children }: BootScreenProps) {
    const [bootPhase, setBootPhase] = useState<BootPhase>("off");
    const [typedCount, setTypedCount] = useState(0);
    const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const log = bootLinesOf(objectCount, source).join("\n");

    useEffect(() => {
        let count = 0;

        function typeNext() {
            count += 1;
            if (count === 1) setBootPhase("typing");
            setTypedCount(count);
            if (count >= log.length) {
                setBootPhase("done");
                return;
            }
            // A line lands on the tick: pause one tick after each line break.
            const delay = log[count - 1] === "\n" ? TICK_MS : CHAR_MS;
            typingRef.current = setTimeout(typeNext, delay);
        }

        typingRef.current = setTimeout(typeNext, TICK_MS);
        return () => {
            if (typingRef.current !== null) clearTimeout(typingRef.current);
        };
    }, [log]);

    const isLogShown = bootPhase !== "done" || reading === "rest";
    const typedLines = log.slice(0, typedCount).split("\n");

    return (
        <div className={styles.screen} data-reading={reading} data-boot={bootPhase}>
            <span className={styles.shadow} aria-hidden="true" />
            <div className={styles.content}>
                {isLogShown && (
                    <ol className={styles.log} aria-label="Boot log">
                        {typedLines.map((line, index) => (
                            <li key={index} className={styles.line}>
                                <span className={styles.lineNumber} aria-hidden="true">
                                    {index + 1}
                                </span>
                                <span className={styles.lineText}>
                                    {line}
                                    {bootPhase === "typing" && index === typedLines.length - 1 && (
                                        <span className={styles.cursor} aria-hidden="true" />
                                    )}
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
                {bootPhase === "done" && children}
            </div>
            <span className={styles.scanlines} aria-hidden="true">
                <span className={styles.band} />
            </span>
            <span className={styles.sheen} aria-hidden="true" />
        </div>
    );
}