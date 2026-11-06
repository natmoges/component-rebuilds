"use client";

/*
 * INTEGRATION PASS, ITEM 5 — the finale.
 * What I found: the planet only grows from what you scan, so whoever
 * skims reaches the end with a small planet, while the end card counts the
 * whole record. Two numbers on one screen that don't agree. And the only
 * way to a full planet was to sit through every object. Here the end of
 * the record is where the two numbers meet, and the record itself makes
 * them meet: it never pretends you did the scanning.
 *
 * THE TRIGGER: you reach the end of the record. Travelling there is the
 * price. Scrolling there fast still counts, because scrolling is travel.
 *
 * THE REVEAL: the HUD says what's happening, "Accreting the remaining 24",
 * and every kept object you didn't scan falls into the planet as one
 * volley, a tick apart, the whole volley inside two bars. The planet grows
 * as they land, and both moons name themselves once their strata are all
 * in. Debris doesn't fall. The end card counts it.
 *
 * TWO COUNTS, KEPT HONEST: the record's objects are revealed, not scanned.
 * Your count stays yours, SCANNED 12 / 43, and the planet now carries the
 * record's kept. Revealed and scanned are never added together.
 *
 * NOTHING TO SCAN TWICE: once the record has revealed itself, the ride
 * back is free in both directions. Nothing hunts, and the satellite only
 * drifts. (Nov 5, follow-up: but the record doesn't vanish. What the
 * record revealed, or this browser remembered, stays in its passage,
 * marked as taken, and passing one shows its card at once: no hunt, no
 * lock, no count. A finished record reads like a library. And what you
 * scanned yourself flies into the planet as before, then settles back into
 * its passage, taken, once it's off screen, so the record is all there on
 * the way back.)
 *
 * IF YOU SCANNED EVERYTHING: there's nothing left to reveal, so the
 * volley doesn't fire. The end card simply agrees with you.
 *
 * REMEMBERED: the page remembers this browser finished the record. A
 * return visit opens on the grown planet, both moons named, with RESCAN in
 * the HUD. If the record has grown since (proof arrived in Notion), only
 * the new kept objects are left to find.
 *
 * RESCAN: everything goes back to zero, the planet included, and you
 * travel the record again from wherever you are.
 *
 * THE KNOBS: the volley a tick apart, squeezed to fit two bars · the label
 * "Accreting the remaining N" · the memory keyed to the record's kept
 * objects.
 *
 * FAILURE: if this browser won't keep anything (private window, storage
 * blocked), every visit is a first visit. The finale still plays. From
 * the stored copy, it reveals the stored copy's kept.
 *
 * PHONE: the same finale, and RESCAN is a tap.
 *
 * REDUCED MOTION: unchanged. The plain record list has no planet to fill.
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import TextScrambler from "./TextScrambler";
import BootScreen, { type BootStage } from "./BootScreen";
import Back2Top, { type Back2TopHandle } from "./Back2Top";
import type { Entry } from "../lib/record";
import { chapterOf } from "../lib/chapters";
import styles from "./Accretion.module.css";
import dynamic from "next/dynamic";
import { BAR_MS, TICK_MS, HUNT_MS, countsOf, type Decision } from "../lib/tempo";
import { REPO_URL, PORTFOLIO_URL, CONTACT_URL } from "../lib/links";

const HeroOrbit = dynamic(() => import("./HeroOrbit"), { ssr: false });

const HOLD_TOLERANCE_PX = 6;
const DRIFT_PER_ENTRY = 5;
// Integration item 9: fewer meteors, each on its own cycle, so the sky has weather, not rain.
const METEOR_COUNT = 10;
// The breath before each new stratum, in vh (item 9).
const BREATH_VH = 20;

// The finale's volley fits inside two bars, however many objects are left.
const VOLLEY_MS = 2 * BAR_MS;
// What this browser remembers: every object the record has accounted for, and how.
const MEMORY_KEY = "accretion.finished.v1";

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
    tilt: number;
    drift: number;
    isBright: boolean;
};

function meteorsOf(count: number): Meteor[] {
    const next = seeded(41);
    // Meteors fall in the outer lanes only, so the centre stays clear for the beam. Each has its
    // own angle (one shared direction, down and left), speed, length and brightness, and spends
    // most of its cycle unseen, so they come rarely; every fifth is a bright one with a teal tail.
    return Array.from({ length: count }, (_, index) => {
        const tilt = 2 + next() * 12;
        const isBright = index % 5 === 2;
        return {
            left: next() < 0.5 ? next() * 28 : 72 + next() * 34,
            length: (isBright ? 70 : 20) + Math.round(next() * 60),
            seconds: 6 + next() * 9,
            delay: -next() * 15,
            brightness: isBright ? 0.75 : 0.15 + next() * 0.3,
            tilt,
            drift: -Math.tan((tilt * Math.PI) / 180) * 140,
            isBright,
        };
    });
}

export interface ScanProps {
    entries: Entry[];
    source: "substrate" | "cache";
}

// A moon names itself once every kept object in its stratum is in the planet, scanned or revealed.
function isStratumProven(entries: Entry[], inPlanet: Record<string, Decision>, era: string): boolean {
    const kept = entries.filter((entry) => eraOf(entry.stratum) === era && entry.state === "Kept");
    return kept.length > 0 && kept.every((entry) => inPlanet[entry.id] === "kept");
}

function decisionOf(entry: Entry): Decision {
    return entry.state === "Kept" ? "kept" : "debris";
}

// The memory is only trusted where the record still agrees with it: an object that was debris
// and has since been proven in Notion is left out, so the next visit finds it and keeps it.
function readMemory(entries: Entry[]): Record<string, Decision> {
    try {
        const stored = JSON.parse(window.localStorage.getItem(MEMORY_KEY) ?? "{}") as Record<string, Decision>;
        const agreed: Record<string, Decision> = {};
        for (const entry of entries) {
            if (stored[entry.id] === decisionOf(entry)) agreed[entry.id] = stored[entry.id];
        }
        return agreed;
    } catch {
        return {};
    }
}

function writeMemory(done: Record<string, Decision>) {
    try {
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify(done));
    } catch {
        // A browser that won't keep anything just gets a first visit every time.
    }
}

function forgetMemory() {
    try {
        window.localStorage.removeItem(MEMORY_KEY);
    } catch {
        // Nothing was kept, so there's nothing to forget.
    }
}

// Where a record's link goes, named (integration item 10), so "Open" says what it opens. A link back
// to this page itself is dropped: it would only reload the record you're reading.
const SITE_HOST = "component-rebuilds.vercel.app";
function destinationOf(link: string): string | null {
    let url: URL;
    try {
        url = new URL(link);
    } catch {
        return null;
    }
    const isThisSite = url.hostname === SITE_HOST || url.origin === window.location.origin;
    if (isThisSite) return url.pathname === "/" || url.pathname === window.location.pathname ? null : url.pathname;
    const host = url.hostname.replace(/^www\./, "");
    const parts = host.split(".");
    return parts.length > 2 && !host.endsWith(".vercel.app") ? parts.slice(-2).join(".") : host;
}

export default function Scan({ entries, source }: ScanProps) {
    const [heldId, setHeldId] = useState<string | null>(null);
    const [phase, setPhase] = useState<Phase>("rest");
    const [decisions, setDecisions] = useState<Record<string, Decision>>({});
    // What the record accounted for without you: revealed at the finale, or remembered.
    const [revealed, setRevealed] = useState<Record<string, Decision>>({});
    const [volley, setVolley] = useState<string[] | null>(null);
    // How the planet takes what arrives: a scanned object after its absorb, the rest at once.
    const [arrival, setArrival] = useState<"absorb" | "now">("absorb");
    const [dissolvedId, setDissolvedId] = useState<string | null>(null);
    // Integration item 10: the object the satellite is decoding. Once it's acquired, its hunt
    // runs to the end even if you scroll on, so a brisk scroll still reads; whatever passes while
    // the satellite is busy is left for the finale. And the HUD reads what it last read (the
    // focus) until the next object is acquired, instead of blinking back to "Scanning…".
    const [targetId, setTargetId] = useState<string | null>(null);
    const targetRef = useRef<string | null>(null);
    const [focusId, setFocusId] = useState<string | null>(null);
    const focusRef = useRef<string | null>(null);
    // When the focus's card appeared: it holds a bar, so its title decodes once, before the HUD moves on.
    const cardSinceRef = useRef<number | null>(null);
    // The object whose decision just landed: its card takes the HUD next, ahead of the new target.
    const landedRef = useRef<string | null>(null);
    const isOnlineRef = useRef(false);
    const [failedImages, setFailedImages] = useState<string[]>([]);
    const [bootStage, setBootStage] = useState<BootStage>("off");
    const scanRef = useRef<HTMLDivElement | null>(null);
    const fieldRef = useRef<HTMLDivElement | null>(null);
    const driftRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const objectRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const doneRef = useRef<Record<string, Decision>>({});
    const scannedRef = useRef<Record<string, Decision>>({});
    // Objects you scanned whose flight is over and whose passage has left the screen: they settle
    // back into place, taken, so the record is all there on the way back.
    const settledRef = useRef<Record<string, true>>({});
    const [settled, setSettled] = useState<Record<string, true>>({});
    const locateRef = useRef<(() => void) | null>(null);
    const heldRef = useRef<string | null>(null);
    // The finale waits until you've travelled into the record, so a Rescan at the end doesn't refire it.
    const isFinaleArmedRef = useRef(true);
    // The chapter you're in (integration item 9): the stratum of the passage at the lock.
    const [chapter, setChapter] = useState<string | null>(null);
    const chapterRef = useRef<string | null>(null);
    // The rocket (build #3): while it carries you, the scan stands down.
    const rocketRef = useRef<Back2TopHandle>(null);
    const isRidingRef = useRef(false);
    const [isRiding, setIsRiding] = useState(false);
    const hudRef = useRef<HTMLElement | null>(null);
    const drifts = useMemo(() => driftOf(entries), [entries]);
    const meteors = useMemo(() => meteorsOf(METEOR_COUNT), []);
    // The record's average passage, so the drift matter keeps its era's stretch now that passages
    // vary (integration item 9): kept 70vh, debris 60vh, a 20vh breath at each new stratum, and the
    // object itself (about 6.5vh).
    const pitchVh = useMemo(() => {
        if (entries.length === 0) return 90;
        const opens = entries.filter((entry, index) => index === 0 || entries[index - 1].stratum !== entry.stratum).length;
        const kept = entries.filter((entry) => entry.state === "Kept").length;
        const total = kept * 70 + (entries.length - kept) * 60 + opens * BREATH_VH + entries.length * 6.5;
        return total / entries.length;
    }, [entries]);

    // Every visit starts at the top, where the boot is (item 10). A reload used to put you back mid-record
    // under a replaying boot, with the count back at zero.
    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const isMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let frame: number | null = null;
        let settle: ReturnType<typeof setTimeout> | null = null;
        let lastY = window.scrollY;
        let lastTime = performance.now();
        let cardHold: ReturnType<typeof setTimeout> | null = null;

        function locate() {
            frame = null;
            const scanLine = window.innerHeight / 2;

            // An object already accounted for, scanned or revealed, is gone into the planet
            // (or tumbled away), so it never locks again. The one you just scanned stays held
            // until you move off it; a revealed one is never held.
            const decided = doneRef.current;
            const scanned = scannedRef.current;
            let held: string | null = null;
            // While the rocket carries you, nothing is held, so nothing hunts.
            // A scanned object settles once its passage is off screen, so it never pops back in view.
            const settling: string[] = [];
            for (let index = 0; index < entries.length; index++) {
                const id = entries[index].id;
                if (scanned[id] === undefined || settledRef.current[id] || id === heldRef.current) continue;
                const passage = objectRefs.current[index]?.parentElement;
                if (!passage) continue;
                const box = passage.getBoundingClientRect();
                if (box.bottom < 0 || box.top > window.innerHeight) settling.push(id);
            }
            if (settling.length > 0) {
                const next = { ...settledRef.current };
                for (const id of settling) next[id] = true;
                settledRef.current = next;
                setSettled(next);
            }

            for (let index = 0; index < entries.length && !isRidingRef.current; index++) {
                const object = objectRefs.current[index];
                if (!object) continue;
                const id = entries[index].id;
                const isStillHeld = id === heldRef.current && scanned[id] !== undefined;
                // An object you've just scanned is in flight, so it can't be held. Once it has
                // settled back into its passage, it can be passed and read, like what the record revealed.
                if (scanned[id] !== undefined && !settledRef.current[id] && !isStillHeld) continue;
                const box = object.getBoundingClientRect();
                const middle = box.top + box.height / 2;
                if (Math.abs(middle - scanLine) <= HOLD_TOLERANCE_PX) {
                    held = entries[index].id;
                    break;
                }
            }

            // Measured on the last object's row, which never moves: the object itself can
            // tumble back down past the scan line once it's decided.
            const last = objectRefs.current[entries.length - 1]?.parentElement;
            const isPastLast =
                !!last && last.getBoundingClientRect().bottom < scanLine - HOLD_TOLERANCE_PX;
            // The chapter: the stratum of the last passage that has reached the lock. None before
            // the first, none past the last, and none while the rocket carries you (item 9).
            let reached: string | null = null;
            if (!isRidingRef.current && !isPastLast) {
                for (let index = 0; index < entries.length; index++) {
                    const passage = objectRefs.current[index]?.parentElement;
                    if (!passage || passage.getBoundingClientRect().top > scanLine) break;
                    reached = entries[index].stratum;
                }
            }
            if (reached !== chapterRef.current && !isRidingRef.current) {
                chapterRef.current = reached;
                setChapter(reached);
            }

            // Once every object is accounted for, the rest of the ride is the end: no hunting, anywhere.
            const isAllScanned = entries.every((entry) => decided[entry.id] !== undefined);

            // Writes come after every read, so the browser lays the page out once per frame.
            // Each value goes only to what reads it: --scroll to each drift (registered as
            // non-inherited, so nothing inside a drift restyles), --warp to the meteor field.
            const field = fieldRef.current;
            if (!isMotionReduced && field !== null) {
                const now = performance.now();
                const speed = Math.abs(window.scrollY - lastY) / Math.max(16, now - lastTime);
                lastY = window.scrollY;
                lastTime = now;
                // Only drifts within two screens of the view can be seen, so only they move.
                const scrolled = String(window.scrollY);
                const vh = window.innerHeight / 100;
                const viewMiddle = window.scrollY + 50 * vh;
                for (let index = 0; index < drifts.length; index++) {
                    const home = (60 + drifts[index].slot * pitchVh) * vh;
                    if (Math.abs(home - viewMiddle) > 2 * window.innerHeight) continue;
                    driftRefs.current[index]?.style.setProperty("--scroll", scrolled);
                }
                field.style.setProperty("--warp", Math.min(speed * 2.5, 5).toFixed(2));
                if (settle !== null) clearTimeout(settle);
                settle = setTimeout(() => field.style.setProperty("--warp", "0"), 140);
            }

            heldRef.current = held;
            setHeldId(held);
            // Acquire (item 10): a fresh object at the lock becomes the target, if the satellite
            // is free. Past the last object the hunt stands down, and the finale accounts for it.
            if (isPastLast && targetRef.current !== null) {
                targetRef.current = null;
                setTargetId(null);
            }
            const isFree = targetRef.current === null && !isRidingRef.current;
            if (isOnlineRef.current && isFree && held !== null && decided[held] === undefined) {
                targetRef.current = held;
                setTargetId(held);
            }
            // The focus: the target, else what's at the lock, else what the HUD last read. Nothing
            // while the rocket carries you, or back at the top.
            const isHome = held === null && window.scrollY <= 0;
            const current = focusRef.current;
            const isCard = current !== null && decided[current] !== undefined;
            if (isCard && cardSinceRef.current === null) cardSinceRef.current = performance.now();
            const next = isRidingRef.current || isHome ? null : (landedRef.current ?? targetRef.current ?? held ?? current);
            // A fresh card holds while the next object is still decoding, up to a bar, so its title
            // decodes once. The next card always takes over the moment it lands, so none is skipped.
            const shownFor = cardSinceRef.current === null ? BAR_MS : performance.now() - cardSinceRef.current;
            const isNextDecoding = next !== null && decided[next] === undefined;
            if (next !== current && isNextDecoding && isCard && shownFor < BAR_MS) {
                if (cardHold !== null) clearTimeout(cardHold);
                cardHold = setTimeout(locate, BAR_MS - shownFor);
            } else if (next !== current) {
                if (next === landedRef.current) landedRef.current = null;
                focusRef.current = next;
                cardSinceRef.current = next !== null && decided[next] !== undefined ? performance.now() : null;
                setFocusId(next);
            }
            if (held !== null) setPhase("held");
            else if (isPastLast || isAllScanned) setPhase("end");
            else if (window.scrollY > 0) setPhase("travelling");
            else setPhase("rest");
        }

        function handleScroll() {
            if (frame === null) frame = requestAnimationFrame(locate);
        }

        locate();
        locateRef.current = handleScroll;
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (frame !== null) cancelAnimationFrame(frame);
            if (settle !== null) clearTimeout(settle);
            if (cardHold !== null) clearTimeout(cardHold);
            locateRef.current = null;
        };
    }, [entries, drifts, pitchVh]);

    // The HUD tells the page how much of the screen's foot it takes, so the rocket can ride above it on a phone.
    useEffect(() => {
        const hud = hudRef.current;
        if (hud === null) return;
        const root = document.documentElement;
        function measure() {
            if (hud === null) return;
            root.style.setProperty("--hud-clearance", `${Math.round(window.innerHeight - hud.getBoundingClientRect().top)}px`);
        }
        measure();
        const watch = new ResizeObserver(measure);
        watch.observe(hud);
        window.addEventListener("resize", measure);
        return () => {
            watch.disconnect();
            window.removeEventListener("resize", measure);
            root.style.removeProperty("--hud-clearance");
        };
    }, []);

    // Everything the record has accounted for: your scan, plus what it revealed or remembered.
    const done = useMemo(() => ({ ...revealed, ...decisions }), [revealed, decisions]);
    const isFinished = entries.every((entry) => done[entry.id] !== undefined);

    // The scroll loop reads them from a ref, so it always sees the latest without re-subscribing,
    // and it looks again at once, so a finished record reads as the end without waiting for a scroll.
    useEffect(() => {
        doneRef.current = done;
        scannedRef.current = decisions;
        locateRef.current?.();
    }, [done, decisions]);

    // A return visit opens on what this browser finished, as far as the record still agrees.
    // (Read after the first paint: the server can't see this browser's memory.)
    useEffect(() => {
        const recall = setTimeout(() => {
            const remembered = readMemory(entries);
            if (Object.keys(remembered).length === 0) return;
            setArrival("now");
            setRevealed(remembered);
        }, 0);
        return () => clearTimeout(recall);
    }, [entries]);

    // A finished record is remembered, however it was finished.
    useEffect(() => {
        if (isFinished && volley === null) writeMemory(done);
    }, [isFinished, volley, done]);

    const isOnline = bootStage === "online";

    // The scan loop learns the boot is over, and looks at once, so an object already at the lock is acquired.
    useEffect(() => {
        isOnlineRef.current = isOnline;
        locateRef.current?.();
    }, [isOnline]);

    // The hunt runs on the target, not on what's at the lock: scrolling on doesn't cancel it (item 10).
    useEffect(() => {
        if (!isOnline || targetId === null) return;
        const entry = entries.find((candidate) => candidate.id === targetId);
        if (entry === undefined) return;
        const hunt = setTimeout(() => {
            const decision: Decision = entry.state === "Kept" ? "kept" : "debris";
            // A scanned object lands after its absorb, whatever landed before it.
            setArrival("absorb");
            setDecisions((current) => ({ ...current, [targetId]: decision }));
            // The scan loop knows at once, before React renders, so a scroll in between can't
            // acquire the same object again and leave the satellite stuck on it.
            doneRef.current = { ...doneRef.current, [targetId]: decision };
            scannedRef.current = { ...scannedRef.current, [targetId]: decision };
            // Free again: the scan loop looks once the decision lands, and acquires whatever is at the lock.
            landedRef.current = targetId;
            targetRef.current = null;
            setTargetId(null);
        }, HUNT_MS);
        return () => clearTimeout(hunt);
    }, [isOnline, targetId, entries]);

    // THE FINALE: at the end of the record, whatever you didn't scan, the record accounts for.
    // Debris is counted at once; the kept fall into the planet as one labelled volley.
    useEffect(() => {
        if (phase !== "end") isFinaleArmedRef.current = true;
        if (!isOnline || phase !== "end" || isFinished || volley !== null) return;
        if (!isFinaleArmedRef.current) return;
        // It begins one tick after you arrive, on the same beat as everything else.
        const begin = setTimeout(() => {
            const left = entries.filter((entry) => done[entry.id] === undefined);
            const debris = left.filter((entry) => entry.state !== "Kept");
            const kept = left.filter((entry) => entry.state === "Kept").map((entry) => entry.id);
            setArrival("now");
            setRevealed((current) => ({
                ...current,
                ...Object.fromEntries(debris.map((entry) => [entry.id, "debris" as Decision])),
            }));
            if (kept.length > 0) setVolley(kept);
        }, TICK_MS);
        return () => clearTimeout(begin);
    }, [isOnline, phase, isFinished, volley, entries, done]);

    // The volley: a tick apart, squeezed so the whole of it lands inside two bars. It keeps time
    // to the clock, not to the timer: if a render runs long, the next tick lands whatever is due.
    useEffect(() => {
        if (volley === null) return;
        const spacing = Math.min(TICK_MS, VOLLEY_MS / volley.length);
        const start = performance.now();
        let landed = 0;
        const fall = setInterval(() => {
            const due = Math.min(volley.length, Math.floor((performance.now() - start) / spacing) + 1);
            const arriving = volley.slice(landed, due);
            landed = due;
            setRevealed((current) => ({
                ...current,
                ...Object.fromEntries(arriving.map((id) => [id, "kept" as Decision])),
            }));
            if (landed === volley.length) {
                clearInterval(fall);
                setVolley(null);
            }
        }, spacing);
        return () => clearInterval(fall);
    }, [volley]);

    // RESCAN: back to zero, the planet included, and you travel the record again from where you are.
    function handleRescan() {
        forgetMemory();
        heldRef.current = null;
        targetRef.current = null;
        landedRef.current = null;
        setTargetId(null);
        isFinaleArmedRef.current = false;
        settledRef.current = {};
        setSettled({});
        setArrival("now");
        setVolley(null);
        setRevealed({});
        setDecisions({});
        // And the rocket carries you to the start, so the record begins again from the first object.
        rocketRef.current?.rideUp();
    }

    function handleRide(riding: boolean) {
        isRidingRef.current = riding;
        setIsRiding(riding);
        if (riding) {
            targetRef.current = null;
            landedRef.current = null;
            setTargetId(null);
        }
        locateRef.current?.();
    }

    const held = entries.find((entry) => entry.id === heldId) ?? null;
    const decision: Decision | undefined = held !== null ? decisions[held.id] : undefined;
    let reading: Reading;
    if (!isOnline) reading = "rest";
    // The lock hunts only its target; an object passing while the satellite is busy just passes.
    else if (phase === "held" && held !== null) reading = decision ?? (held.id === targetId ? "hunting" : "searching");
    else if (phase === "travelling") reading = "searching";
    else if (phase === "end") reading = "end";
    else reading = "rest";

    // Rereading: an object the record revealed (or this browser remembered) shows its card the
    // moment you pass it. The scan itself stays as it was, so nothing locks and the satellite
    // keeps drifting; only the HUD reads.
    const isTaken = (id: string) =>
        decisions[id] !== undefined ? settled[id] === true : revealed[id] !== undefined;
    const isRereading = isOnline && phase === "held" && held !== null && volley === null && isTaken(held.id);
    if (isRereading) reading = isFinished ? "end" : "searching";
    // The HUD reads the focus (item 10): its card once it's decided or revealed, "Decoding" while
    // it's the target. At the top and at the end of the record, the HUD says so instead.
    const focus = entries.find((entry) => entry.id === focusId) ?? null;
    const isFocusShown = isOnline && focus !== null && phase !== "rest" && !(phase === "end" && held === null);
    const card: Decision | undefined = isFocusShown ? (decisions[focus.id] ?? revealed[focus.id]) : undefined;
    const isFocusHunting = isFocusShown && card === undefined && focus.id === targetId;
    const hudReading: Reading = card ?? (isFocusHunting ? "hunting" : reading === "hunting" ? "searching" : reading);

    // Three counts, one source: the record, your scan, and the planet built from it. What the
    // record revealed grows the planet but never counts as scanned.
    const counts = countsOf(entries, decisions, revealed);
    // Where the record came from, in a stranger's words.
    const provenance = source === "substrate" ? "Read live from Notion" : "From the stored copy";
    const captured = entries.filter((entry) => done[entry.id] === "kept");
    // SAT_1's dish lights a groove for each sixth of the record the planet holds (integration item 8).
    const grooves =
        counts.record.kept > 0 ? Math.min(6, Math.floor((counts.planet.mass / counts.record.kept) * 6)) : 0;
    const mass = counts.planet.mass;

    const hasImage = focus !== null && focus.image !== null && !failedImages.includes(focus.id);
    const hasArtifact = focus !== null && (hasImage || focus.snippet !== null);
    const isDissolved = focus !== null && (dissolvedId === focus.id || !hasArtifact);

    function handleDissolve() {
        if (focus !== null) setDissolvedId(focus.id);
    }

    function handleImageError(id: string) {
        setFailedImages((current) => (current.includes(id) ? current : [...current, id]));
    }

    return (
        <>
            <div
                ref={scanRef}
                className={styles.scan}
                data-reading={reading}
                data-boot-stage={bootStage}
                data-grooves={grooves}
                data-trail-zone
            >
                <div ref={fieldRef} className={styles.field} aria-hidden="true">
                    {meteors.map((meteor, index) => (
                        <span
                            key={`meteor-${index}`}
                            className={styles.meteor}
                            data-bright={meteor.isBright || undefined}
                            style={
                                {
                                    left: `${meteor.left}%`,
                                    "--length": `${meteor.length}px`,
                                    "--brightness": meteor.brightness,
                                    "--tilt": `${meteor.tilt.toFixed(1)}deg`,
                                    "--drift": `${meteor.drift.toFixed(1)}vh`,
                                    animationDuration: `${meteor.seconds}s`,
                                    animationDelay: `${meteor.delay}s`,
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>

                <div className={styles.drifts} style={{ "--pitch": `${pitchVh}vh` } as CSSProperties} aria-hidden="true">
                    {drifts.map((drift, index) => (
                        <span
                            key={`drift-${index}`}
                            ref={(element) => {
                                driftRefs.current[index] = element;
                            }}
                            className={styles.drift}
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
                </div>

                {/* The chapter title: surfaces in the left third as you cross into a stratum, then fades. */}
                {isOnline && chapter !== null && reading !== "end" && (
                    <div key={chapter} className={styles.chapter} aria-hidden="true">
                        <span className={styles.chapterLabel}>{chapterOf(entries, chapter).label}</span>
                        <span className={styles.chapterName}>{chapterOf(entries, chapter).name}</span>
                        <span className={styles.chapterYears}>{chapterOf(entries, chapter).years}</span>
                    </div>
                )}
                <ol className={styles.passages}>
                    {entries.map((entry, index) => (
                        <li
                            key={entry.id}
                            className={styles.passage}
                            data-state={entry.state}
                            data-opens={index === 0 || entries[index - 1].stratum !== entry.stratum || undefined}
                        >
                            <span
                                ref={(element) => {
                                    objectRefs.current[index] = element;
                                }}
                                className={styles.object}
                                data-decision={
                                isTaken(entry.id)
                                    ? `taken-${decisions[entry.id] ?? revealed[entry.id]}`
                                    : (decisions[entry.id] ?? "unscanned")
                            }
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

                <HeroOrbit
                    mass={mass}
                    fullMass={counts.record.kept}
                    arrivalMs={arrival === "now" ? 0 : undefined}
                    isOnline={bootStage === "gated" || bootStage === "online"}
                    isArchitectNamed={isStratumProven(entries, done, "3")}
                    isTechnologistNamed={isStratumProven(entries, done, "5")}
                />

                <div
                    className={styles.body}
                    style={{ "--mass": mass } as CSSProperties}
                    data-planet-body
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
                        {/* Your scan, out of the record: every decision counts here; only kept ones grow the planet. */}
                        {/* A return visit that scanned nothing yet shows only the record it remembers (item 10). */}
                        {!(isFinished && counts.scan.decided === 0) && (
                            <>
                                Scanned {String(counts.scan.decided).padStart(2, "0")} / {counts.record.total}
                            </>
                        )}
                        {/* Once the record is finished, the planet carries the record, and says so. */}
                        {isFinished && volley === null && (
                            <span className={styles.massRecord}>Record · {counts.record.kept} kept</span>
                        )}
                    </span>
                </div>

                <aside ref={hudRef} className={styles.hud} data-reading={hudReading} aria-live="polite" data-trail-off>
                    <BootScreen objectCount={entries.length} source={source} reading={hudReading} onBootStage={setBootStage}>
                        {/* Whose record this is, and where it came from: the HUD's top line, from the hand-over on. */}
                        <span className={styles.hudOwner}>Nat Moges · {provenance}</span>
                        {reading === "rest" && <span className={styles.hudHint}>Scroll to travel</span>}

                        {hudReading === "searching" && (
                            <span className={styles.hudHint}>{isRiding ? "Returning to the start" : "Scanning…"}</span>
                        )}

                        {hudReading === "hunting" && focus !== null && (
                            <TextScrambler
                                key={`${focus.id}-hunting`}
                                text="Decoding"
                                className={styles.hudTitle}
                                textColor="var(--muted)"
                                scrambleColor="var(--muted)"
                                durationMs={HUNT_MS}
                            />
                        )}

                        {card !== undefined && focus !== null && (
                            <>
                                <span className={styles.hudWhen}>{focus.when}</span>
                                <TextScrambler
                                    key={`${focus.id}-${card}`}
                                    text={focus.title}
                                    className={styles.hudTitle}
                                    textColor={card === "debris" ? "var(--muted)" : "var(--signal)"}
                                    scrambleColor="var(--muted)"
                                    durationMs={BAR_MS}
                                />

                                {card === "kept" && !isDissolved && (
                                    <button
                                        key={`${focus.id}-artifact`}
                                        type="button"
                                        className={styles.artifactButton}
                                        onClick={handleDissolve}
                                        aria-label={`${focus.title}: read the record`}
                                    >
                                        {hasImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={focus.image ?? ""}
                                                alt=""
                                                className={styles.artifact}
                                                onError={() => handleImageError(focus.id)}
                                            />
                                        ) : (
                                            <pre className={styles.snippet}>{focus.snippet}</pre>
                                        )}
                                        <span className={styles.hudHint}>Tap to read</span>
                                    </button>
                                )}

                                {(isDissolved || card === "debris") && (
                                    <div key={`${focus.id}-readout`} className={styles.readout}>
                                        <p>{focus.whatChanged}</p>
                                        {card === "kept" && focus.credit && (
                                            <p className={styles.hudCredit}>{focus.credit}</p>
                                        )}
                                        {/* In a new tab, so the record you're reading is still here when you come back. */}
                                        {card === "kept" && focus.link && destinationOf(focus.link) !== null && (
                                            <a href={focus.link} className={styles.hudLink} target="_blank" rel="noopener noreferrer">
                                                Open · {destinationOf(focus.link)} →
                                            </a>
                                        )}
                                        {card === "debris" && (
                                            <p className={styles.hudLock}>
                                                Signal lost. Locks when: {focus.lockCondition}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {reading === "end" && volley !== null && (
                            <span className={styles.hudHint}>Accreting the remaining {volley.length}</span>
                        )}

                        {reading === "end" && volley === null && card === undefined && (
                            <>
                                {/* The last transmission: the record's numbers, then where to go. */}
                                <span className={styles.hudHint}>End of record</span>
                                <p>
                                    {counts.record.kept} kept · {counts.record.debris} debris
                                    {source === "cache" && " · from the stored copy"}
                                </p>
                                <nav className={styles.hudLinks} aria-label="Where to go from here">
                                    <a href={REPO_URL} className={styles.hudLink}>
                                        The build, commit by commit →
                                    </a>
                                    <a href={PORTFOLIO_URL} className={styles.hudLink}>
                                        natmoges.com →
                                    </a>
                                    <a href={CONTACT_URL} className={styles.hudLink}>
                                        Contact →
                                    </a>
                                    <Link href="/before" className={styles.hudLink}>
                                        The index this page grew out of →
                                    </Link>
                                </nav>
                                {isFinished && (
                                    <button type="button" className={styles.rescan} onClick={handleRescan}>
                                        Rescan
                                    </button>
                                )}
                            </>
                        )}
                    </BootScreen>
                </aside>
            </div>
            {/* Outside the scan, so it stays fixed to the screen, and still there in reduced motion. */}
            <Back2Top ref={rocketRef} scrollThreshold={0.3} onRideChange={handleRide} className={styles.rocketLane} />
        </>
    );
}