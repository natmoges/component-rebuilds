"use client";

/*
 * Motion Tiles. Seven video tiles stand in a tilted 3D stack, each one a
 * chapter of the 2019–2022 arc.
 *
 * Before anyone engages: all seven videos play at once, like the original,
 * and the stack breathes: the tiles drift slightly apart and back together in
 * a slow, staggered cadence, like an accordion. A tile whose video hasn't
 * loaded, or won't play, stays in place as a transparent glass placeholder,
 * so the stack never has a gap.
 *
 * Engaging: the moment the pointer enters the stack's airspace (or, on
 * phones, the moment the stack scrolls into view), the breathing settles and
 * the title and the seven chapter words fade in on a glass panel.
 *
 * Hover (desktop) / first tap (phone): the tile under the pointer is
 * selected. It sinks back slightly, its chapter word lights up, and it keeps
 * playing while the other six pause where they are. Moving to another tile
 * hands the selection over the same way.
 *
 * Leaving: the selection latches. The last tile stays selected and playing.
 * The stack does not go back to breathing.
 *
 * Click (desktop) / second tap (phone): the selected tile lifts out of the
 * stack and glides to the centre, growing so it can be inspected up close.
 * Light and clean, not a heavy modal. Its detail line appears beneath it in
 * Signal green: the camera line for a photograph, the story for GENESIS and
 * SYNTHESIS. The video stays muted, with no controls.
 *
 * Closing: the X, a click outside the tile, or Escape sends it back to its
 * place in the stack, still selected.
 *
 * Keyboard: every tile is a real button. Tab moves the selection, Enter opens
 * the tile.
 *
 * Reduced motion: no breathing, no 3D sink, no glide. Selection, the lit
 * word, play/pause and open/close still happen, as plain fades.
 *
 * Reference: Motion Tiles by Uzair J., Framer Marketplace.
 */

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import { X } from "lucide-react";
import styles from "./MotionTiles.module.css";

export interface Tile {
    id: string;
    tag: string;
    video: string;
    poster: string;
    detail: string;
}

export interface MotionTilesProps {
    title?: string;
    tiles: Tile[];
}

function splitIntoRows<T>(items: T[], rowCount: number): T[][] {
    const base = Math.floor(items.length / rowCount);
    const extra = items.length % rowCount;
    const rows: T[][] = [];
    let start = 0;
    for (let row = 0; row < rowCount; row++) {
        const size = base + (row < extra ? 1 : 0);
        rows.push(items.slice(start, start + size));
        start += size;
    }
    return rows.filter((row) => row.length > 0);
}

function isMotionReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function MotionTiles({
    title = "VISUAL SYSTEMS: A Creative Arc (2019-2022)",
    tiles,
}: MotionTilesProps) {
    const [activeTile, setActiveTile] = useState<number | null>(null);
    const [hasEngaged, setHasEngaged] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const tileRefs = useRef<(HTMLLIElement | null)[]>([]);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const figureRef = useRef<HTMLElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const tagRows = splitIntoRows(
        tiles.map((tile, index) => ({ tile, index })),
        3
    );

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video === null) return;
            video.muted = true;
            const shouldPlay =
                !isExpanded && (activeTile === null || index === activeTile);
            if (shouldPlay) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, [activeTile, isExpanded]);

    useEffect(() => {
        const stage = stageRef.current;
        if (stage === null || hasEngaged) return;
        const isTouch = window.matchMedia("(hover: none)").matches;
        if (!isTouch) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setHasEngaged(true);
            },
            { threshold: 0.5 }
        );
        observer.observe(stage);

        return () => observer.disconnect();
    }, [hasEngaged]);

    const glideFrames = useCallback((index: number): Keyframe[] | null => {
        const tile = tileRefs.current[index];
        const figure = figureRef.current;
        if (tile === null || tile === undefined || figure === null) return null;
        const from = tile.getBoundingClientRect();
        const to = figure.getBoundingClientRect();
        const dx = from.left + from.width / 2 - (to.left + to.width / 2);
        const dy = from.top + from.height / 2 - (to.top + to.height / 2);
        const scale = from.width / to.width;
        return [
            { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.6 },
            { transform: "none", opacity: 1 },
        ];
    }, []);

    useLayoutEffect(() => {
        if (!isExpanded || activeTile === null) return;
        const figure = figureRef.current;
        const backdrop = backdropRef.current;
        if (figure === null || backdrop === null) return;

        backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
        const frames = isMotionReduced() ? null : glideFrames(activeTile);
        if (frames === null) {
            figure.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
        } else {
            figure.animate(frames, {
                duration: 450,
                easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            });
        }
        closeRef.current?.focus();
    }, [isExpanded, activeTile, glideFrames]);

    const handleClose = useCallback(() => {
        const figure = figureRef.current;
        const backdrop = backdropRef.current;
        if (figure === null || backdrop === null || activeTile === null) {
            setIsExpanded(false);
            return;
        }
        const glide = isMotionReduced() ? null : glideFrames(activeTile);
        const frames = glide === null ? [{ opacity: 1 }, { opacity: 0 }] : [...glide].reverse();
        backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 300,
            fill: "forwards",
        });
        const closing = figure.animate(frames, {
            duration: 350,
            easing: "cubic-bezier(0.4, 0, 0.6, 1)",
            fill: "forwards",
        });
        closing.onfinish = () => setIsExpanded(false);
    }, [activeTile, glideFrames]);

    useEffect(() => {
        if (!isExpanded) return;
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") handleClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isExpanded, handleClose]);

    function handleEngage() {
        setHasEngaged(true);
    }

    function handleSelect(index: number) {
        setActiveTile(index);
    }

    function handleTileClick(index: number) {
        if (index !== activeTile) {
            setActiveTile(index);
            return;
        }
        setIsExpanded(true);
    }

    const openTile = isExpanded && activeTile !== null ? tiles[activeTile] : null;

    return (
        <section className={styles.root}>
            <div className={styles.panel} data-engaged={hasEngaged}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.tags}>
                    {tagRows.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.tagRow}>
                            {row.map(({ tile, index }) => (
                                <span
                                    key={tile.id}
                                    className={styles.tag}
                                    data-active={index === activeTile}
                                >
                                    {tile.tag}
                                    {index < tiles.length - 1 ? " →" : ""}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div
                ref={stageRef}
                className={styles.stage}
                onPointerEnter={handleEngage}
            >
                <ul
                    className={styles.stack}
                    data-engaged={hasEngaged}
                    style={{ "--middle": (tiles.length - 1) / 2 } as CSSProperties}
                >
                    {tiles.map((tile, index) => {
                        const isActive = index === activeTile;
                        return (
                            <li
                                key={tile.id}
                                ref={(element) => {
                                    tileRefs.current[index] = element;
                                }}
                                className={styles.tile}
                                data-active={isActive}
                                style={{ "--index": index } as CSSProperties}
                                onMouseEnter={() => handleSelect(index)}
                                onClick={() => handleTileClick(index)}
                            >
                                <video
                                    ref={(element) => {
                                        videoRefs.current[index] = element;
                                    }}
                                    className={styles.video}
                                    src={tile.video}
                                    poster={tile.poster}
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>

            {openTile !== null && (
                <div
                    ref={backdropRef}
                    className={styles.backdrop}
                    role="dialog"
                    aria-modal="true"
                    aria-label={openTile.tag}
                    onClick={handleClose}
                >
                    <figure
                        ref={figureRef}
                        className={styles.figure}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <video
                            className={styles.expandedVideo}
                            src={openTile.video}
                            poster={openTile.poster}
                            muted
                            loop
                            playsInline
                            autoPlay
                        />
                        <button
                            ref={closeRef}
                            type="button"
                            className={styles.close}
                            aria-label="Close"
                            onClick={handleClose}
                        >
                            <X size={12} strokeWidth={1.75} />
                        </button>
                        <figcaption className={styles.caption}>
                            <span className={styles.captionTag}>{openTile.tag}</span>
                            <p className={styles.detail}>{openTile.detail}</p>
                        </figcaption>
                    </figure>
                </div>
            )}
        </section>
    );
}