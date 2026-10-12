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
 * in the original component, and the rocket turns red. Once it's clicked,
 * the blue ring appears, the ride starts, and the circle fills red like a
 * rocket taking off: the exhaust stems from the little flame under the
 * rocket and fills the circle, orange at the flame into red at the edge, for
 * the duration of the ride. Crossing back under 25% mid-ride, it disappears
 * even though the ride continues; if the rocket disappears, so does the
 * exhaust. After the middle text layer, the bottom adds another text that
 * says enjoy the ride. Arriving at the top, the transmission re-scrambles,
 * message intercepted, every time. Doing it a second time works the same
 * way. Scrolling while the ride is going breaks the ride instantly, and the
 * user's own scroll takes over from exactly where they are. A page too short
 * to scroll: the rocket simply disappears. Reduced motion: the rocket sits
 * still, no breathing, the ride is instant, no red fill, only the icon turns
 * red on click. Function over form. iPhone: no hover, and that's fine.
 * Keyboard users: tab to it, enter, focus falls back to the top/start of
 * the page.
 */

import { Rocket } from "lucide-react";
import styles from "./Back2Top.module.css";

export interface Back2TopProps {
  scrollThreshold?: number;
  rideUpPxPerSec?: number;
  maxRideMs?: number;
}

export default function Back2Top({
  scrollThreshold = 0.25,
  rideUpPxPerSec = 2000,
  maxRideMs = 3000,
}: Back2TopProps) {
  return (
    <button type="button" aria-label="Scroll to top" className={styles.button}>
      <Rocket className={styles.rocket} aria-hidden="true" />
    </button>
  );
}