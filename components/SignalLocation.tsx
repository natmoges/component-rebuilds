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
 * "Locating signal" appears shortly after. The hunt runs at least 2 seconds
 * so the lock can be seen.
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
 * NO PLACE: if the signal comes back but carries no place, the dot becomes a
 * small rocket and the text reads "Somewhere in the world".
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

import { useEffect, useState, type CSSProperties } from "react";
import { Rocket } from "lucide-react";
import TextScrambler from "./TextScrambler";
import styles from "./SignalLocation.module.css";

const MIN_HUNT_MS = 2000;
const LABEL_DELAY_MS = 500;
const TIMEOUT_MS = 5000;

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

    useEffect(() => {
        const tuner = new AbortController();
        const timeout = setTimeout(() => tuner.abort("timeout"), TIMEOUT_MS);
        const labelTimer = setTimeout(() => setIsLabelShown(true), LABEL_DELAY_MS);

        async function lockOn() {
            const [answer] = await Promise.all([
                readSignal(tuner.signal).catch(() => null),
                pause(MIN_HUNT_MS),
            ]);
            clearTimeout(timeout);

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
            className={styles.signal}
            role="status"
            data-reception={reception}
            style={
                {
                    "--lock-color": lockColor,
                    "--lost-color": lostColor,
                    color: textColor,
                } as CSSProperties
            }
        >
            {reception === "adrift" ? (
                <Rocket className={styles.rocket} aria-hidden="true" />
            ) : (
                <span className={styles.dot} aria-hidden="true" />
            )}
            {isLabelShown && (
                <TextScrambler
                    key={readout}
                    text={readout}
                    className={styles.label}
                    textColor={textColor}
                    scrambleColor="var(--muted)"
                />
            )}
        </div>
    );
}