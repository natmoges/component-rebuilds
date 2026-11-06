import type { Metadata } from "next";
import TextScrambler from "@/components/TextScrambler";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "TextScrambler · Component Rebuilds",
};

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
