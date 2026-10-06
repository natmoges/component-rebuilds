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
    <main className={`${styles.main} ${spaceGrotesk.className}`}>
      <TextScrambler text="LET'S ARCHITECT" />
    </main>
  );
}
