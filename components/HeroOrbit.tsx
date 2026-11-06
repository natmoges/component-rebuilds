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
 * under it reads your scan out of the record: Scanned 01 / 41, 02 / 41,
 * and so on (integration pass, item 2).
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
 * stay. Nothing climbs back out. (Integration item 5: a Rescan is the one
 * way back to zero, and it lands at once.)
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
 * PHONE: the same planet with half the dust. It keeps clear of the
 * scan's lane instead of the satellite's orbit, and bleeds further off
 * the right edge.
 *
 * REDUCED MOTION: Accretion becomes the plain record list, as it is
 * today, so there's no planet to move.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import {
    AdditiveBlending,
    Color,
    Euler,
    Vector3,
    type Group,
    type Mesh,
    type ShaderMaterial,
} from "three";
import TextScrambler from "./TextScrambler";
import styles from "./HeroOrbit.module.css";
import { ARRIVAL_MS } from "../lib/tempo";
import { SIGNAL, WORLD, WORLD_DEEP } from "../lib/tokens";

const ZOOM = 1.7;
const DEGREE = Math.PI / 180;
const START_SCALE = 0.45;
const RADIUS = 137.5;
// The planet's colours come from the shared tokens (integration item 7). Its contours are
// still Signal green, as Tim drew them; by the colour roles they're the world's. Item 8's call.
const RIM = WORLD;
const CONTOUR = SIGNAL;
const BASE = "#0F1C19";
const SPIN_SECONDS = 120;
const MAX_STEP = 1 / 30;
const HERO_SCALE = 1;
const GROW_RATE = 4;
const REFERENCE_STAGE = 1294;
const CAMERA_ROTATION = new Euler(-25.3 * DEGREE, 49.49 * DEGREE, 37.99 * DEGREE);
const CAMERA_POSITION = new Vector3(0, 0, 1).applyEuler(CAMERA_ROTATION).multiplyScalar(500);
const DUST_MAX = 6000;
const DUST_BASE = 800;
const DUST_PER_KEPT = 150;
const DUST_COLORS = ["#C4D1D6", WORLD_DEEP];
const SETTLE_RATE = 3;
const ORBIT_SECONDS = [120, 60];
const ORBIT_TILT = [0, -5 * DEGREE];
const ORBIT_PHASE = [0, -90 * DEGREE];
const ORBIT_RADIUS = RADIUS * 1.6;
const MOON_RADIUS = 10;
const MOON_WHITE = "#F2F5F4";
const MOON_DARK = "#1A1F1E";
const TITLES = ["SYSTEMS ARCHITECT", "CREATIVE TECHNOLOGIST"];
const SPOT = new Vector3();
const CAMERA_RIGHT = new Vector3(1, 0, 0).applyEuler(CAMERA_ROTATION);
const SATELLITE_CLEARANCE = 185 + 24;
const NARROW_WIDTH = 700;
const LANE_CLEARANCE = 22 + 16;

const SKIN_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vLocal;

void main() {
    vLocal = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SKIN_FRAGMENT = /* glsl */ `
uniform vec3 uRim;
uniform vec3 uContour;
uniform vec3 uBase;
uniform float uRadius;
uniform float uLit;

varying vec3 vNormal;
varying vec3 vLocal;

const vec3 VIEW = vec3(0.0, 0.0, 1.0);
const vec3 LIGHT = vec3(-0.4, 0.6, 0.7);
const vec3 AXIS = vec3(0.7071, 0.7071, 0.0);
const float RINGS = 11.0;

void main() {
    vec3 normal = normalize(vNormal);
    float facing = max(dot(normal, VIEW), 0.0);
    float rim = 0.2 + pow(1.0 - facing, 2.0);
    float light = max(dot(normal, normalize(LIGHT)), 0.0);

    float band = dot(vLocal, AXIS) / uRadius * RINGS;
    float line = 1.0 - min(abs(fract(band - 0.5) - 0.5) / fwidth(band), 1.0);

    vec3 color = uBase * (0.7 + 0.6 * light);
    color += uContour * line * 0.35 * uLit;
    color += uRim * rim * 0.6 * mix(0.3, 1.0, uLit);
    float alpha = clamp(0.55 + rim * 0.5 * mix(0.4, 1.0, uLit) + line * 0.2 * uLit, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
}
`;

const DUST_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uRadius;
uniform float uShown;
uniform float uPixelRatio;
uniform float uBurst;

attribute float aSeed;

varying float vAlpha;
varying float vTint;

const float LIFE = 5.0;
const float LIFT = 22.0;
const float SWIRL = 6.0;
const float SIZE = 1.6;

void main() {
    float life = fract(uTime / LIFE + fract(aSeed * 7.31));
    float rise = 1.0 - (1.0 - life) * (1.0 - life);
    vec3 drift = vec3(
        sin(uTime * 0.7 + aSeed * 40.0),
        cos(uTime * 0.5 + aSeed * 30.0),
        sin(uTime * 0.6 + aSeed * 20.0)
    );

    vec3 facingView = normalize(normalMatrix * position);
    float towardLock = 1.0 - smoothstep(-0.8, 0.0, facingView.x);
    float kick = uBurst * towardLock;

    vec3 grain = position * (uRadius * 1.02 + LIFT * rise * (1.0 + 2.5 * kick))
        + drift * SWIRL * rise * (1.0 + kick);

    float isShown = max(step(aSeed, uShown), step(aSeed, uShown + 0.15) * kick);
    vAlpha = isShown * sin(3.14159 * life) * (1.0 + kick);
    vTint = fract(aSeed * 13.7);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(grain, 1.0);
    gl_PointSize = SIZE * uPixelRatio * (1.0 + 0.5 * kick);
}
`;

const DUST_FRAGMENT = /* glsl */ `
uniform vec3 uTintA;
uniform vec3 uTintB;
uniform float uLit;

varying float vAlpha;
varying float vTint;

void main() {
    vec2 point = gl_PointCoord - 0.5;
    if (dot(point, point) > 0.25) discard;
    vec3 color = mix(uTintA, uTintB, step(0.5, vTint));
    gl_FragColor = vec4(color, vAlpha * mix(0.15, 0.85, uLit));
    #include <colorspace_fragment>
}
`;

const TRAIL_VERTEX = /* glsl */ `
varying float vAngle;

void main() {
    vAngle = atan(position.y, position.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const TRAIL_FRAGMENT = /* glsl */ `
varying float vAngle;

void main() {
    float behind = fract(vAngle / 6.28318);
    float alpha = pow(1.0 - behind, 3.0) * 0.9;
    gl_FragColor = vec4(vec3(1.0), alpha);
    #include <colorspace_fragment>
}
`;

function grainsOf(count: number, seed: number) {
    let state = seed;
    const next = () => {
        state = (state * 16807) % 2147483647;
        return state / 2147483647;
    };
    const position = new Float32Array(count * 3);
    const grainSeed = new Float32Array(count);
    for (let index = 0; index < count; index++) {
        const height = next() * 2 - 1;
        const angle = next() * Math.PI * 2;
        const ring = Math.sqrt(1 - height * height);
        position[index * 3] = ring * Math.cos(angle);
        position[index * 3 + 1] = height;
        position[index * 3 + 2] = ring * Math.sin(angle);
        grainSeed[index] = next();
    }
    return { position, seed: grainSeed };
}

export interface HeroOrbitProps {
    mass: number;
    fullMass: number;
    // How long an arrival takes to land. A scanned object takes the absorb; what the record
    // reveals, or a Rescan, lands at once (integration item 5).
    arrivalMs?: number;
    isOnline: boolean;
    isArchitectNamed: boolean;
    isTechnologistNamed: boolean;
}

function Planet({ isOnline }: { isOnline: boolean }) {
    const planetRef = useRef<Mesh>(null);
    const skinRef = useRef<ShaderMaterial>(null);
    const skin = useMemo(
        () => ({
            uRim: { value: new Color(RIM) },
            uContour: { value: new Color(CONTOUR) },
            uBase: { value: new Color(BASE) },
            uRadius: { value: RADIUS },
            uLit: { value: 0 },
        }),
        []
    );

    useFrame((_, delta) => {
        const planet = planetRef.current;
        const material = skinRef.current;
        if (planet === null || material === null) return;
        const step = Math.min(delta, MAX_STEP);
        planet.rotation.y += (step / SPIN_SECONDS) * Math.PI * 2;

        const lit = material.uniforms.uLit;
        const target = isOnline ? 1 : 0;
        lit.value += (target - lit.value) * (1 - Math.exp(-step * GROW_RATE));
    });

    return (
        <mesh ref={planetRef}>
            <sphereGeometry args={[RADIUS, 64, 64]} />
            <shaderMaterial
                ref={skinRef}
                transparent
                uniforms={skin}
                vertexShader={SKIN_VERTEX}
                fragmentShader={SKIN_FRAGMENT}
            />
        </mesh>
    );
}

function Dust({ mass, isOnline }: { mass: number; isOnline: boolean }) {
    const dustRef = useRef<ShaderMaterial>(null);
    const impactRef = useRef(mass);
    const grains = useMemo(() => grainsOf(DUST_MAX, 11), []);
    const air = useMemo(
        () => ({
            uTime: { value: 0 },
            uRadius: { value: RADIUS },
            uShown: { value: 0 },
            uPixelRatio: { value: 1 },
            uLit: { value: 0 },
            uBurst: { value: 0 },
            uTintA: { value: new Color(DUST_COLORS[0]) },
            uTintB: { value: new Color(DUST_COLORS[1]) },
        }),
        []
    );

    useFrame((state, delta) => {
        const material = dustRef.current;
        if (material === null) return;
        const step = Math.min(delta, MAX_STEP);
        const ease = 1 - Math.exp(-step * GROW_RATE);
        const knobs = material.uniforms;

        knobs.uTime.value += step;
        knobs.uPixelRatio.value = state.viewport.dpr;
        knobs.uLit.value += ((isOnline ? 1 : 0) - knobs.uLit.value) * ease;

        const half = window.innerWidth < NARROW_WIDTH ? 0.5 : 1;
        const shown = (Math.min(DUST_BASE + mass * DUST_PER_KEPT, DUST_MAX) / DUST_MAX) * half;
        knobs.uShown.value += (shown - knobs.uShown.value) * ease;

        if (mass > impactRef.current) knobs.uBurst.value = 1;
        impactRef.current = mass;
        knobs.uBurst.value *= Math.exp(-step * SETTLE_RATE);
    });

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[grains.position, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[grains.seed, 1]} />
            </bufferGeometry>
            <shaderMaterial
                ref={dustRef}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
                uniforms={air}
                vertexShader={DUST_VERTEX}
                fragmentShader={DUST_FRAGMENT}
            />
        </points>
    );
}

function Moon({
    index,
    titlesRef,
}: {
    index: number;
    titlesRef: RefObject<(HTMLSpanElement | null)[]>;
}) {
    const orbitRef = useRef<Group>(null);
    const moonRef = useRef<Mesh>(null);
    const skin = useMemo(
        () => ({
            uRim: { value: new Color(MOON_WHITE) },
            uContour: { value: new Color(MOON_WHITE) },
            uBase: { value: new Color(MOON_DARK) },
            uRadius: { value: MOON_RADIUS },
            uLit: { value: 1 },
        }),
        []
    );

    useFrame((state, delta) => {
        const orbit = orbitRef.current;
        const moon = moonRef.current;
        if (orbit === null || moon === null) return;
        const step = Math.min(delta, MAX_STEP);
        orbit.rotation.y += (step / ORBIT_SECONDS[index]) * Math.PI * 2;

        const title = titlesRef.current[index];
        if (title === null || title === undefined) return;
        moon.getWorldPosition(SPOT).project(state.camera);
        const x = ((SPOT.x + 1) / 2) * state.size.width;
        const y = ((1 - SPOT.y) / 2) * state.size.height;
        title.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });

    return (
        <group rotation={[ORBIT_TILT[index], 0, 0]}>
            <group ref={orbitRef} rotation={[0, ORBIT_PHASE[index], 0]}>
                <mesh ref={moonRef} position={[ORBIT_RADIUS, 0, 0]}>
                    <sphereGeometry args={[MOON_RADIUS, 32, 32]} />
                    <shaderMaterial
                        transparent
                        uniforms={skin}
                        vertexShader={SKIN_VERTEX}
                        fragmentShader={SKIN_FRAGMENT}
                    />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[ORBIT_RADIUS, 1.4, 6, 256]} />
                    <shaderMaterial
                        transparent
                        depthWrite={false}
                        blending={AdditiveBlending}
                        vertexShader={TRAIL_VERTEX}
                        fragmentShader={TRAIL_FRAGMENT}
                    />
                </mesh>
            </group>
        </group>
    );
}

function Body({
    mass,
    fullMass,
    stageRef,
    children,
}: {
    mass: number;
    fullMass: number;
    stageRef: RefObject<HTMLDivElement | null>;
    children: ReactNode;
}) {
    const growthRef = useRef<Group>(null);

    useFrame((state, delta) => {
        const growth = growthRef.current;
        if (growth === null) return;

        const zoom = ZOOM * (state.size.height / REFERENCE_STAGE);
        if (state.camera.zoom !== zoom) {
            state.camera.zoom = zoom;
            state.camera.updateProjectionMatrix();
        }

        const share = fullMass > 0 ? Math.min(mass / fullMass, 1) : 0;
        const target = START_SCALE + (HERO_SCALE - START_SCALE) * share;
        const step = Math.min(delta, MAX_STEP);
        const current = growth.scale.x;
        growth.scale.setScalar(current + (target - current) * (1 - Math.exp(-step * GROW_RATE)));

        const radiusPx = RADIUS * growth.scale.x * zoom;
        const width = window.innerWidth;
        const lockX = width / 2;
        const stageX = lockX + Math.min(width * 0.3, 420);
        const clearance = width < NARROW_WIDTH ? LANE_CLEARANCE : SATELLITE_CLEARANCE;
        const edgeX = lockX + clearance + radiusPx;
        const shiftPx = Math.max(0, edgeX - stageX);
        growth.position.copy(CAMERA_RIGHT).multiplyScalar(shiftPx / zoom);

        const host = stageRef.current?.parentElement;
        if (host === null || host === undefined) return;
        const radius = `${Math.round(radiusPx)}px`;
        const shift = `${Math.round(shiftPx)}px`;
        if (host.style.getPropertyValue("--planet-radius") !== radius) {
            host.style.setProperty("--planet-radius", radius);
        }
        if (host.style.getPropertyValue("--planet-shift") !== shift) {
            host.style.setProperty("--planet-shift", shift);
        }
    });

    return (
        <group ref={growthRef} scale={START_SCALE}>
            {children}
        </group>
    );
}

function canDraw(): boolean {
    try {
        return document.createElement("canvas").getContext("webgl2") !== null;
    } catch {
        return false;
    }
}

export default function HeroOrbit({
    mass,
    fullMass,
    arrivalMs = ARRIVAL_MS,
    isOnline,
    isArchitectNamed,
    isTechnologistNamed,
}: HeroOrbitProps) {
    const [isDrawn, setIsDrawn] = useState(false);
    const [hasFailed, setHasFailed] = useState(() => !canDraw());
    const [landed, setLanded] = useState({ mass, isArchitectNamed, isTechnologistNamed });
    const stageRef = useRef<HTMLDivElement>(null);
    const pendingRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const titlesRef = useRef<(HTMLSpanElement | null)[]>([]);
    const named = [landed.isArchitectNamed, landed.isTechnologistNamed];

    // Each arrival lands on its own clock, so a second object in flight never holds back the
    // first. Anything that lands at once overtakes whatever is still in flight.
    useEffect(() => {
        const next = { mass, isArchitectNamed, isTechnologistNamed };
        if (arrivalMs === 0) {
            pendingRef.current.forEach(clearTimeout);
            pendingRef.current = [];
        }
        const arrival = setTimeout(() => {
            pendingRef.current = pendingRef.current.filter((pending) => pending !== arrival);
            setLanded(next);
        }, arrivalMs);
        pendingRef.current.push(arrival);
    }, [mass, isArchitectNamed, isTechnologistNamed, arrivalMs]);

    useEffect(() => () => pendingRef.current.forEach(clearTimeout), []);

    useEffect(() => {
        function handleLeave() {
            const stage = stageRef.current;
            if (stage === null) return;
            stage.style.transition = "none";
            stage.style.visibility = "hidden";
        }
        window.addEventListener("beforeunload", handleLeave);
        window.addEventListener("pagehide", handleLeave);
        return () => {
            window.removeEventListener("beforeunload", handleLeave);
            window.removeEventListener("pagehide", handleLeave);
        };
    }, []);

    function handleContextLost() {
        const host = stageRef.current?.parentElement;
        host?.style.removeProperty("--planet-radius");
        host?.style.removeProperty("--planet-shift");
        setIsDrawn(false);
        setHasFailed(true);
    }

    function handleCreated(state: RootState) {
        state.gl.domElement.addEventListener("webglcontextlost", handleContextLost, { once: true });
        requestAnimationFrame(() => requestAnimationFrame(() => setIsDrawn(true)));
    }

    if (hasFailed) return null;

    return (
        <div ref={stageRef} className={styles.stage} data-orbit-drawn={isDrawn} aria-hidden="true">
            <Canvas
                orthographic
                dpr={[1, 2]}
                onCreated={handleCreated}
                camera={{
                    zoom: ZOOM,
                    position: CAMERA_POSITION.toArray(),
                    rotation: CAMERA_ROTATION.toArray().slice(0, 3) as [number, number, number],
                    near: -100000,
                    far: 100000,
                }}
            >
                <Body mass={landed.mass} fullMass={fullMass} stageRef={stageRef}>
                    <Planet isOnline={isOnline} />
                    <Dust mass={landed.mass} isOnline={isOnline} />
                    {TITLES.map((title, index) => (
                        <Moon key={title} index={index} titlesRef={titlesRef} />
                    ))}
                </Body>
            </Canvas>
            {TITLES.map((title, index) => (
                <span
                    key={title}
                    ref={(element) => {
                        titlesRef.current[index] = element;
                    }}
                    className={styles.title}
                >
                    {named[index] ? (
                        <TextScrambler
                            text={title}
                            className={styles.titleText}
                            textColor="var(--fg)"
                            scrambleColor="var(--muted)"
                            durationMs={2000}
                        />
                    ) : (
                        <span className={styles.slot} />
                    )}
                </span>
            ))}
        </div>
    );
}