import Link from "next/link";
import styles from "./not-found.module.css";
import type { Metadata } from "next";

// A wrong address names itself in the tab, instead of borrowing the record's title.
export const metadata: Metadata = { title: "Signal lost · Nat Moges" };

// A wrong address gets the record's own voice, not a white default page.
export default function NotFound() {
    return (
        <main className={styles.lost}>
            <p className={styles.code}>404 · Signal lost</p>
            <h1 className={styles.title}>Nothing is orbiting at this address.</h1>
            <Link href="/" className={styles.home}>
                Back to the record →
            </Link>
        </main>
    );
}
