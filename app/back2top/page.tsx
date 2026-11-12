import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Back2Top from "../../components/Back2Top";
import TextScrambler from "../../components/TextScrambler";
import styles from "./page.module.css";
import RecordLink from "../../components/RecordLink";

export const metadata: Metadata = pageMeta(
    "Back2Top · Nat Moges",
    "A rocket that rides you back to the top. The first time a component listened to the whole window instead of just itself. Build 03, rebuilt from BackToTop by The Velox Studio.",
    "/back2top"
);

export default function Back2TopPage() {
  return (
    <main>
      <RecordLink />
      <section className={styles.section}>
        <TextScrambler text="INCOMING TRANSMISSION" />
        <p>scroll down to explore ↓</p>
      </section>
      <section className={styles.section}>
        <p>continue to scroll for a longer ride</p>
      </section>
      <section className={styles.section}>
        <p>enjoy the ride</p>
      </section>
      <Back2Top />
    </main>
  );
}