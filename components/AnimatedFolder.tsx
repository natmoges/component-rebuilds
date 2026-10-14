"use client";

/*
 * AnimatedFolder
 *
 * Before anyone touches it, the folder simply sits in the black void like my
 * other components. You see the folder, its tab, the title, a subtitle with
 * the project count, and a second subtitle that says "Hover to explore"
 * ("Tap to explore" on a touch screen).
 *
 * When you hover, keyboard-focus or tap it, it animates like the original:
 * a Signal green outline around the white card with a slight Signal tint,
 * "Hover to explore" disappears, the folder opens, and the cards fan out.
 * The folder holds one to six cards, always fanned out evenly, no matter how
 * many you add. Pass seven or more and the folder shows the first six; the
 * max-of-six message goes to the developer's console, never to a visitor.
 * One card reads "1 project". With zero, the folder stays empty.
 *
 * Hovering, focusing or tapping a card animates it slightly: a Signal border
 * and the image zooms a touch, like it's about to be clicked in.
 *
 * Clicking a card opens the viewer, which zooms out of that card. Inside, you
 * arrow between your cards (the buttons, the arrow keys or the dots; it stops
 * at the first and last card), each with the label you set, and a View
 * button with an external-link icon that opens the link you set for that
 * card (no link, no View button). The image fills its box, so there's no
 * empty space and the viewer never jumps in size (a broken image shows a
 * plain tile with its title). While the viewer is open, it breathes, like
 * the Back2Top rocket.
 *
 * The X, Escape, or a click outside the viewer closes it. The folder goes
 * back to its original, unopened state, even if the mouse is still on it.
 * Hover the white card again and everything starts over: the folder opens
 * and the cards fan out, with however many cards there are.
 *
 * On a phone: tap the folder to fan it, tap a card to open the viewer, tap
 * anywhere outside to close the fan.
 *
 * Reduced motion: no breathing, and the animation goes to a minimum without
 * going dead (the folder tilts and the cards fade into place with no bounce;
 * the viewer fades in instead of zooming; no image zoom; the borders and the
 * tint stay).
 *
 * Reference: AnimatedFolder by Launchly (Framer Marketplace).
 */

import { useEffect, useState, type CSSProperties, type FocusEvent } from "react";
import styles from "./AnimatedFolder.module.css";

export interface Project {
    id: string;
    image: string;
    title: string;
    link?: string;
    alt?: string;
}

export interface FolderTheme {
    folderBack: string;
    folderFront: string;
    folderTab: string;
    cardBackground: string;
    cardBorder: string;
    cardBorderWidth: number;
    cardHoverBorder: string;
    cardHoverBorderWidth: number;
    hoverGlowColor: string;
    projectBackground: string;
    projectBorder: string;
    projectBorderWidth: number;
    projectHoverBorder: string;
    projectHoverBorderWidth: number;
    titleColor: string;
    countColor: string;
    exploreColor: string;
    viewerBackground: string;
    viewerText: string;
    viewerMuted: string;
    backdropColor: string;
}

export interface AnimatedFolderProps {
    title: string;
    projects: Project[];
    theme?: Partial<FolderTheme>;
    titleFont?: string;
    countFont?: string;
    cardTitleFont?: string;
}

const signal = "var(--signal, #22C55E)";
const muted = "var(--muted, #8a8a8f)";

export const defaultTheme: FolderTheme = {
    folderBack: "#1F1F1F",
    folderFront: "#2A2A2A",
    folderTab: signal,
    cardBackground: "#FFFFFF",
    cardBorder: "#4B5563",
    cardBorderWidth: 1,
    cardHoverBorder: signal,
    cardHoverBorderWidth: 2,
    hoverGlowColor: signal,
    projectBackground: "#4C1D95",
    projectBorder: "#4B5563",
    projectBorderWidth: 1,
    projectHoverBorder: signal,
    projectHoverBorderWidth: 2,
    titleColor: "#111827",
    countColor: muted,
    exploreColor: muted,
    viewerBackground: "#FFFFFF",
    viewerText: "#111827",
    viewerMuted: muted,
    backdropColor: "rgba(0, 0, 0, 0.8)",
};

const maxCards = 6;

interface ProjectCardProps {
    project: Project;
    x: number;
    rotate: number;
    delay: number;
    zIndex: number;
    isFanned: boolean;
}

function ProjectCard({ project, x, rotate, delay, zIndex, isFanned }: ProjectCardProps) {
    const [hasImageError, setHasImageError] = useState(false);

    const cardVars = {
        "--x": `${x}px`,
        "--rotate": `${rotate}deg`,
        "--delay": `${delay}ms`,
        zIndex,
    } as CSSProperties;

    return (
        <button
            type="button"
            className={styles.project}
            style={cardVars}
            tabIndex={isFanned ? 0 : -1}
            aria-label={`Open ${project.title}`}
        >
            {!hasImageError && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    className={styles.projectImage}
                    src={project.image}
                    alt={project.alt ?? project.title}
                    ref={(image) => {
                        if (image && image.complete && image.naturalWidth === 0) {
                            setHasImageError(true);
                        }
                    }}
                    onError={() => setHasImageError(true)}
                />
            )}
            <span className={styles.projectTitle}>{project.title}</span>
        </button>
    );
}

export default function AnimatedFolder({
    title,
    projects,
    theme,
    titleFont = "inherit",
    countFont = "inherit",
    cardTitleFont = "inherit",
}: AnimatedFolderProps) {

    const [isFanned, setIsFanned] = useState(false);
    const t = { ...defaultTheme, ...theme };
    const visibleProjects = projects.slice(0, maxCards);
    const count = visibleProjects.length;
    const middle = (count - 1) / 2;
    const fanSpread = count > 1 ? Math.min(55, 200 / (count - 1)) : 0;
    const fanAngle = count > 1 ? Math.min(12, 30 / (count - 1)) : 0;

    useEffect(() => {
        if (projects.length > maxCards) {
            console.warn(
                `AnimatedFolder "${title}": ${projects.length} projects passed, the max is ${maxCards}. Showing the first ${maxCards}.`
            );
        }
    }, [projects.length, title]);

    function handleBlur(event: FocusEvent<HTMLDivElement>) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsFanned(false);
        }
    }

    const themeVars = {
        "--folder-back": t.folderBack,
        "--folder-front": t.folderFront,
        "--folder-tab": t.folderTab,
        "--card-bg": t.cardBackground,
        "--card-border": t.cardBorder,
        "--card-border-width": `${t.cardBorderWidth}px`,
        "--card-hover-border": t.cardHoverBorder,
        "--card-hover-border-width": `${t.cardHoverBorderWidth}px`,
        "--glow": t.hoverGlowColor,
        "--project-bg": t.projectBackground,
        "--project-border": t.projectBorder,
        "--project-border-width": `${t.projectBorderWidth}px`,
        "--project-hover-border": t.projectHoverBorder,
        "--project-hover-border-width": `${t.projectHoverBorderWidth}px`,
        "--title-color": t.titleColor,
        "--count-color": t.countColor,
        "--explore-color": t.exploreColor,
        "--viewer-bg": t.viewerBackground,
        "--viewer-text": t.viewerText,
        "--viewer-muted": t.viewerMuted,
        "--backdrop": t.backdropColor,
        "--title-font": titleFont,
        "--count-font": countFont,
        "--card-title-font": cardTitleFont,
    } as CSSProperties;

    return (
        <div
            className={styles.card}
            style={themeVars}
            data-fanned={isFanned}
            tabIndex={0}
            onMouseEnter={() => setIsFanned(true)}
            onMouseLeave={() => setIsFanned(false)}
            onFocus={() => setIsFanned(true)}
            onBlur={handleBlur}
        >
            <div className={styles.stage}>
                <div className={styles.back} />
                <div className={styles.tab} />
                <div className={styles.fan}>
                    {visibleProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            x={(index - middle) * fanSpread}
                            rotate={(index - middle) * fanAngle}
                            delay={index * 80}
                            zIndex={10 - index}
                            isFanned={isFanned}
                        />
                    ))}
                </div>
                <div className={styles.front} />
                <div className={styles.shine} />
            </div>

            <div className={styles.labels}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.count}>
                    {count} {count === 1 ? "project" : "projects"}
                </p>
            </div>
            <p className={styles.explore}>Hover to explore</p>
        </div>
    );
}