"use client";

/*
 * Gravity — build #12 of the closer ladder.
 * Reference: Gravity Component by Framer University (Nandi, David, Prianca),
 * Framer Marketplace, the July 2025 version on natmoges.com. What's mine: on
 * natmoges.com I had to keep it in a 47 px rail at the bottom of my hero,
 * with an invisible 1×1 body beside the pill, because its grab canvas
 * covered StarCloud and one body on Evenly divided by zero. Here the zero-g
 * is mine, and you grab the satellite itself, so nothing covers the sky.
 *
 * Puts Accretion's satellite in real space. A physics engine (Matter.js)
 * holds a twin of the satellite in zero gravity; every frame the satellite
 * is moved onto its twin, and the beam re-aims from wherever it is to the
 * scan line. Grab it and throw it: it flies, bounces off the edges of the
 * screen, spins, and slowly drifts to a stop where space leaves it.
 *
 * THE KNOBS, carried over from my natmoges.com settings: friction 0.08 ·
 * bounce (restitution) 0.69 · density 1, so it's heavy in the hand. Gravity
 * 0, 0: space, not my hero's 0.5. Framer University's numbers, credited:
 * a grab spring of stiffness 0.2 and walls 100 px thick just past the edges.
 *
 * BEFORE LOAD: the satellite at top centre with its beam straight down,
 * exactly as Accretion has it today.
 *
 * THE INSTANT IT ARRIVES: the engine starts with the satellite at rest
 * where it already is. Nothing jumps; it's just free now.
 *
 * GRABBING: press on the satellite and a spring pulls it to your pointer.
 * It lags a little because it's heavy. The cursor shows grab, then
 * grabbing.
 *
 * THROWING: let go mid-move and it keeps your speed. It spins if you threw
 * it off-centre.
 *
 * HITTING AN EDGE: it bounces off the edges of the screen, keeping about
 * two thirds of its speed. It never leaves the screen, and it passes over
 * the HUD and the planet without touching them.
 *
 * AFTER A THROW: space drag slows it gradually. It stops wherever it stops,
 * turned however it ended up. There's no pull home.
 *
 * SCROLLING: the record's warp gives it a small push the way the record is
 * moving, so fast scrolling jostles it. Slow scrolling barely does.
 *
 * DURING A LOCK: it keeps drifting. The beam re-aims every frame from the
 * satellite to the scan line, and its hunting, locked and debris looks
 * are Scan's, unchanged. Scanning from any direction.
 *
 * CLICKS: only the satellite takes the pointer. The rest of the sky is
 * click-through, and StarCloud still steers.
 *
 * RESIZING: the walls move to the new edges and the satellite stays where
 * it was, nudged back inside if the screen got smaller.
 *
 * LEAVING THE TAB: the world pauses. Coming back, it carries on with no
 * jump.
 *
 * ANY SCREEN: one loop steps the engine at most 1/60 s at a time, the same
 * on 60 Hz and 120 Hz.
 *
 * FAILURE: if the engine can't start, the satellite stays at top centre
 * with its straight beam, as today.
 *
 * TOUCH: on phones you can grab and throw it with a finger. A thumb
 * anywhere else scrolls the page.
 *
 * REDUCED MOTION: no engine. The satellite stays home and the beam stays
 * straight.
 */

import { useRef, type ReactNode } from "react";
import styles from "./Gravity.module.css";

interface GravityProps {
    children: ReactNode;
}

export default function Gravity({ children }: GravityProps) {
    const satelliteRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={satelliteRef} className={styles.satellite}>
            {children}
        </div>
    );
}