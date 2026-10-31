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
 * REPEAT VISIT: nothing saved, so it hunts and locks again from scratch.
 *
 * REDUCED MOTION: the dot stays, the ring is gone.
 */

import styles from "./SignalLocation.module.css";

export default function SignalLocation() {
    return (
        <div className={styles.signal} role="status">
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.label}>Locating signal</span>
        </div>
    );
}
