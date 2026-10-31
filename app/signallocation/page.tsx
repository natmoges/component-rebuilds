import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import SignalLocation from "../../components/SignalLocation";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Signal Location · Component Rebuilds",
};

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function SignalLocationPage() {
    return (
        <main className={`${styles.main} ${robotoMono.className}`}>
            <p className={styles.caption}>INTERCEPTED TRANSMISSION</p>
            <SignalLocation />
            <p className={styles.caption}>
                COORDINATES RESOLVED FROM YOUR CURRENT CONNECTION IN REAL TIME.
            </p>
        </main>
    );
}