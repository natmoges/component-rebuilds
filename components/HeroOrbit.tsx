"use client";

/*
 * HeroOrbit — build #14 of the closer ladder.
 * Reference: Orbital View of Arrakis by Tim Quirino (tim), a Spline
 * community scene and the masthead of timq.xyz. What's mine: on
 * natmoges.com I remixed his scene. I muted his orb, so nothing sifts the
 * dust; I renamed his moons, KEYCAP and THREADS, to MOON_1 and SAT_2, and
 * took out the projects they revealed; and I put the planet under my name
 * instead of over it, so NAT MOGES reads clean. Then I finessed the frame:
 * a 1397 × 576 embed at 1.3 scale, bled past the hero, and pushed right
 * by 240 px. Here it's my own planet, drawn in code. There's no embed and
 * no badge, and it isn't a backdrop anymore. It's Accretion's body.
 *
 * The record makes the planet. Every object the scan keeps falls into the
 * planet's skin and becomes dust, so the planet grows from medium to hero
 * size as you travel. Two moons orbit it from the start, unnamed. Their
 * names, Creative Technologist and Systems Architect, are titles no
 * degree, certificate or mentor gave me, so they don't get printed up
 * front. Each one decodes only once the record has proved it. The title
 * arrives after the evidence, not before.
 *
 * THE KNOBS: my natmoges.com edition kept Tim's look, so these are his
 * numbers, credited: an orthographic camera at zoom 1.7, tilted for a
 * three-quarter view · a planet that turns once every 120 s · a teal rim
 * (4CB2AF) · green contour rings (22C55E) · a dark base (0F1C19) at
 * half opacity · dust in C4D1D6 and 19897C on a curl-noise drift · two
 * orbits at 120 s and 60 s, the second tilted 5 degrees, so the moons
 * pass each other · a soft bloom. Mine: the moons' names and when they're
 * earned, and how much dust each kept object adds.
 *
 * BEFORE LOAD: the server prints today's grey sphere on the right at its
 * starting size, so the body is there from the first paint.
 *
 * THE INSTANT IT ARRIVES: the planet draws its first frame hidden, then
 * fades in over the grey sphere on one bar, so it never shows the
 * stretched first frame my embed has on natmoges.com. It arrives dim and
 * comes online when the BootScreen's GATE line prints: rim, rings and
 * dust light up on the same tick the count does.
 *
 * DURING: the planet turns, the dust drifts off its skin, and the moons
 * orbit. It doesn't follow the pointer: StarCloud and the trail already
 * own the mouse.
 *
 * KEPT: when the scan keeps an object, the beam lets it go and it falls
 * into the planet. It hits the skin in a burst of dust, and the planet
 * grows one step over one bar. Every kept object leaves a little more
 * dust behind, so the planet gets heavier as well as bigger. The count
 * under it reads Accreted 01, 02, and so on.
 *
 * DEBRIS: the planet doesn't move. Debris never reaches it.
 *
 * THE MOONS: two moons on Tim's two orbits, each with a blank label.
 * SYSTEMS ARCHITECT decodes onto its moon when the last kept object from
 * The substrate falls in. CREATIVE TECHNOLOGIST decodes onto the other
 * when the last kept object from The middle floor does, where the creative
 * work meets the code. Each name types itself in with my TextScrambler
 * (build #2), then stays.
 *
 * SCROLLING BACK: a decision stays made, so the mass stays and the names
 * stay. Nothing climbs back out.
 *
 * THE END: the planet at full size, both moons named, the count, and
 * the source line. This build is in the record too, so the planet takes
 * in the object that drew it.
 *
 * SIZE AND PLACE: it stays on the right. It starts medium and grows
 * toward hero size, bleeding off the right edge the way my planet bleeds
 * on natmoges.com. Its left edge never crosses the satellite's orbit
 * around the lock.
 *
 * DEPTH: in front of the stars and StarCloud. Behind the passing
 * objects, the satellite, the beam and the HUD.
 *
 * LEAVING THE TAB: the planet pauses. Coming back, it carries on with no
 * jump.
 *
 * ANY SCREEN: the same speed on 60 Hz and 120 Hz, sharp on Retina, and
 * redrawn to fit when the window changes size.
 *
 * FAILURE: if WebGL can't start, the grey sphere stays and grows the way
 * it does today, with its ring of moons.
 *
 * PHONE: the same planet with half the dust, sitting lower so it doesn't
 * fight the HUD.
 *
 * REDUCED MOTION: Accretion becomes the plain record list, as it is
 * today, so there's no planet to move.
 */

import { Canvas } from "@react-three/fiber";
import styles from "./HeroOrbit.module.css";

const ZOOM = 1.7;
const DEGREE = Math.PI / 180;
const START_SCALE = 0.45;

export interface HeroOrbitProps {
    mass: number;
    isOnline: boolean;
    isArchitectNamed: boolean;
    isTechnologistNamed: boolean;
}

export default function HeroOrbit({ mass }: HeroOrbitProps) {
    return (
        <div className={styles.stage} aria-hidden="true">
            <Canvas
                orthographic
                dpr={[1, 2]}
                camera={{
                    zoom: ZOOM,
                    position: [365.7, 189.8, 307],
                    rotation: [-25.3 * DEGREE, 49.49 * DEGREE, 37.99 * DEGREE],
                    near: -100000,
                    far: 100000,
                }}
            >
                <directionalLight position={[200, 300, 400]} intensity={1.2} />
                <group scale={START_SCALE}>
                    <mesh>
                        <sphereGeometry args={[137.5, 64, 64]} />
                        <meshPhongMaterial color="#0F1C19" emissive="#4CB2AF" emissiveIntensity={0.2} shininess={5} />
                    </mesh>
                </group>
            </Canvas>
        </div>
    );
}