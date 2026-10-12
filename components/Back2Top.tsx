"use client";

/*
 * Back2Top
 *
 * Before load, there is an empty void, a long vertical page. At the top of
 * the page, like an intercepted space transmission or message, text appears
 * in a pulsating, futuristic space style (my TextScrambler, build #2),
 * asking the user to scroll down the page. There is no button displayed at
 * the top of the page and the component sits dormant. Crossing the 25%
 * threshold going down, the rocket (Lucide's rocket, turned straight up)
 * appears and starts to breathe. There is also now text in the middle that
 * says continue to scroll for a longer ride: a longer page means a longer
 * ride, because the ride moves at rideUpPxPerSec and never lasts longer
 * than maxRideMs. On hover over the component the breathing stops, just like
 * in the original component, and the rocket turns Signal green. Once it's
 * clicked, the blue ring appears, the ride starts, and the circle fills
 * Signal green like a rocket taking off: the exhaust stems from the little
 * flame under the rocket and fills the circle for the duration of the ride.
 * Crossing back under 25% mid-ride, it disappears even though the ride
 * continues; if the rocket disappears, so does the exhaust. After the middle
 * text layer, the bottom adds another text that says enjoy the ride.
 * Arriving at the top, the transmission re-scrambles, message intercepted,
 * every time. Doing it a second time works the same way. Scrolling while the
 * ride is going breaks the ride instantly, and the user's own scroll takes
 * over from exactly where they are. A page too short to scroll: the rocket
 * simply disappears. Reduced motion: the rocket sits still, no breathing,
 * the ride is instant, no fill, only the icon turns green on click.
 * Function over form. iPhone: no hover, and that's fine. Keyboard users:
 * tab to it, enter, focus falls back to the top/start of the page. Colours
 * stay inside the site's palette: Signal green for the ring, the hover and
 * the exhaust, with the blue ring for the click.
 */

import { useEffect, useRef, useState } from "react";
import { Rocket } from "lucide-react";
import styles from "./Back2Top.module.css";

export interface Back2TopProps {
    scrollThreshold?: number;
    rideUpPxPerSec?: number;
    maxRideMs?: number;
}

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Back2Top({
    scrollThreshold = 0.25,
    rideUpPxPerSec = 2000,
    maxRideMs = 3000,
}: Back2TopProps) {
    const [isPastThreshold, setIsPastThreshold] = useState(false);

    useEffect(() => {
        function handleScroll() {
            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;
            setIsPastThreshold(
                scrollable > 0 && window.scrollY / scrollable >= scrollThreshold
            );
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [scrollThreshold]);

    const frameRef = useRef<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function breakRide() {
            if (frameRef.current !== null) {
                buttonRef.current?.style.setProperty("--exhaust", "0");
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        }

        window.addEventListener("wheel", breakRide, { passive: true });
        window.addEventListener("pointerdown", breakRide);
        window.addEventListener("keydown", breakRide);

        return () => {
            breakRide();
            window.removeEventListener("wheel", breakRide);
            window.removeEventListener("pointerdown", breakRide);
            window.removeEventListener("keydown", breakRide);
        };
    }, []);

    function rideUp() {
        const start = window.scrollY;
        const durationMs = Math.min((start / rideUpPxPerSec) * 1000, maxRideMs);
        const startTime = performance.now();

        function step(now: number) {
            const t = Math.min((now - startTime) / durationMs, 1);
            const eased = easeInOutCubic(t);
            window.scrollTo(0, start * (1 - eased));
            buttonRef.current?.style.setProperty("--exhaust", String(eased));
            frameRef.current = t < 1 ? requestAnimationFrame(step) : null;
        }

        frameRef.current = requestAnimationFrame(step);
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.currentTarget.focus();
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        rideUp();
    }

    if (!isPastThreshold) return null;

    return (
        <button
            ref={buttonRef}
            type="button"
            aria-label="Scroll to top"
            className={styles.button}
            onClick={handleClick}
        >
            <Rocket className={styles.rocket} aria-hidden="true" />
        </button>
    );
}