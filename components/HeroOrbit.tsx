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

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    AdditiveBlending,
    Color,
    Euler,
    Vector3,
    type Group,
    type Mesh,
    type ShaderMaterial,
} from "three";
import styles from "./HeroOrbit.module.css";

const ZOOM = 1.7;
const DEGREE = Math.PI / 180;
const START_SCALE = 0.45;
const RADIUS = 137.5;
const RIM = "#4CB2AF";
const CONTOUR = "#22C55E";
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
const DUST_COLORS = ["#C4D1D6", "#19897C"];
const ARRIVAL_MS = 3000;
const SETTLE_RATE = 3;
const ORBIT_SECONDS = [120, 60];
const ORBIT_TILT = [0, -5 * DEGREE];
const ORBIT_PHASE = [0, -90 * DEGREE];
const ORBIT_RADIUS = RADIUS * 1.6;
const MOON_RADIUS = 10;
const MOON_WHITE = "#F2F5F4";
const MOON_DARK = "#1A1F1E";

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

        const shown = Math.min(DUST_BASE + mass * DUST_PER_KEPT, DUST_MAX) / DUST_MAX;
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

function Moon({ seconds, tilt, phase }: { seconds: number; tilt: number; phase: number }) {
    const orbitRef = useRef<Group>(null);
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

    useFrame((_, delta) => {
        const orbit = orbitRef.current;
        if (orbit === null) return;
        const step = Math.min(delta, MAX_STEP);
        orbit.rotation.y += (step / seconds) * Math.PI * 2;
    });

    return (
        <group rotation={[tilt, 0, 0]}>
            <group ref={orbitRef} rotation={[0, phase, 0]}>
                <mesh position={[ORBIT_RADIUS, 0, 0]}>
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

function Body({ mass, fullMass, children }: { mass: number; fullMass: number; children: ReactNode }) {
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
    });

    return (
        <group ref={growthRef} scale={START_SCALE}>
            {children}
        </group>
    );
}

export default function HeroOrbit({ mass, fullMass, isOnline }: HeroOrbitProps) {
    const [isDrawn, setIsDrawn] = useState(false);
    const [landedMass, setLandedMass] = useState(mass);
    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mass === landedMass) return;
        const arrival = setTimeout(() => setLandedMass(mass), ARRIVAL_MS);
        return () => clearTimeout(arrival);
    }, [mass, landedMass]);

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

    function handleCreated() {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsDrawn(true)));
    }

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
                <Body mass={landedMass} fullMass={fullMass}>
                    <Planet isOnline={isOnline} />
                    <Dust mass={landedMass} isOnline={isOnline} />
                    {ORBIT_SECONDS.map((seconds, index) => (
                        <Moon
                            key={seconds}
                            seconds={seconds}
                            tilt={ORBIT_TILT[index]}
                            phase={ORBIT_PHASE[index]}
                        />
                    ))}
                </Body>
            </Canvas>
        </div>
    );
}