"use client";

/*
 * SmoothScroll — build #8 of the closer ladder.
 * Reference: Smooth Scroll by Nandi Muzsik and Clément Roche (Framer
 * University, Framer Marketplace), built on Lenis by darkroom.engineering.
 *
 * Gives Accretion's page weight. Every wheel or trackpad move becomes one
 * glide that starts quick and settles slowly, like drifting through space
 * instead of being yanked through it. It wraps Lenis, a library I didn't
 * write, and lives on Accretion's page only; every other page keeps the
 * browser's own scroll.
 *
 * SMOOTHNESS: a single knob from 0 to 100. 0 is off, the browser's native
 * scroll, untouched. Above 0, the higher the number, the heavier it feels:
 * the glide lasts smoothness ÷ 25 seconds, so 25 is one second and 100 is
 * four. Accretion runs at 40.
 *
 * BEFORE LOAD: the page arrives from the server and scrolls natively until
 * the browser starts the engine. Nothing jumps; wherever the visitor was,
 * they stay.
 *
 * THE FIRST SCROLL: the page starts moving at once, quick at first, then
 * settles out over the length of the glide.
 *
 * DURING: the record travels past on the glide. The meteors still stretch
 * with speed and the scan still waits for the crosshair; a hard flick can
 * still carry an object past before it locks, and that object isn't added.
 *
 * A REPEAT: a second scroll mid-glide picks up from where the page is and
 * glides to the new target. Scrolling back up glides the same way.
 *
 * THE END: the glide stops at the end of the record. No overshoot, no drift
 * past it.
 *
 * THE KNOB CHANGES: the old engine is shut down completely before the new
 * one starts. One engine, one clock, never two.
 *
 * LEAVING: going to /before or another build shuts the engine down. The
 * next page scrolls natively.
 *
 * TOUCH: phones and tablets keep their own native scroll; only the wheel
 * and trackpad glide.
 *
 * THE HANDSHAKE: while it runs, the engine sits on the window as
 * __natSmoothScroll. Back2Top resets it before a ride, so a glide still
 * settling can't drag the page back to where the glide was going.
 *
 * FAILURE: if the engine can't start, the page scrolls natively. Nothing
 * breaks; it just isn't smoothed.
 *
 * REDUCED MOTION: no glide. Scroll stays native, and Accretion shows its
 * plain list as before.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
    smoothness?: number;
}

export default function SmoothScroll({ smoothness = 30 }: SmoothScrollProps) {
    useEffect(() => {
        if (smoothness <= 0) return;

        try {
            const lenis = new Lenis({
                duration: Math.min(smoothness, 100) / 25,
                autoRaf: true,
            });
            // The handshake: anything on the page that moves it (the rocket)
            // can find the engine here and tell it to drop a glide.
            const page = window as Window & { __natSmoothScroll?: Lenis };
            page.__natSmoothScroll = lenis;
            return () => {
                if (page.__natSmoothScroll === lenis) delete page.__natSmoothScroll;
                lenis.destroy();
            };
        } catch {
            // The engine didn't start. Native scroll stays.
        }
    }, [smoothness]);

    return null;
}