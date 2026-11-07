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
 * at 540 px, so the title under the wordmark reads · my screen-recording loop 
 * behind it · hold 2.2 seconds · fades
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
 * FAILURE: if the video or the logo fails to load, the clock still runs and it 
 * still leaves on time. If the code itself never arrives, the HUD clears itself 
 * about three seconds after it should have left. Nothing it waits on can trap a 
 * visitor.
 *
 * PHONE AND TABLET: never shown, and the video is never downloaded, matching my
 * Framer site, where it is desktop only.
 *
 * REDUCED MOTION: no travel. The logo appears in place, holds, and fades.
 */

/*
 * POLISH, DEEP SPACE FIRST. On natmoges.com the preloader opens on space
 * black, and when it leaves you arrive in the charcoal: deep space first, then
 * our own neighbourhood. In Framer that is a Difference layer under the HUD.
 * Here the HUD only uses Screen, which can brighten the page but never darken
 * it, so it arrived on charcoal with nowhere to arrive from.
 *
 * THE VOID: one more layer under the HUD, painted in the sky's own colours and
 * set to Difference. Where the page is sky it cancels to black. Where something
 * bright is drawn (the name, the stars, the planet) it barely moves. You see
 * the page's lights in deep space, not a black curtain over it.
 *
 * IT MATCHES THE SKY IT COVERS: on Accretion the sky falls to the horizon
 * glow, so the void carries the same fall, and the glow comes back up with
 * the charcoal. Every other page is plain charcoal, so its void is too.
 *
 * FROM FIRST PAINT: it is in the page the server sends, so the first frame is
 * already black, never a flash of charcoal first.
 *
 * THE ARRIVAL: when the HUD lifts out, the void fades on the same 0.7 s curve
 * and the charcoal comes up around you. Clicks pass through it the whole time.
 *
 * FAILURE, PHONE, REDUCED MOTION: it leaves with the HUD and on the same
 * backstop · never shown where the HUD isn't (phones, tablets) · reduced
 * motion keeps the fade, since nothing here travels.
 */

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./LogoPreloader.module.css";

const FADE_MS = 700;
const LIFT_PX = 80;
const EASE = "cubic-bezier(.7,.2,.2,1)";
const ARRIVE_DELAY_MS = 50;
const BACKSTOP_SLACK_MS = 3000;

type PreloaderPhase = "armed" | "leaving" | "gone";

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
    logoSize = 540,
    holdSeconds = 2.2,
}: LogoPreloaderProps) {
    const [phase, setPhase] = useState<PreloaderPhase>("armed");
    const holdMs = holdSeconds * 1000;

    useEffect(() => {
        // The arrival already ran in CSS from first paint. Count the hold from
        // the start of the visit, not from when this code woke up.
        const leaveAt = ARRIVE_DELAY_MS + holdMs;
        const leaveIn = Math.max(0, leaveAt - performance.now());

        const leaveTimer = setTimeout(() => setPhase("leaving"), leaveIn);
        const goneTimer = setTimeout(() => setPhase("gone"), leaveIn + FADE_MS);

        return () => {
            clearTimeout(leaveTimer);
            clearTimeout(goneTimer);
        };
    }, [holdMs]);

    if (phase === "gone") return null;

    const tempo = {
        "--fade": `${FADE_MS}ms`,
        "--lift": `${LIFT_PX}px`,
        "--ease": EASE,
        "--arrive-delay": `${ARRIVE_DELAY_MS}ms`,
        "--backstop": `${ARRIVE_DELAY_MS + holdMs + FADE_MS + BACKSTOP_SLACK_MS}ms`,
    } as CSSProperties;

    return (
        <>
            {/* The void: the sky cancelled to black, under the HUD. A sibling, not a child, because
                the stage's Screen blend isolates its children from the page. */}
            <div className={styles.void} data-phase={phase} style={tempo} aria-hidden="true" />
            <div
                className={styles.stage}
                data-phase={phase}
                style={tempo}
                role="status"
                aria-label="Loading"
            >
                <video
                    className={styles.video}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                >
                    <source
                        src={videoSrc}
                        type="video/mp4"
                        media="(min-width: 810px) and (hover: hover)"
                    />
                </video>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className={styles.logo}
                    src={logoSrc}
                    alt="NatFTP"
                    width={logoSize}
                    draggable={false}
                />
            </div>
        </>
    );
}
