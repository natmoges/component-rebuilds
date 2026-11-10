import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import SignalLocation from "../../components/SignalLocation";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta(
    "Signal Location · Component Rebuilds",
    "Finds where you're reading from, on my own route, fresh every visit. Five states on one tempo. Build 06, rebuilt from Live Location by Amr Rashed.",
    "/signallocation"
);

export default function SignalLocationPage() {
    return (
        <main className={styles.main}>
            <p className={styles.caption}>INTERCEPTED TRANSMISSION</p>
            <SignalLocation />
            <p className={styles.caption}>
                COORDINATES RESOLVED FROM YOUR CURRENT CONNECTION IN REAL TIME.
            </p>
        </main>
    );
}