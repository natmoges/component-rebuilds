import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import TextScrambler from "@/components/TextScrambler";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TextScrambler · Component Rebuilds",
};

export default function TextScramblerPage() {
    return (
        <main className={spaceGrotesk.className}>
            <section className={styles.spacer}>↓ scroll</section>
            <section className={styles.stage}>
                <TextScrambler text="LET'S ARCHITECT" />
            </section>
            <section className={styles.spacer}>↑ scroll back up to replay</section>
        </main>
    );
}
