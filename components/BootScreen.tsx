"use client";

/*
 * BootScreen — build #13 of the closer ladder.
 * Reference: Retro Screen Effect by Blue Jackson, Framer Marketplace
 * (bought). What's mine: on natmoges.com the screen came pinned in his
 * photo of a Mac. I ran its code mode as a boot terminal typing my four
 * principles in my Signal green, made its output frame a kernel status
 * bar, and pasted the log three times because it never loops. Here there's
 * no Mac. Accretion's HUD is the computer and the satellite is its
 * antenna: nothing in the sky works until the HUD brings it online.
 *
 * Powers on Accretion's HUD like a CRT. It boots, types a kernel log
 * written from the record it's about to read, and brings the scene online
 * line by line, then hands over to the scan.
 *
 * THE LAYERS, bottom to top: the HUD card · an inner shadow · the log,
 * with its line numbers · a phosphor glow on the signals · scanlines with
 * one soft band of light rising · a glass sheen across the top. Each is
 * its own layer and switches on its own.
 *
 * THE KNOBS, carried over from my natmoges.com settings: line numbers on ·
 * glow 00FF41 at 0.1 · scanlines Heavy, 1 px, black at 0.3, band speed
 * 0.8 · inner shadow 1.2 · reflection 0.1 at 0.8, Overlay. His glitch
 * colours, FF0000 and 00FFFF, on one letter.
 *
 * ONE ACCENT: the words are grey. Only readings that are signals light up
 * in Signal green: OK, LIVE, the object count, KEPT, AWAITING SIGNAL.
 * CACHE stays white, because it isn't live; DEBRIS is debris grey.
 *
 * BEFORE LOAD: the server sends the HUD powered off, a dim line where the
 * screen will be.
 *
 * THE INSTANT IT ARRIVES: on desktop it waits for the preloader to leave;
 * on a phone it starts right away. The tube opens from its line to full
 * height in a tick, already the size it will stay.
 *
 * DURING: about 7 seconds. Lines start on SignalLocation's tick, the dot
 * leaders run out fast, and each reading drops whole on the next tick,
 * quantized like a note on the grid.
 *
 * THE SCENE COMES ONLINE: until LINK: SATELLITE reads OK, the satellite's
 * beacon is dark. Until the GATE line prints, the body's count is unlit.
 * Until AWAITING SIGNAL, the scan can't hunt or lock: objects pass
 * unread.
 *
 * NOT / NAT: once line two is typed, the word reads in and out on every
 * bar. NOT, in bright white, is the thinking: not from this planet. NAT,
 * lit Signal green, is the name and the systems. Three ticks each, with a
 * torn red and cyan tick between them.
 *
 * SCROLLING MID-BOOT: a boot is a boot. It keeps typing, twice as fast,
 * and the scan waits for it to finish.
 *
 * AT THE END: "AWAITING SIGNAL", and the status bar reads Scroll to
 * travel. The log stays up, still glitching, until the first move off
 * rest, at least a bar after the boot: then the tube power-cycles,
 * squashing to its line and opening again on the scan.
 *
 * LOCKED IN: when a scan locks and decodes as kept, the CRT settles.
 * Shadow, scanlines and sheen fade out and the card reads clean. Back to
 * searching, the screen comes back on.
 *
 * DEBRIS: the signal is lost, not locked, so the CRT stays on, with the
 * scanlines stuttering: static for a lost signal.
 *
 * A REPEAT: every refresh boots it again.
 *
 * FAILURE: if the code never arrives, eight seconds in the tube opens on
 * its own and the full log is there, printed.
 *
 * PHONE: the log steps down a size, and a reading never breaks in two.
 *
 * REDUCED MOTION: Accretion becomes the plain record list with no HUD, so
 * nothing boots and nothing waits on it.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import styles from "./BootScreen.module.css";
// Accretion's tempo, from the one clock: a one-second bar of eight ticks.
import { BAR_MS, TICK_MS } from "../lib/tempo";

const CHAR_MS = 20;
const DOT_MS = 5;
const HURRY = 2;

// Where the preloader never shows (phones, tablets), the boot doesn't wait for it.
const NO_PRELOADER = "(hover: none) and (pointer: coarse), (max-width: 809px)";

type BootPhase = "off" | "warming" | "typing" | "done";
export type BootStage = "off" | "linked" | "gated" | "online";

// One accent: grey for the words, Signal green only for readings that are signals.
type Tone = "comment" | "word" | "label" | "dots" | "value" | "signal" | "debris";

type Segment = {
    text: string;
    tone: Tone;
    lands?: boolean; // appears whole, on the next tick
    glitch?: boolean; // the O that reads A
};

type Line = { segments: Segment[]; stage?: BootStage };

type Step = { count: number; at: number; stage?: BootStage };

// "LINK: SATELLITE" + dot leaders + "OK", so every reading lines up in one column.
function row(label: string, value: string, tone: Tone): Segment[] {
    return [
        { text: `${label} `, tone: "label" },
        { text: ".".repeat(Math.max(3, 31 - label.length)), tone: "dots" },
        { text: ` ${value}`, tone, lands: true },
    ];
}

// The kernel log. Lines 4 and 5 are read from the record, never written by hand.
function bootLinesOf(objectCount: number, source: "substrate" | "cache"): Line[] {
    const isLive = source === "substrate";
    return [
        { segments: [{ text: "// BOOT: NATFTP_OS :: ACCRETION", tone: "comment" }] },
        {
            segments: [
                { text: "// ", tone: "comment" },
                { text: "N", tone: "word" },
                { text: "O", tone: "word", glitch: true },
                { text: "T", tone: "word" },
                { text: " FROM THIS PLANET. READING THE RECORD.", tone: "comment" },
            ],
        },
        { segments: row("LINK: SATELLITE", "OK", "signal"), stage: "linked" },
        { segments: row("SOURCE: SUBSTRATE", isLive ? "LIVE" : "CACHE", isLive ? "signal" : "value") },
        { segments: row("INDEX: OLDEST FIRST", `${objectCount} OBJECTS`, "signal") },
        {
            segments: [
                { text: "GATE: PROVEN → ", tone: "label" },
                { text: "KEPT", tone: "signal", lands: true },
                { text: " · NOT YET → ", tone: "label" },
                { text: "DEBRIS", tone: "debris", lands: true },
            ],
            stage: "gated",
        },
        {
            segments: [
                { text: "POLISH: ", tone: "label" },
                { text: "OFF", tone: "value", lands: true },
                { text: " · SEAMS: ", tone: "label" },
                { text: "PUBLISHED", tone: "value", lands: true },
            ],
        },
        { segments: [{ text: "// DIRECTIVES: SYSTEMS · FLOW · SYNTHESIS · INTENT", tone: "comment" }] },
        {
            segments: [
                { text: "// STATE: ", tone: "comment" },
                { text: "COHERENT.", tone: "value", lands: true },
                { text: " AWAITING SIGNAL.", tone: "signal" },
            ],
            stage: "online",
        },
    ];
}

// The score: every character's moment on boot time. Lines start on a tick,
// readings land on the next tick, dot leaders run out fast.
function stepsOf(lines: Line[]): Step[] {
    const steps: Step[] = [];
    const nextTick = (time: number) => Math.floor(time / TICK_MS) * TICK_MS + TICK_MS;
    let time = 0;
    let count = 0;
    lines.forEach((line, index) => {
        if (index > 0) time = nextTick(time);
        for (const segment of line.segments) {
            if (segment.lands) {
                time = nextTick(time);
                count += segment.text.length;
                steps.push({ count, at: time });
            } else {
                for (let char = 0; char < segment.text.length; char++) {
                    time += segment.tone === "dots" ? DOT_MS : CHAR_MS;
                    count += 1;
                    steps.push({ count, at: time });
                }
            }
        }
        if (line.stage) steps[steps.length - 1].stage = line.stage;
    });
    return steps;
}

// Where each segment starts in the score, so the typed count can be split across them.
function startsOf(lines: Line[]): number[][] {
    const starts: number[][] = [];
    let position = 0;
    for (const line of lines) {
        const lineStarts: number[] = [];
        for (const segment of line.segments) {
            lineStarts.push(position);
            position += segment.text.length;
        }
        starts.push(lineStarts);
    }
    return starts;
}

export interface BootScreenProps {
    objectCount: number;
    source: "substrate" | "cache";
    reading: string;
    onBootStage: (stage: BootStage) => void;
    children: ReactNode;
}

export default function BootScreen({
    objectCount,
    source,
    reading,
    onBootStage,
    children,
}: BootScreenProps) {
    const [bootPhase, setBootPhase] = useState<BootPhase>("off");
    const [typedCount, setTypedCount] = useState(0);
    const [isNat, setIsNat] = useState(false);
    const [isSplit, setIsSplit] = useState(false);
    const [hasFolded, setHasFolded] = useState(false);
    const [isCycling, setIsCycling] = useState(false);
    const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isHurriedRef = useRef(false);
    const doneAtRef = useRef(0);

    const lines = useMemo(() => bootLinesOf(objectCount, source), [objectCount, source]);
    const steps = useMemo(() => stepsOf(lines), [lines]);
    const starts = useMemo(() => startsOf(lines), [lines]);
    const total = steps[steps.length - 1].count;

    // THE BOOT: wait for the preloader to leave, warm the tube for a tick, then type the score.
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            typingRef.current = setTimeout(() => {
                setTypedCount(total);
                setBootPhase("done");
                onBootStage("online");
            }, 0);
            return () => {
                if (typingRef.current !== null) clearTimeout(typingRef.current);
            };
        }

        let index = 0;

        function handleHurry() {
            isHurriedRef.current = true;
        }

        function typeNext() {
            const step = steps[index];
            setTypedCount(step.count);
            if (step.stage) onBootStage(step.stage);
            index += 1;
            if (index >= steps.length) {
                doneAtRef.current = performance.now();
                setBootPhase("done");
                window.removeEventListener("scroll", handleHurry);
                return;
            }
            const speed = isHurriedRef.current ? HURRY : 1;
            typingRef.current = setTimeout(typeNext, (steps[index].at - step.at) / speed);
        }

        function isPreloaderUp() {
            if (window.matchMedia(NO_PRELOADER).matches) return false;
            return document.querySelector('[role="status"][data-phase="armed"]') !== null;
        }

        function powerOn() {
            if (isPreloaderUp()) {
                typingRef.current = setTimeout(powerOn, TICK_MS);
                return;
            }
            setBootPhase("warming");
            typingRef.current = setTimeout(() => {
                setBootPhase("typing");
                typeNext();
            }, 2 * TICK_MS);
        }

        window.addEventListener("scroll", handleHurry, { passive: true });
        typingRef.current = setTimeout(powerOn, 0);
        return () => {
            window.removeEventListener("scroll", handleHurry);
            if (typingRef.current !== null) clearTimeout(typingRef.current);
        };
    }, [steps, total, onBootStage]);

    // THE FOLD: the first move off rest, at least a bar after the boot, power-cycles the tube.
    useEffect(() => {
        if (bootPhase !== "done" || reading === "rest" || hasFolded) return;
        const wait = Math.max(0, doneAtRef.current + BAR_MS - performance.now());
        let swap: ReturnType<typeof setTimeout> | null = null;
        const off = setTimeout(() => {
            setIsCycling(true);
            swap = setTimeout(() => {
                setHasFolded(true);
                setIsCycling(false);
            }, 2 * TICK_MS);
        }, wait);
        return () => {
            clearTimeout(off);
            if (swap !== null) clearTimeout(swap);
        };
    }, [bootPhase, reading, hasFolded]);

    // NOT / NAT: once line two is typed, the word reads in and out on every bar.
    // NOT for three ticks (the thinking, not from this planet), a split tick,
    // NAT for three ticks (the name, the systems) lit as signal, a split tick back.
    const lineTwoEnd = [lines[0], lines[1]]
        .flatMap((line) => line.segments)
        .reduce((sum, segment) => sum + segment.text.length, 0);
    const isLineTwoTyped = typedCount >= lineTwoEnd;
    useEffect(() => {
        if (!isLineTwoTyped || hasFolded) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let tick = 0;
        const beat = setInterval(() => {
            tick = (tick + 1) % 8;
            setIsSplit(tick === 3 || tick === 7);
            setIsNat(tick >= 3 && tick <= 6);
        }, TICK_MS);
        return () => clearInterval(beat);
    }, [isLineTwoTyped, hasFolded]);

    const power = bootPhase === "off" ? "off" : isCycling ? "cycling" : "on";

    return (
        <div
            className={styles.screen}
            data-reading={reading}
            data-boot={bootPhase}
            data-power={power}
            data-word={isSplit ? "split" : isNat ? "nat" : "not"}
        >
            <span className={styles.shadow} aria-hidden="true" />
            <div className={styles.content}>
                {!hasFolded && (
                    <ol className={styles.log} aria-label="Boot log">
                        {lines.map((line, lineIndex) => {
                            const lineStart = starts[lineIndex][0];
                            const isStarted = typedCount > lineStart;
                            const lineText = line.segments.map((segment) => segment.text).join("");
                            const isCursorHere =
                                (bootPhase === "warming" || bootPhase === "typing") &&
                                ((typedCount > lineStart && typedCount <= lineStart + lineText.length) ||
                                    (typedCount === 0 && lineIndex === 0));
                            const parts = line.segments.map((segment, segmentIndex) => {
                                const start = starts[lineIndex][segmentIndex];
                                const shown = Math.max(0, Math.min(segment.text.length, typedCount - start));
                                const typed = segment.glitch && isNat ? "A" : segment.text.slice(0, shown);
                                return (
                                    <span
                                        key={segmentIndex}
                                        className={styles[segment.tone]}
                                    >
                                        {shown > 0 && typed}
                                        {shown < segment.text.length && (
                                            <span className={styles.untyped}>{segment.text.slice(shown)}</span>
                                        )}
                                    </span>
                                );
                            });
                            return (
                                <li key={lineIndex} className={styles.line}>
                                    <span
                                        className={isStarted ? styles.lineNumber : `${styles.lineNumber} ${styles.untyped}`}
                                        aria-hidden="true"
                                    >
                                        {lineIndex + 1}
                                    </span>
                                    <span className={styles.lineText}>
                                        {parts}
                                        {isCursorHere && (
                                            <span className={styles.cursor} aria-hidden="true" />
                                        )}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                )}
                {hasFolded ? (
                    children
                ) : (
                    // The status bar: its slot is held from power-on, so the screen never grows.
                    <div className={styles.status}>{bootPhase === "done" && children}</div>
                )}
            </div>
            <span className={styles.scanlines} aria-hidden="true">
                <span className={styles.band} />
            </span>
            <span className={styles.sheen} aria-hidden="true" />
        </div>
    );
}