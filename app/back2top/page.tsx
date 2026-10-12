import type { Metadata } from "next";
import Back2Top from "../../components/Back2Top";
import TextScrambler from "../../components/TextScrambler";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Back2Top · Component Rebuilds",
};

export default function Back2TopPage() {
  return (
    <main>
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