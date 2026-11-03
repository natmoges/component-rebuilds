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
 * bounce (restitution) 0.69 · density 1. Gravity 0, 0: space, not my
 * hero's 0.5. Framer University's numbers, credited: walls 100 px thick
 * just past the edges, and their grab spring, which I softened from 0.2 to
 * 0.05 and damped (0.1). The weight is mine, and it isn't density: space
 * drag that depends on speed, thick (0.09) when it's slow and thin (0.006)
 * when it's fast, so effort is rewarded.
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
 * THROWING: let go mid-move and it keeps your speed. A lazy flick barely
 * moves it; only a hard one sends it bouncing around the screen. It spins
 * if you threw it off-centre.
 *
 * HITTING AN EDGE: it bounces off the edges of the screen, keeping about
 * two thirds of its speed. It never leaves the screen, however hard it's
 * thrown, and it passes over the planet without touching it.
 *
 * KEEPING ITS DISTANCE: an invisible orbit, 185 px around the lock, is as
 * close as its centre can ever come to what it scans. Thrown at it, it glances off
 * and slides around the curve, circling the lock instead of covering it.
 *
 * AFTER A THROW: the drag thickens as it slows, so it settles like
 * something heavy instead of gliding, wherever it ends up, turned however
 * it landed. There's no pull home.
 *
 * AT REST: it's never quite still. A slow space current, about 15 px a
 * second, wanders it around where it settled and tumbles it a few degrees,
 * on top of its bob. It drifts; it doesn't travel.
 *
 * SCROLLING: it travels its own orbit around the lock as you scroll,
 * clockwise going down and back the other way going up, at whatever
 * distance it's floating. The orbit is round above the lock and flattened
 * below it, so it turns back above the HUD. When a lock opens the full
 * readout, the readout stays on top and the satellite passes behind it.
 * One lap every three screens or so: scroll faster and it circles faster;
 * stop and it stops travelling.
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

import { useEffect, useRef, type ReactNode } from "react";
import { Bodies, Body, Composite, Constraint, Engine } from "matter-js";
import styles from "./Gravity.module.css";

// My natmoges.com Body settings, carried over.
const FRICTION = 0.08;
const RESTITUTION = 0.69;
const DENSITY = 1;

// Framer University's numbers, credited: walls 100 px thick just past the
// edges, and a grab spring, theirs at 0.2, softened and damped so the
// satellite trails the hand like something heavy.
const WALL_PX = 100;
const GRAB_STIFFNESS = 0.05;
const GRAB_DAMPING = 0.1;

// The weight: space drag that depends on speed (px per 1/60 s). Thick below
// SLOW_SPEED, thin above FAST_SPEED, eased in between. Effort is rewarded.
const DRAG_WHEN_SLOW = 0.09;
const DRAG_WHEN_FAST = 0.006;
const SLOW_SPEED = 10;
const FAST_SPEED = 34;

// The space current: at rest the drag pulls toward this slow, wandering drift
// instead of toward zero, so the satellite is never quite still.
const DRIFT_SPEED = 0.25; // px per 1/60 s, about 15 px a second
const TUMBLE = 0.0008; // rad per 1/60 s at its strongest

// The speed limit: never far enough in one step to cross a wall.
const MAX_SPEED = 90;

// Scrolling drives the satellite around its orbit: one lap per this much
// scroll. Jumps count for at most SCROLL_MAX_PX a frame.
const SCROLL_PER_LAP_PX = 2400;
const SCROLL_MAX_PX = 120;

// Below the lock the orbit flattens so it turns back above the HUD, whose top
// sits at about this share of the screen's height when it shows an entry.
const HUD_TOP_SHARE = 0.78;
const HUD_CLEARANCE_PX = 16;

// The orbit: as close as the satellite can come to the lock. Smaller on small
// screens, never more than this share of the shorter side.
const ORBIT_RADIUS_PX = 185;
const ORBIT_SHARE = 0.3;

// The beam leaves from just under the satellite's belly (this share of its
// height below its centre) and stops short of the lock corners.
const BEAM_START = 0.4;
const BEAM_GAP_PX = 40;

// One step of the world is never longer than 1/60 s, so a slow frame or a
// return to the tab can't throw the satellite.
const MAX_STEP_MS = 1000 / 60;

// How thick space is at this speed: 0 → thick, 1 → thin, smoothly.
function dragFor(speed: number) {
    const t = Math.min(1, Math.max(0, (speed - SLOW_SPEED) / (FAST_SPEED - SLOW_SPEED)));
    const eased = t * t * (3 - 2 * t);
    return DRAG_WHEN_SLOW + (DRAG_WHEN_FAST - DRAG_WHEN_SLOW) * eased;
}

// Where space is pushing at this moment: a few slow waves layered so the
// drift loops without ever repeating in a way you'd notice.
function spaceCurrent(seconds: number) {
    return {
        x: (DRIFT_SPEED * (Math.sin(seconds * 0.21) + 0.5 * Math.sin(seconds * 0.53 + 1.3))) / 1.5,
        y: (DRIFT_SPEED * 0.6 * (Math.cos(seconds * 0.17 + 0.4) + 0.5 * Math.sin(seconds * 0.41 + 2.1))) / 1.5,
        spin: TUMBLE * Math.sin(seconds * 0.29 + 0.7),
    };
}

// How far out the orbit through this point is (its radius above the lock).
// Exact above the lock; below it, unsquashed while that's still reliable.
function reachOf(awayX: number, awayY: number, floor: number) {
    const straight = Math.hypot(awayX, awayY);
    if (awayY > 0 && awayY < floor * 0.95 && straight > floor) {
        return Math.abs(awayX) / Math.sqrt(1 - (awayY * awayY) / (floor * floor));
    }
    return straight;
}

// One frame of travel around the lock. Above the lock the path is a circle;
// below it, a circle squashed so it never drops past `floor`. Works on the
// offset from the lock and returns the new offset.
function travelOrbit(awayX: number, awayY: number, turn: number, floor: number, reach: number) {
    const squash = Math.min(1, floor / reach);

    // Unsquash, turn on the circle, squash again.
    const roundY = awayY > 0 ? awayY / squash : awayY;
    const angle = Math.atan2(roundY, awayX) + turn;
    const nextX = Math.cos(angle) * reach;
    const nextY = Math.sin(angle) * reach;
    return { x: nextX, y: nextY > 0 ? nextY * squash : nextY };
}

interface GravityProps {
    children: ReactNode;
}

export default function Gravity({ children }: GravityProps) {
    const satelliteRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const shadowRef = useRef<Body | null>(null);
    const wallsRef = useRef<Body[]>([]);
    const frameRef = useRef<number | null>(null);
    const grabRef = useRef<Constraint | null>(null);

    useEffect(() => {
        const satellite = satelliteRef.current;
        if (!satellite) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const engine = Engine.create({ gravity: { x: 0, y: 0 } });
        engineRef.current = engine;

        const home = satellite.getBoundingClientRect();
        const shadow = Bodies.rectangle(
            home.left + home.width / 2,
            home.top + home.height / 2,
            home.width,
            home.height,
            {
                friction: FRICTION,
                restitution: RESTITUTION,
                density: DENSITY,
                frictionAir: DRAG_WHEN_SLOW,
            },
        );
        shadowRef.current = shadow;
        Composite.add(engine.world, shadow);

        let homeX = shadow.position.x;
        let homeY = shadow.position.y;
        let twinWidth = home.width;
        let twinHeight = home.height;

        let orbitRadius = ORBIT_RADIUS_PX;

        const placeWalls = () => {
            Composite.remove(engine.world, wallsRef.current);

            const width = window.innerWidth;
            const height = window.innerHeight;
            const half = WALL_PX / 2;
            const wall = { isStatic: true, friction: 1 };
            orbitRadius = Math.min(ORBIT_RADIUS_PX, Math.min(width, height) * ORBIT_SHARE);

            wallsRef.current = [
                Bodies.rectangle(width / 2, -half, width + WALL_PX * 2, WALL_PX, wall),
                Bodies.rectangle(width / 2, height + half, width + WALL_PX * 2, WALL_PX, wall),
                Bodies.rectangle(-half, height / 2, WALL_PX, height + WALL_PX * 2, wall),
                Bodies.rectangle(width + half, height / 2, WALL_PX, height + WALL_PX * 2, wall),
                // The orbit: sized so the satellite's centre stops on the line,
                // and slippery, so it slides around instead of sticking.
                Bodies.circle(width / 2, height / 2, orbitRadius - twinHeight / 2, {
                    isStatic: true,
                    friction: 0,
                }),
            ];
            Composite.add(engine.world, wallsRef.current);
        };

        // The backstop: if the satellite is ever found past an edge, put it
        // back inside and bounce it, at my 0.69.
        const keepOnScreen = () => {
            if (shadow.speed > MAX_SPEED) {
                const scale = MAX_SPEED / shadow.speed;
                Body.setVelocity(shadow, {
                    x: shadow.velocity.x * scale,
                    y: shadow.velocity.y * scale,
                });
            }

            const { min, max } = shadow.bounds;
            const width = window.innerWidth;
            const height = window.innerHeight;
            let pushX = 0;
            let pushY = 0;

            if (min.x < 0) pushX = -min.x;
            else if (max.x > width) pushX = width - max.x;
            if (min.y < 0) pushY = -min.y;
            else if (max.y > height) pushY = height - max.y;

            if (pushX || pushY) {
                Body.translate(shadow, { x: pushX, y: pushY });
                Body.setVelocity(shadow, {
                    x: pushX ? -shadow.velocity.x * RESTITUTION : shadow.velocity.x,
                    y: pushY ? -shadow.velocity.y * RESTITUTION : shadow.velocity.y,
                });
            }

            // Inside the orbit (it should never be): out along the line from
            // the lock, keeping only the speed that runs around the curve.
            const awayX = shadow.position.x - width / 2;
            const awayY = shadow.position.y - height / 2;
            const distance = Math.hypot(awayX, awayY) || 1;
            if (distance < orbitRadius) {
                const outX = awayX / distance;
                const outY = awayY / distance;
                Body.translate(shadow, {
                    x: outX * (orbitRadius - distance),
                    y: outY * (orbitRadius - distance),
                });
                const inward = Math.min(0, shadow.velocity.x * outX + shadow.velocity.y * outY);
                Body.setVelocity(shadow, {
                    x: shadow.velocity.x - inward * outX,
                    y: shadow.velocity.y - inward * outY,
                });
            }
        };

        // The beam: from the satellite to the scan line (the screen's centre),
        // wherever the satellite is. The four values go on Scan's sight only:
        // written on the page root, they made the browser restyle the whole
        // page every frame, and StarCloud stuttered.
        const sight = document.querySelector<HTMLElement>("[data-sight]");

        const aimBeam = (x: number, y: number) => {
            if (!sight) return;

            const dx = window.innerWidth / 2 - x;
            const dy = window.innerHeight / 2 - y;
            const distance = Math.hypot(dx, dy) || 1;
            const start = twinHeight * BEAM_START;
            const length = Math.max(0, distance - start - BEAM_GAP_PX);

            sight.style.setProperty("--beam-x", `${x + (dx / distance) * start}px`);
            sight.style.setProperty("--beam-y", `${y + (dy / distance) * start}px`);
            sight.style.setProperty("--beam-length", `${length}px`);
            sight.style.setProperty("--beam-angle", `${Math.atan2(-dx, dy)}rad`);
        };

        // Scrolling adds up here; the loop turns it into travel around the orbit.
        let lastScrollY = window.scrollY;
        let scrolled = 0;

        const handleScroll = () => {
            scrolled += window.scrollY - lastScrollY;
            lastScrollY = window.scrollY;
        };

        // The orbit's size is remembered between frames, and re-measured only
        // above the lock or after something other than scrolling moved it.
        let orbitReach = 0;
        let placedX = Number.NaN;
        let placedY = Number.NaN;

        let lastTime = performance.now();

        const stepWorld = (now: number) => {
            const step = Math.min(now - lastTime, MAX_STEP_MS);
            lastTime = now;

            Engine.update(engine, step);
            keepOnScreen();
            shadow.frictionAir = dragFor(shadow.speed);

            // Scrolling: carry the twin around the lock at its own distance,
            // clockwise going down. Its speed is left alone, so it's still
            // physics: walls, the orbit and throws all still apply.
            if (scrolled !== 0 && !grabRef.current) {
                const turn =
                    (Math.max(-SCROLL_MAX_PX, Math.min(SCROLL_MAX_PX, scrolled)) / SCROLL_PER_LAP_PX) *
                    Math.PI *
                    2;
                const lockX = window.innerWidth / 2;
                const lockY = window.innerHeight / 2;
                const floor = Math.max(
                    orbitRadius,
                    window.innerHeight * HUD_TOP_SHARE - HUD_CLEARANCE_PX - twinHeight / 2 - lockY,
                );
                const awayX = shadow.position.x - lockX;
                const awayY = shadow.position.y - lockY;
                const moved = !(Math.hypot(shadow.position.x - placedX, shadow.position.y - placedY) < 3);
                if (moved || awayY <= 0) orbitReach = reachOf(awayX, awayY, floor);

                const next = travelOrbit(awayX, awayY, turn, floor, orbitReach);
                placedX = lockX + next.x;
                placedY = lockY + next.y;
                Body.setPosition(shadow, { x: placedX, y: placedY });
            }
            scrolled = 0;

            // The drag removed a share of its motion; when it isn't held,
            // give that share back as the space current.
            if (!grabRef.current) {
                const current = spaceCurrent(now / 1000);
                const grip = shadow.frictionAir;
                Body.setVelocity(shadow, {
                    x: shadow.velocity.x + current.x * grip,
                    y: shadow.velocity.y + current.y * grip,
                });
                Body.setAngularVelocity(shadow, shadow.angularVelocity + current.spin * grip);
            }

            const { x, y } = shadow.position;
            satellite.style.translate = `${x - homeX}px ${y - homeY}px`;
            satellite.style.rotate = `${shadow.angle}rad`;

            aimBeam(x, y);

            frameRef.current = requestAnimationFrame(stepWorld);
        };

        const handlePointerDown = (event: PointerEvent) => {
            satellite.setPointerCapture(event.pointerId);
            satellite.dataset.held = "";

            grabRef.current = Constraint.create({
                pointA: { x: event.clientX, y: event.clientY },
                bodyB: shadow,
                pointB: {
                    x: event.clientX - shadow.position.x,
                    y: event.clientY - shadow.position.y,
                },
                stiffness: GRAB_STIFFNESS,
                damping: GRAB_DAMPING,
                length: 0,
            });
            Composite.add(engine.world, grabRef.current);
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (!grabRef.current) return;
            grabRef.current.pointA = { x: event.clientX, y: event.clientY };
        };

        const handlePointerUp = () => {
            if (!grabRef.current) return;
            Composite.remove(engine.world, grabRef.current);
            grabRef.current = null;
            delete satellite.dataset.held;
        };

        // The screen changed size: walls to the new edges, home re-measured
        // (offset ignores the engine's translate), the twin resized if the
        // satellite did. The satellite itself stays where it is on screen.
        const handleResize = () => {
            placeWalls();

            const width = satellite.offsetWidth;
            const height = satellite.offsetHeight;
            homeX = satellite.offsetLeft + width / 2;
            homeY = satellite.offsetTop + height / 2;

            if (width !== twinWidth || height !== twinHeight) {
                Body.scale(shadow, width / twinWidth, height / twinHeight);
                twinWidth = width;
                twinHeight = height;
            }
        };

        placeWalls();
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, { passive: true });
        satellite.addEventListener("pointerdown", handlePointerDown);
        satellite.addEventListener("pointermove", handlePointerMove);
        satellite.addEventListener("pointerup", handlePointerUp);
        satellite.addEventListener("pointercancel", handlePointerUp);
        satellite.dataset.engine = "on";
        frameRef.current = requestAnimationFrame(stepWorld);

        return () => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
            satellite.removeEventListener("pointerdown", handlePointerDown);
            satellite.removeEventListener("pointermove", handlePointerMove);
            satellite.removeEventListener("pointerup", handlePointerUp);
            satellite.removeEventListener("pointercancel", handlePointerUp);
            delete satellite.dataset.engine;
            for (const name of ["--beam-x", "--beam-y", "--beam-length", "--beam-angle"]) {
                sight?.style.removeProperty(name);
            }
            delete satellite.dataset.held;
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            engineRef.current = null;
            shadowRef.current = null;
            grabRef.current = null;
            wallsRef.current = [];
        };
    }, []);

    return (
        <div ref={satelliteRef} className={styles.satellite}>
            {children}
        </div>
    );
}