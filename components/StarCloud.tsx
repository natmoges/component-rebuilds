"use client";

/*
 * StarCloud — build #11 of the closer ladder.
 * Reference: StarCloud by Sabo Sugi (v1), Framer Marketplace. The blend is
 * mine: on natmoges.com I set his layer to Lighten, so his black background
 * drops out and only the stars land on the hero. Here the stars are drawn on
 * a clear canvas, and Lighten stays on so they sit the same way over
 * Accretion's own stars.
 *
 * Turns Accretion's sky into a place you're moving through. 440 real
 * particles on one canvas, drifting through 3D space and steered by the
 * mouse, the same cloud that flies behind my name on natmoges.com. The
 * twinkling stars and the meteors stay underneath, so the sky has depth:
 * the old stars hold still, the cloud moves.
 *
 * THE KNOBS, carried over from my natmoges.com settings: 440 stars · 3 px ·
 * white · a cloud 1800 px deep · base speed 0.7 · Lighten blending. Sabo's
 * numbers, credited: a 300 px focal length, a 50 px dead zone at the centre,
 * a 150 px ring where diving blends into steering, diving at 10× speed, and
 * steering at 1200 divided by the distance.
 *
 * BEFORE LOAD: the twinkling stars and the meteors, exactly as before. The
 * cloud's canvas is in the page but empty.
 *
 * THE INSTANT IT ARRIVES: on a first visit the cloud is already flying under
 * the HUD, hidden. As the HUD leaves, the cloud fades in on the same 0.7
 * seconds the preloader's starfield fades out, so the stars never thin or
 * double. The only thing you notice leave is the logo.
 *
 * DURING: with the mouse at the centre, the cloud dives at full speed. Move
 * off-centre and it eases from diving into drifting, away from the pointer.
 * Just past the ring it drifts fastest; out toward the edges it slows,
 * like Sabo's.
 *
 * STOPPING: the mouse stops, the cloud keeps flying the way it was told.
 * It never stops on its own.
 *
 * A STAR'S LIFE: each star falls back as it travels, shrinking and
 * dimming toward the centre. When it reaches the far wall it starts over
 * from nothing and fades in, so no star pops in.
 *
 * SCROLLING: the cloud belongs to the screen, not the page. The record
 * scrolls past in front of it.
 *
 * CLICKS: pass straight through the sky to the page.
 *
 * LEAVING THE TAB: the cloud pauses. Coming back, it picks up where it was,
 * with no jump.
 *
 * ANY SCREEN: the same speed on a 60 Hz or a 120 Hz display, sharp on
 * Retina, and redrawn to fit when the window changes size.
 *
 * FAILURE: if the canvas can't draw, Accretion keeps its twinkling stars and
 * meteors, as it is today.
 *
 * TOUCH: on phones and tablets the cloud flies straight ahead at diving
 * speed, like the reference's Phone setting.
 *
 * REDUCED MOTION: one still frame of the cloud, never moving.
 */

import { useEffect, useRef } from "react";
import styles from "./StarCloud.module.css";

const FOCAL_PX = 300;
const MIN_OPACITY = 0.1;
const DIVE_MULTIPLIER = 10;
const DEAD_ZONE_PX = 50;
const BLEND_RING_PX = 150;
const STEER_PX = 1200;
const SABO_FPS = 120;
const FADE_IN_MS = 400;
const MAX_STEP_S = 0.05;

interface Star {
    x: number;
    y: number;
    z: number;
    bornAt: number;
}

interface StarCloudProps {
    starCount?: number;
    starSize?: number;
    starColor?: string;
    cloudSize?: number;
    baseSpeed?: number;
}

export default function StarCloud({
    starCount = 440,
    starSize = 3,
    starColor = "#FFFFFF",
    cloudSize = 1800,
    baseSpeed = 0.7,
}: StarCloudProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const pointerRef = useRef<{ x: number; y: number } | null>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const half = cloudSize / 2;

        starsRef.current = Array.from({ length: starCount }, () => ({
            x: (Math.random() - 0.5) * cloudSize,
            y: (Math.random() - 0.5) * cloudSize,
            z: Math.random() * cloudSize,
            bornAt: -FADE_IN_MS,
        }));

        const respawnStar = (star: Star, now: number) => {
            star.x = (Math.random() - 0.5) * cloudSize;
            star.y = (Math.random() - 0.5) * cloudSize;
            star.z = 0;
            star.bornAt = now;
        };

        let lastTime = performance.now();

        const drawFrame = (now: number) => {
            const step = Math.min((now - lastTime) / 1000, MAX_STEP_S);
            lastTime = now;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const perSecond = baseSpeed * SABO_FPS * step;

            const pointer = pointerRef.current;
            const dx = pointer ? pointer.x - width / 2 : 0;
            const dy = pointer ? pointer.y - height / 2 : 0;
            const distance = Math.hypot(dx, dy);

            let dive = 1;
            let drift = 0;
            if (distance >= DEAD_ZONE_PX + BLEND_RING_PX) {
                dive = 0;
                drift = 1;
            } else if (distance >= DEAD_ZONE_PX) {
                const t = (distance - DEAD_ZONE_PX) / BLEND_RING_PX;
                drift = t * t * (3 - 2 * t);
                dive = 1 - drift;
            }

            const moveZ = DIVE_MULTIPLIER * dive * perSecond;
            const steer = drift > 0 ? (STEER_PX / distance) * drift * perSecond : 0;
            const moveX = drift > 0 ? (-dx / distance) * steer : 0;
            const moveY = drift > 0 ? (-dy / distance) * steer : 0;

            context.clearRect(0, 0, width, height);
            context.fillStyle = starColor;

            for (const star of starsRef.current) {
                star.x += moveX;
                star.y += moveY;
                star.z += moveZ;

                if (star.z > cloudSize) {
                    respawnStar(star, now);
                } else {
                    if (star.x > half || star.x < -half) {
                        star.x -= Math.sign(star.x) * cloudSize;
                        star.bornAt = now;
                    }
                    if (star.y > half || star.y < -half) {
                        star.y -= Math.sign(star.y) * cloudSize;
                        star.bornAt = now;
                    }
                }

                const scale = FOCAL_PX / (FOCAL_PX + star.z);
                const radius = (starSize * scale) / 2;
                const depthAlpha = Math.max(MIN_OPACITY, 1 - star.z / cloudSize);
                const fadeIn = Math.min(1, (now - star.bornAt) / FADE_IN_MS);

                context.globalAlpha = depthAlpha * fadeIn;
                context.beginPath();
                context.arc(
                    width / 2 + star.x * scale,
                    height / 2 + star.y * scale,
                    radius,
                    0,
                    Math.PI * 2,
                );
                context.fill();
            }

            context.globalAlpha = 1;
            frameRef.current = requestAnimationFrame(drawFrame);
        };

        const handleResize = () => {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.round(window.innerWidth * ratio);
            canvas.height = Math.round(window.innerHeight * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            pointerRef.current = { x: event.clientX, y: event.clientY };
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        frameRef.current = requestAnimationFrame(drawFrame);

        return () => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("pointermove", handlePointerMove);
        };
    }, [starCount, starSize, starColor, cloudSize, baseSpeed]);

    return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}