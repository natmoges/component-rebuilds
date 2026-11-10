import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import TextScrambler from "@/components/TextScrambler";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta(
    "TextScrambler · Component Rebuilds",
    "A signal fighting through noise. My first reusable component: one set of knobs, used anywhere. Build 02, rebuilt from TextScrambler by Solt Wagner.",
    "/textscrambler"
);

export default function TextScramblerPage() {
    return (
        <main className={styles.page}>
            <section className={styles.spacer}>↓ scroll</section>
            <section className={styles.stage}>
                <TextScrambler text="LET'S ARCHITECT" />
            </section>
            <section className={styles.spacer}>↑ scroll back up to replay</section>
        </main>
    );
}
