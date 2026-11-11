import Link from "next/link";
import { CONTACT_URL, PORTFOLIO_URL, REPO_URL } from "../lib/links";
import styles from "./RecordLink.module.css";

/*
 * A WAY BACK FROM EVERY BUILD PAGE.
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
 * ON THE RECORD ITSELF: the same line
 * pinned to the same corner, so every page on the site behaves the same way.
 * There it reads "natmoges.com · Code · Contact": the record is the page
 * already, so its first link is my site, and Contact goes to the email on
 * natmoges.com. The top-left corner is clear there too: the satellite and the
 * beam sit centred, the stratum label sits at 38% down (10% on a phone), the
 * HUD sits at the bottom and the counter on the right.
 *
 * FAILURE: it's three anchors with real hrefs; with no JavaScript, no CSS or
 * a failed font, they're still links that go where they say.
 */
interface RecordLinkProps {
    /** True on the record's own page: the first link becomes my site, and the last one Contact. */
    onRecord?: boolean;
}

export default function RecordLink({ onRecord = false }: RecordLinkProps) {
    if (onRecord) {
        return (
            <nav className={styles.bar} aria-label="Leave the record">
                <a href={PORTFOLIO_URL} className={styles.link}>
                    natmoges.com
                </a>
                <span className={styles.dot} aria-hidden="true">·</span>
                <a href={REPO_URL} className={styles.link}>
                    Code
                </a>
                <span className={styles.dot} aria-hidden="true">·</span>
                <a href={CONTACT_URL} className={styles.link}>
                    Contact
                </a>
            </nav>
        );
    }
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
