import type { Metadata } from "next";
import MotionTiles, { type Tile } from "../../components/MotionTiles";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Motion Tiles · Component Rebuilds",
};

const tiles: Tile[] = [
    {
        id: "genesis",
        tag: "GENESIS",
        video: "/motiontiles/genesis.mp4",
        poster: "/motiontiles/genesis.jpg",
        detail: "shotbynat, 2022. A four-collection photo site (Portraits, Events, Adventures, Sports), built on a $5.29 workaround as the door into a real-estate lane I never walked into. I thought a body of work was a portfolio. The instincts were already there: a named taxonomy, a style system, and my own line written over the vendor's footer: Powered by a vision.",
    },
    {
        id: "identity",
        tag: "IDENTITY",
        video: "/motiontiles/identity.mp4",
        poster: "/motiontiles/identity.jpg",
        detail: "a7 III · 28–70",
    },
    {
        id: "direction",
        tag: "DIRECTION",
        video: "/motiontiles/direction.mp4",
        poster: "/motiontiles/direction.jpg",
        detail: "a7 III · 28–70 @ 32mm · ƒ/4 · 1/100 · ISO 5000 · 2019.03.28",
    },
    {
        id: "composition",
        tag: "COMPOSITION",
        video: "/motiontiles/composition.mp4",
        poster: "/motiontiles/composition.jpg",
        detail: "a7 IV · 28–70 @ 28mm · ƒ/3.5 · 1/30 · ISO 320 · 2022.07.30",
    },
    {
        id: "action",
        tag: "ACTION",
        video: "/motiontiles/action.mp4",
        poster: "/motiontiles/action.jpg",
        detail: "a7 III · 28–70 @ 51mm · ƒ/4.5 · 1/1250 · ISO 80 · 2019.04.10",
    },
    {
        id: "documentation",
        tag: "DOCUMENTATION",
        video: "/motiontiles/documentation.mp4",
        poster: "/motiontiles/documentation.jpg",
        detail: "a7 III · 28–70 @ 52mm · ƒ/4.5 · 1/125 · ISO 125 · 2019.04.17",
    },
    {
        id: "synthesis",
        tag: "SYNTHESIS",
        video: "/motiontiles/synthesis.mp4",
        poster: "/motiontiles/synthesis.jpg",
        detail: "NatFTP, 2026. The same photographs, four years later, under a different idea of what a portfolio is for. Not the pictures: the operator, and the system behind them. Identity, direction, composition, action and documentation stopped being genres and became one way of building.",
    },
];

export default function MotionTilesPage() {
    return (
        <main className={styles.main}>
            <MotionTiles tiles={tiles} />
        </main>
    );
}
