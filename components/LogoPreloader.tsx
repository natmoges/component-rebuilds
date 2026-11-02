"use client";

/*
 * LogoPreloader — build #10 of the closer ladder.
 * Reference: Logo Preloader by Brett Jackson (Sukoya Design), Framer
 * Marketplace. The HUD look is mine: on natmoges.com I blended his
 * component's layer over the hero. Here the logo is cut clear and the layer
 * uses Screen blending, so only the HUD and the stars land on whatever page
 * is underneath, like a projection on glass.
 *
 * Owns the first three seconds of any visit. It lives in the layout, the
 * frame around every page, so it plays on every refresh or first arrival on
 * any route, and stays out of the way when you click between pages inside
 * the site.
 *
 * THE KNOBS, carried over from my natmoges.com settings: the NatFTP HUD logo
 * at 300 px · my screen-recording loop behind it · hold 2.2 seconds · fades
 * of 0.7 seconds on Brett's curve, cubic-bezier(.7,.2,.2,1) · the logo
 * travels 80 px in and 80 px out · Screen blending on the whole layer, the
 * logo cut clear, the video graded to true black.
 *
 * BEFORE LOAD: the preloader is already in the page the server sends, so the
 * first thing painted is the HUD, never a flash of the page and then the HUD.
 *
 * THE INSTANT IT ARRIVES: the logo rises 80 px into the centre and fades in
 * over the video, blended into whatever page is underneath.
 *
 * DURING: it holds for 2.2 seconds. The page underneath is live and visible
 * through the blend; the HUD sits on the screen, not the page, so scrolling
 * moves the page beneath it.
 *
 * AT THE END: the logo lifts 80 px up and out while the video fades. The
 * moment it starts leaving, clicks pass through to the page. When the fade
 * finishes, nothing of it is left on top: no ghost pane.
 *
 * A REPEAT: a refresh plays it again from the start. A link click inside the
 * site does not.
 *
 * FAILURE: if the video or the logo fails to load, the clock still runs and
 * it still leaves on time. Nothing it waits on can trap a visitor.
 *
 * PHONE AND TABLET: never shown, matching my Framer site, where it is desktop
 * only.
 *
 * REDUCED MOTION: no travel. The logo appears in place, holds, and fades.
 */

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./LogoPreloader.module.css";

const FADE_MS = 700;
const LIFT_PX = 80;
const EASE = "cubic-bezier(.7,.2,.2,1)";

type PreloaderPhase = "armed" | "showing" | "leaving" | "gone";

interface LogoPreloaderProps {
    logoSrc: string;
    videoSrc: string;
    posterSrc: string;
    logoSize?: number;
    holdSeconds?: number;
}

export default function LogoPreloader({
    logoSrc,
    videoSrc,
    posterSrc,
    logoSize = 300,
    holdSeconds = 2.2,
}: LogoPreloaderProps) {
    const [phase, setPhase] = useState<PreloaderPhase>("armed");

    useEffect(() => {
        const holdMs = holdSeconds * 1000;

        const showTimer = setTimeout(() => setPhase("showing"), 50);
        const leaveTimer = setTimeout(() => setPhase("leaving"), 50 + holdMs);
        const goneTimer = setTimeout(() => setPhase("gone"), 50 + holdMs + FADE_MS);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(leaveTimer);
            clearTimeout(goneTimer);
        };
    }, [holdSeconds]);

    if (phase === "gone") return null;

    const tempo = {
        "--fade": `${FADE_MS}ms`,
        "--lift": `${LIFT_PX}px`,
        "--ease": EASE,
    } as CSSProperties;

    return (
        <div
            className={styles.stage}
            data-phase={phase}
            style={tempo}
            role="status"
            aria-label="Loading"
        >
            <video
                className={styles.video}
                src={videoSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className={styles.logo}
                src={logoSrc}
                alt="NatFTP"
                width={logoSize}
                draggable={false}
            />
        </div>
    );
}