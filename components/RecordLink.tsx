import Link from "next/link";
import { PORTFOLIO_URL, REPO_URL } from "../lib/links";
import styles from "./RecordLink.module.css";

/*
 * INTEGRATION PASS, FINAL CHECK — a way back from every build page.
 *
 * What I found: the build pages (02–06) had no links at all. The record sends
 * a reader to them in the same tab, so the only way out was the browser's
 * Back button, and someone who landed on one cold (from the README, a search,
 * a shared link) had no way to the record, the code or my site.
 *
 * WHAT IT DOES: a small line pinned to the top-left corner of each build
 * page: "← The record" goes home to Accretion in the same tab, "Code" opens
 * the repo, and "natmoges.com" goes to my site. Plain links, same tab, so
 * Back still works and no tab piles up.
 *
 * WHERE IT SITS: top-left, so it never meets the rocket (bottom-right) or the
 * preloader's HUD (centred). It sits above the page's sections and below the
 * preloader while that plays.
 *
 * TOUCH AND SMALL SCREENS: the same three links, at a tap-sized height.
 *
 * FAILURE: it's three anchors with real hrefs; with no JavaScript, no CSS or
 * a failed font, they're still links that go where they say.
 */
export default function RecordLink() {
    return (
        <nav className={styles.bar} aria-label="Leave this build">
            <Link href="/" className={styles.link}>
                ← The record
            </Link>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href={REPO_URL} className={styles.link}>
                Code
            </a>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href={PORTFOLIO_URL} className={styles.link}>
                natmoges.com
            </a>
        </nav>
    );
}
