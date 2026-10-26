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

export default function MotionTiles({
    title = "VISUAL SYSTEMS: A Creative Arc (2019-2022)",
    tiles,
}: MotionTilesProps) {
    return (
        <section className={styles.root}>
            <h2 className={styles.title}>{title}</h2>
            <ul className={styles.tiles}>
                {tiles.map((tile) => (
                    <li key={tile.id} className={styles.tile}>
                        <video
                            className={styles.video}
                            src={tile.video}
                            poster={tile.poster}
                            muted
                            loop
                            playsInline
                            autoPlay
                        />
                        <span className={styles.tag}>{tile.tag}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
