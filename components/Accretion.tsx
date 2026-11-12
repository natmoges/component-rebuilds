/*
 * Accretion: build #7 of the closer ladder.
 * Reference: none. The first build with nothing to copy.
 *
 * My record, read from deep space. Every object in it comes from Notion, the
 * substrate it has always lived in, read on the server before the page
 * reaches you. Nothing is polished to match: each object is shown at the
 * quality it really had, so the distance between them can be seen.
 *
 * BEFORE LOAD: pitch black, and the only light is the stars, twinkling.
 *
 * THE FIRST BAR: a satellite drifts in and holds its position.
 *
 * SCROLLING: scrolling is travel. Objects stream past like a comet shower,
 * oldest first, so the further you go, the later they are.
 *
 * THE SCAN: as each object passes, the satellite hunts. Then the record
 * decides.
 *
 * KEPT: if the record can prove it, the scan locks and the tractor beam holds
 * it. Its data decodes onto a green, see-through HUD like my TextScrambler
 * (build #2): date, title, what changed, credit. Tap it to land on the real
 * thing. Then it is pulled into a body that grows as you scroll. That is the
 * accretion.
 *
 * DEBRIS: if the record can't prove it yet, the beam loses its hold, its lock
 * condition shows for a moment, and it falls back into the debris. When the
 * proof arrives in Notion, the next visit keeps it.
 *
 * THE TEMPO: scan, lock and decode land on one beat, SignalLocation's
 * one-second bar of eight ticks.
 *
 * SCROLLING BACK: objects reverse with the scroll. No re-scan; a decision
 * stays made.
 *
 * THE END: the body, one line on where the data came from, kept and debris
 * counted, and a link to /before, the index this page grew out of.
 *
 * FAILURE: if the substrate can't be reached, the satellite reads the stored
 * copy and the HUD says "from cache".
 *
 * IPHONE: the same scene; tap where a desktop would hover.
 *
 * REDUCED MOTION: the stars hold still, and the HUD becomes a list read top
 * to bottom, kept first, then debris.
 */

/*
 * ONE SPACE.
 * What I found: each build placed itself, so nothing knew where anything
 * else was. The satellite's orbit carried it straight across the planet.
 * The count sat on the planet's face, crossed by the moons' path. The
 * moons' blank title slots drew little lines in the air before they had
 * anything to say. Here the scene keeps one rule: everything knows where
 * the planet is, and nothing sits on top of it by accident.
 *
 * THE PLANET IS THE LANDMARK: HeroOrbit already tells the page its radius
 * and how far it has slid. Everything below reads those two numbers.
 *
 * THE SATELLITE KEEPS ITS DISTANCE: a second invisible ring, around the
 * planet this time, the planet's radius plus a margin. The satellite
 * glances off it and slides around the curve, the same way it already
 * circles the lock instead of covering it. Thrown at the planet, it
 * bounces off the atmosphere.
 *
 * THE COUNT SITS AT THE LIMB: under the planet, just past its edge, and
 * it moves out as the planet grows. It belongs to the planet, but it's
 * never painted on it, and the moons' path never crosses it.
 *
 * THE MOONS SAY NOTHING UNTIL THEY'VE EARNED IT: no blank slot, no line.
 * A title appears only when it decodes.
 *
 * THE KNOBS: the planet's ring at its radius plus 32 px · the count 20 px
 * below the limb · the moons' slots hidden until named.
 *
 * WHAT STAYS: the planet is see-through, the way Tim made it, so stars
 * and meteors behind it show through its skin. (Decided: hologram, not a
 * stone.)
 *
 * FAILURE: if WebGL can't start, the grey sphere's own size stands in for
 * the planet's radius, and everything keeps its distance from that.
 *
 * PHONE: the same rules, at the phone's planet size.
 *
 * REDUCED MOTION: unchanged. The plain record list, no scene.
 */

/*
 * THE FRAME.
 * What I found: once the boot hands over, the page never says whose it is
 * or where its record comes from. The only way back up 30,000 px of record
 * is to scroll it. And the end is a dead end: one link, to /before. Back2Top
 * (build #3) was finished and sitting unused. Here the page names itself
 * inside the HUD it already has, lends you the rocket for the ride home,
 * and makes the end of the record its payoff. No new frame and no nav
 * bar: the satellite's HUD is the only chrome.
 *
 * WHOSE IT IS: once the boot hands over, the HUD's top line stays put:
 * NAT MOGES · READ LIVE FROM NOTION. From the stored copy, it says so.
 *
 * THE ROCKET: past 30% of the record, Back2Top appears bottom right,
 * breathing, the same rocket as build #3 and natmoges.com, clear of the
 * planet and its count. Tap it and the record rides back past you to the
 * top, inside three seconds. The ride doesn't scan: nothing hunts while
 * you're carried. Scroll, and the ride breaks where you are, and scanning
 * resumes from there.
 *
 * RESCAN, NOW WITH THE RIDE: everything goes back to zero, and the rocket
 * carries you to the start, so the record begins again from the first
 * object.
 *
 * THE END IS THE PAYOFF: the grown planet, both moons named, and the HUD's
 * last transmission. The record's numbers, then where to go:
 * the build, commit by commit (the repo: every paragraph above its code,
 * every commit in order) · natmoges.com · contact · the index this page
 * grew out of. The seam stays findable. Rescan last.
 *
 * THE KNOBS: the rocket at 30% · the ride inside three seconds · the
 * proof link to the repo.
 *
 * FAILURE: if the record comes from the stored copy, the HUD's top line
 * and the end card say so. The links don't depend on it.
 *
 * PHONE: the rocket is a tap, the links are taps, and the HUD keeps its
 * width. Where the HUD fills the screen's width, the rocket rides just
 * above the HUD's left corner instead, in thumb reach.
 *
 * KEYBOARD: tab to the rocket, enter, and focus lands at the top of the
 * page, as in build #3.
 *
 * REDUCED MOTION: the plain record list ends with the same lines: whose
 * it is, the record's numbers, the repo, natmoges.com, contact, /before.
 * The rocket jumps instead of riding.
 */

/*
 * POLISH.
 * What I found: with the pieces integrated, what's left is rhythm and
 * composition. The meteors fall like rain: eighteen streaks, one angle,
 * one pace. The left third of the screen holds nothing but passing
 * matter. Every object gets the same 90vh, kept or debris, so the record
 * reads as a list, not a history. And sometimes the planet's rings turn
 * edge-on and read as stripes. Here the sky gets weather, the record gets
 * chapters, and the planet keeps its face.
 *
 * METEORS: rare and varied. Fewer at once, each with its own angle (within
 * one shared direction), speed, length and brightness, and every so often
 * a bright one with a teal tail. Scrolling still stretches them.
 *
 * THE LEFT THIRD: the record's chapters. As you cross into a stratum, its
 * name and years surface on the left in my portfolio's telemetry voice
 * (BUILDING ALONE · 2023–2025), then fade as you read on. Not a frame and
 * not a position readout: a chapter title that comes and goes.
 *
 * THE RHYTHM: measured, not guessed. Passages tighten from 90vh to 75vh, so
 * the record reads as one sitting, while each object still holds at the
 * lock long enough to decode at an easy scroll. Debris passes quicker than
 * what's kept. A short breath between strata marks the chapters.
 *
 * THE RINGS: tilted toward the camera, so they always read as nested
 * curves, as on my hero, whatever the spin.
 *
 * THE KNOBS: meteor count and spread · the chapter title's hold · the
 * passage heights, kept and debris · the breath between strata · BAR stays
 * 1000 ms, and the tempo is confirmed as final.
 *
 * PHONE: the chapter title takes the top-left corner, across the sky from
 * the satellite, not a left third the phone doesn't have. (Corrected in
 * item 10: it first sat above the HUD and ran into the lock.)
 *
 * REDUCED MOTION: meteors still. The plain list gets the strata as
 * headings.
 */

/*
 * THE PRE-LOCK AUDIT'S FIXES.
 * What I found: running the site as a stranger, at every speed, the scan
 * had a cliff. At an easy scroll every object decodes; a little faster
 * and none do, because an object only hunts while it sits at the lock. A
 * brisk reader got "Scanning…" all the way down. On my own laptop the
 * grown planet pushed both moons off the edge, so the payoff was two names
 * pinned to the side. A shared link showed a blank card. A reload dropped
 * you mid-record under a replaying boot. And the strongest proof rows hid
 * their story behind a tap.
 *
 * BEFORE: the boot, as before. Every visit now starts at the top, where
 * the boot is, reload or not.
 *
 * THE INSTANT IT LOCKS: the object becomes the satellite's target, and its
 * hunt runs to the end even if you scroll on. While it's busy, what passes
 * is left for the finale. So speed thins the reading instead of switching
 * it off.
 *
 * DURING: the HUD reads what it last read until the next object is caught,
 * instead of blinking back to "Scanning…". A card holds while the next
 * object decodes, up to a bar, so its title decodes once, and the next
 * card takes over the moment it lands, so none is skipped. Stay with a
 * kept object for two bars and its story replaces the picture on its own.
 * A link says where it goes, opens in a new tab, and a link back to this
 * page is dropped.
 *
 * AT THE END: the grown planet is framed so both moons stay on screen. On
 * a laptop it's the biggest planet whose moons fit between the satellite's
 * lane and the edge.
 *
 * A REPEAT VISIT: the planet carries the record and says only that; no
 * "scanned 00" under a full planet.
 *
 * THE KNOBS: the hunt (0.75 bar) · a card's hold (a bar) · the auto-read
 * (two bars) · the moons' reach (1.53 radii, measured from the camera).
 *
 * PHONE: unchanged layout; the hint says tap. With a mouse it says click.
 *
 * REDUCED MOTION: the plain list opens with my name and one line on what
 * it is. A wrong address gets a 404 in the record's voice, and a shared
 * link gets a frame of the grown planet.
 */

/*
 * ONE MOVING ARTIFACT.
 * What I found: every artifact in the record was a still, so the four
 * builds that live on their own pages showed what they look like but
 * never what they do. Here one of them moves: Motion Tiles shows five
 * seconds of its Synthesis tile, the layers collapsing into the NatFTP
 * plate. One clip, not four: the page's one interaction is still the
 * scroll.
 *
 * WHAT MAKES IT A CLIP: the row's Image ends in .mp4. Its still sits
 * beside it under the same name, as a .jpg, and stands in until the clip
 * can play, if it never can, and wherever motion is reduced.
 *
 * THE INSTANT IT'S CAUGHT: the clip loads, muted and inline, and plays
 * from the start. Never with the page.
 *
 * AT THE END: it plays once and stops on its last frame, the resolved
 * plate. Then the story replaces it, the way a still's story replaces it
 * after two bars.
 *
 * THE KNOBS: 5 s · 720 px wide · 217 KB · no sound.
 *
 * FAILURE: if the clip stalls or won't play, the story comes after two
 * bars anyway. If it can't load at all, the record reads as it would with
 * no artifact.
 *
 * PHONE: the same clip, inline.
 *
 * REDUCED MOTION: the still, never the clip.
 */

/*
 * READABLE BY A MACHINE.
 * What I found: I asked an AI the question a recruiter would, cold, about
 * both my sites. Here it read the whole record, found the repo and told
 * proven from claimed on its own. natmoges.com came back with "no code
 * repositories found": the proof was a link away and nothing pointed to
 * it. More and more, the first reader of a page isn't a person. It's a
 * model fetching the link someone pasted, and it can't see a planet, a
 * hover or a PDF it can't open. Like the old résumé parsers, it reads the
 * text, so the text has to carry everything.
 *
 * THE SENTENCE FOR STRANGERS: the page's opening text (hidden while the
 * scan runs, shown with motion reduced, read by every machine) says what
 * kept and debris mean, that the satellite scans what you pass and the
 * planet grows from what you keep, and what the strata and the seams are.
 *
 * WHO I AM, AS DATA: a schema.org ProfilePage about one Person in the
 * page's head: name, the two titles the record proves, and the places to
 * check (natmoges.com, the repo, LinkedIn). Links I already publish,
 * nothing new.
 *
 * /llms.txt: the record as plain text, read from Notion the same way the
 * page is, so it can't drift from it: who, what's kept, what's debris and
 * what would lock it, and where to verify. A proposal more than a
 * standard; cheap, and one source.
 *
 * THE DOORS: robots.txt lets every reader in and names the sitemap, which
 * lists every page.
 *
 * THE ROLES (added Nov 7): /llms.txt names the roles I'm going for, each
 * with the public evidence for it, from lib/profile.ts. Public evidence
 * only: what happened in a room stays out of a public page.
 *
 * FAILURE: if Notion can't be read, /llms.txt reads the stored copy and
 * says so, as the page does.
 */

/*
 * ROOM TO LOOK.
 * What I found: reading my own record at my own pace, the HUD changed
 * before my eye had taken a card in. A snippet, a picture or the clip got
 * about a second before the next object took the screen, and the objects
 * sat so close that the next one was already in frame while I read the
 * last. The scan felt like it was sitting on the object before it instead
 * of travelling.
 *
 * THE ROOM: about a screen per kept object. Each one holds at the lock
 * over 65vh of scroll, with 35vh of open sky before it (15vh before
 * debris, which still passes quicker) and a 30vh breath before each
 * stratum. The drifting matter keeps its spacing from the same numbers.
 *
 * THE TIME: a card holds before the next one may take the HUD: a bar for
 * debris, two for a kept object, five for one with an artifact (a
 * picture, a snippet, the clip). At five bars the artifact gives way to
 * its story, unless the clip is still playing.
 *
 * WHAT DOESN'T WAIT: the satellite. It keeps scanning while a card holds,
 * so nothing you pass goes unrecorded. If you scroll past several objects
 * while an artifact holds, you get the newest card when it lets go, and
 * the ones in between still fall into the planet.
 *
 * THE KNOBS: DEBRIS_CARD_MS · KEPT_CARD_MS · ARTIFACT_CARD_MS in
 * lib/tempo.ts · --approach · --breath and the 65vh hold in
 * Accretion.module.css.
 *
 * REDUCED MOTION: unchanged. No HUD, nothing holds.
 */

/*
 * THE EDGES.
 * What I found: the repo still wore the starter's face. Every tab showed
 * Next.js's logo, five of its SVGs sat unused, the build pages borrowed
 * the home page's preview, and the record's screenshots were silent to
 * anyone who can't see them. The README's notes for 07, 13 and 14
 * described the page as it shipped, in the present tense.
 *
 * THE FACE: the beam from my HUD, the T with me in it, as the tab icon:
 * the first thing the preloader shows is the last thing the tab keeps.
 * At home-screen size it's my bedroom studio, the icon natmoges.com
 * uses. Both repos. The five starter SVGs and one orphaned image go.
 * History isn't rewritten; the first commit stays the seam.
 *
 * THE PREVIEWS: every page says what it is, in its own words, and a
 * shared link to a build page names that build.
 *
 * THE PICTURES: each artifact names what it shows, read from the record
 * (Alt), and falls back to its title and date.
 *
 * THE NOTES: 07, 13 and 14 are labelled as shipped, with their dates,
 * and The integration pass lists what it changed.
 *
 * THE COUNT (added after approval): Vercel Web
 * Analytics, cookieless. It counts visits to each page and nothing else:
 * no cookie, nothing that follows a visitor between sites. The README
 * says so in one line.
 *
 * FAILURE: no icon falls back to the browser's blank; no Alt falls back
 * to the title and date; analytics blocked by an extension changes
 * nothing on the page.
 */

import Link from "next/link";
import { readRecord } from "../lib/record";
import { tempoStyle, recordCountOf } from "../lib/tempo";
import { REPO_URL, PORTFOLIO_URL, CONTACT_URL } from "../lib/links";
import { chapterOf } from "../lib/chapters";
import Scan from "./Scan";
import StarCloud from "./StarCloud";
import Gravity from "./Gravity";
import styles from "./Accretion.module.css";

function starField(count: number, seed: number): string {
    let state = seed;
    const next = () => {
        state = (state * 16807) % 2147483647;
        return state / 2147483647;
    };
    return Array.from(
        { length: count },
        () => `${Math.round(next() * 2560)}px ${Math.round(next() * 1600)}px #fff`
    ).join(", ");
}

// SAT_1, a probe drawn in the planet's own language. Its dish is a record:
// grooves in Tim's green inside the world's teal rim, a highlight sweeping round at 33⅓. Lit by the
// planet's key light (upper left): the body's top catches it, its left face is half lit, its
// right face is in shade. The grooves light as the planet fills (Scan's data-grooves).
function Satellite() {
    return (
        <svg className={styles.satellite} viewBox="0 0 120 64" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
                <line x1="51" y1="17" x2="16.4" y2="11.9" />
                <circle cx="14" cy="11.5" r="2.6" fill="currentColor" fillOpacity="0.25" />
                <line x1="69" y1="17" x2="99" y2="25.5" />
                <rect x="99" y="23" width="11" height="5.5" rx="1.5" transform="rotate(16 104.5 25.75)" fill="currentColor" fillOpacity="0.14" />
                <polygon points="55.5,18.3 51,15 51,21 55.5,24.3" fill="currentColor" fillOpacity="0.18" />
                <polygon points="64.5,18.3 55.5,18.3 55.5,24.3 64.5,24.3" fill="currentColor" fillOpacity="0.1" />
                <polygon points="69,15 64.5,18.3 64.5,24.3 69,21" fill="currentColor" fillOpacity="0.04" />
                <polygon points="69,15 64.5,18.3 55.5,18.3 51,15 55.5,11.7 64.5,11.7" fill="currentColor" fillOpacity="0.32" />
                <line x1="60" y1="24.3" x2="60" y2="30.8" />
                <g className={styles.dish}>
                    <g transform="translate(60 40) scale(1 0.42)">
                        <circle className={styles.rim} r="22" />
                        <circle className={styles.groove} data-groove="1" r="19.5" />
                        <circle className={styles.groove} data-groove="2" r="17" />
                        <circle className={styles.groove} data-groove="3" r="14.5" />
                        <circle className={styles.groove} data-groove="4" r="12" />
                        <circle className={styles.groove} data-groove="5" r="9.5" />
                        <circle className={styles.groove} data-groove="6" r="7" />
                        <g className={styles.sweep}>
                            <circle r="22" stroke="none" />
                            <path d="M0 0 L22 0 A22 22 0 0 1 15.6 15.6 Z" stroke="none" />
                        </g>
                        <circle className={styles.beacon} r="2.5" stroke="none" />
                    </g>
                </g>
            </g>
            <text className={styles.tag} x="86" y="49">SAT_1</text>
        </svg>
    );
}

export default async function Accretion() {
    const { entries, source } = await readRecord();
    const strataCount = new Set(entries.map((entry) => entry.stratum)).size;
    const record = recordCountOf(entries);

    return (
        <main className={styles.space} style={tempoStyle} data-sky="horizon">
            <div className={styles.stars} aria-hidden="true">
                <span className={styles.starLayer} style={{ boxShadow: starField(140, 7) }} />
                <span className={styles.starLayer} style={{ boxShadow: starField(60, 23) }} />
                <span className={styles.starLayer} style={{ boxShadow: starField(24, 41) }} />
                <StarCloud />
            </div>

            <Gravity>
                <Satellite />
            </Gravity>
            <Scan entries={entries} source={source} />

            {/* The page's name. Read aloud on every visit; shown with the plain
                list when motion is reduced, where it's the first thing on the page. */}
            <header className={styles.intro}>
                <h1>Nat Moges · Accretion</h1>
                <p>
                    My record, oldest first, {source === "substrate" ? "read live from Notion" : "from the stored copy"}.
                    What the record can prove is kept; what it can&apos;t yet is debris, with what would lock it.
                    Scrolling is travel: SAT_1, the satellite, scans each object as you pass, and the planet grows
                    from what you keep. The record runs in {strataCount} strata, from before it began to now, and the
                    seams stay showing: what each build was made from, and who it&apos;s credited to.
                </p>
            </header>

            <ol className={styles.record}>
                {entries.map((entry, index) => (
                    <li key={entry.id} className={styles.entry} data-state={entry.state}>
                        {/* The strata as headings in the plain list. */}
                        {(index === 0 || entries[index - 1].stratum !== entry.stratum) && (
                            <p className={styles.recordChapter}>
                                {chapterOf(entries, entry.stratum).label} · {chapterOf(entries, entry.stratum).name} ·{" "}
                                {chapterOf(entries, entry.stratum).years}
                            </p>
                        )}
                        <span className={styles.when}>{entry.when}</span>
                        <h2 className={styles.title}>
                            {entry.link ? <a href={entry.link}>{entry.title}</a> : entry.title}
                        </h2>
                        <p>{entry.whatChanged}</p>
                        {entry.credit && <p className={styles.credit}>{entry.credit}</p>}
                        {entry.state === "Debris" && (
                            <p className={styles.lock}>Locks when: {entry.lockCondition}</p>
                        )}
                    </li>
                ))}
            </ol>
            <p className={styles.source}>
                Nat Moges · {source === "substrate" ? "Read live from Notion" : "From the stored copy"} ·{" "}
                {record.kept} kept ·{" "}
                {record.debris} debris
            </p>
            <nav className={styles.seam} aria-label="Where to go from here">
                <a href={REPO_URL}>The build, commit by commit</a> · <a href={PORTFOLIO_URL}>natmoges.com</a> ·{" "}
                <a href={CONTACT_URL}>Contact</a> · <Link href="/before">The index this page grew out of</Link>
            </nav>
        </main>
    );
}