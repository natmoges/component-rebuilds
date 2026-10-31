"use client";

/*
 * SignalLocation — build #6 of the closer ladder.
 * Reference: Live Location by Amr Rashed (Framer Marketplace).
 *
 * Shows where the visitor is, worked out fresh from their connection on every
 * visit and refresh. Nothing is saved: hotspots, VPNs and people moving around
 * make a remembered location wrong, so it calculates every time.
 *
 * BEFORE LOAD: a green dot pulses out of rhythm, trying to find the signal.
 * After a beat, "Locating signal" scrambles in and the pulse finds a steady
 * rhythm, closing in. The hunt runs at least 3 seconds so it can be read.
 *
 * THE INSTANT OF LOCK: the out-of-rhythm pulse settles onto a rhythm at once,
 * then slows until it's a subtle breath. The visitor's city and country are
 * locked in and shown next to the green dot.
 *
 * DURING: the dot simply breathes.
 *
 * HALF A LOCK: if only the country comes back, it shows the country, but the
 * dot doesn't lock all the way; it keeps breathing a little.
 *
 * NO PLACE: if the signal comes back but carries no place, the dot vibrates
 * harder and harder until it bursts into a small rocket, and the text reads
 * "Somewhere in the world".
 *
 * FAILURE: only if the signal itself breaks, the dot turns red and reads
 * "Signal unrecoverable".
 * 
 * THE WORDS: every readout scrambles in like my TextScrambler (build #2):
 * "Locating signal" when it appears, the place when it locks.
 *
 * REPEAT VISIT: nothing saved, so it hunts and locks again from scratch.
 *
 * REDUCED MOTION: the dot stays, the ring is gone.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Rocket } from "lucide-react";
import TextScrambler from "./TextScrambler";
import styles from "./SignalLocation.module.css";

// One tempo for everything: a 1-second bar of 8 ticks. The pulse, the
// scramble's noise and every delay are whole ticks or bars, so nothing drifts.
const BAR_MS = 1000;
const TICKS_PER_BAR = 8;
const TICK_MS = BAR_MS / TICKS_PER_BAR;
const LABEL_DELAY_MS = BAR_MS;
const MIN_HUNT_MS = 3 * BAR_MS;
const TIMEOUT_MS = 5 * BAR_MS;

type Reception = "hunting" | "locked" | "partial" | "adrift" | "lost";

type Place = {
    city?: string;
    country?: string;
};

async function readSignal(signal: AbortSignal): Promise<Place> {
    const response = await fetch("/api/location", { signal, cache: "no-store" });
    if (!response.ok) throw new Error(`Signal broke: ${response.status}`);
    return response.json();
}

function receptionFor(place: Place): Reception {
    if (place.city && place.country) return "locked";
    if (place.country) return "partial";
    return "adrift";
}

function pause(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface SignalLocationProps {
    lockColor?: string;
    lostColor?: string;
    textColor?: string;
}

export default function SignalLocation({
    lockColor = "var(--signal)",
    lostColor = "#EF4444",
    textColor = "#D9D9D9",
}: SignalLocationProps) {
    const [reception, setReception] = useState<Reception>("hunting");
    const [place, setPlace] = useState<Place>({});
    const [isLabelShown, setIsLabelShown] = useState(false);
    const signalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tuner = new AbortController();
        const huntStart = performance.now();

        // Restart the pulse's CSS clock now, so it counts bars from the same
        // instant as the label, the lock and the scramble.
        signalRef.current
            ?.getAnimations({ subtree: true })
            .forEach((animation) => {
                animation.currentTime = 0;
            });
        const timeout = setTimeout(() => tuner.abort("timeout"), TIMEOUT_MS);
        const labelTimer = setTimeout(() => setIsLabelShown(true), LABEL_DELAY_MS);

        async function lockOn() {
            const [answer] = await Promise.all([
                readSignal(tuner.signal).catch(() => null),
                pause(MIN_HUNT_MS),
            ]);
            clearTimeout(timeout);

            const lateBy = (performance.now() - huntStart) % BAR_MS;
            if (lateBy > TICK_MS / 2) await pause(BAR_MS - lateBy);

            if (tuner.signal.reason === "left") return;

            if (answer === null) {
                setReception("lost");
                return;
            }
            setPlace(answer);
            setReception(receptionFor(answer));
        }

        lockOn();

        return () => {
            clearTimeout(timeout);
            clearTimeout(labelTimer);
            tuner.abort("left");
        };
    }, []);

    const readouts: Record<Reception, string> = {
        hunting: "Locating signal",
        locked: `${place.city}, ${place.country}`,
        partial: place.country ?? "",
        adrift: "Somewhere in the world",
        lost: "Signal unrecoverable",
    };
    const readout = readouts[reception];

    return (
        <div
            ref={signalRef}
            className={styles.signal}
            role="status"
            data-reception={reception}
            data-label={isLabelShown}
            style={
                {
                    "--lock-color": lockColor,
                    "--lost-color": lostColor,
                    "--text-color": textColor,
                    "--bar": `${BAR_MS}ms`,
                    color: textColor,
                } as CSSProperties
            }
        >
            <span className={styles.icon} aria-hidden="true">
                <span className={styles.beacon}>
                    <span className={styles.ring} />
                    <span className={styles.dot} />
                </span>
                <Rocket className={styles.rocket} />
            </span>
            {isLabelShown && (
                <TextScrambler
                    key={readout}
                    text={readout}
                    className={styles.label}
                    textColor={textColor}
                    scrambleColor="var(--muted)"
                    durationMs={BAR_MS}
                    flickerRate={1000 / (TICK_MS * 20)}
                />
            )}
        </div>
    );
}