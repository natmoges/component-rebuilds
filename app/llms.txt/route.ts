// Polish, readable by a machine: the record as plain text, for a model reading on someone's behalf.
// It reads Notion the same way the page does, so the two can't disagree.
import { readRecord, type Entry } from "../../lib/record";
import { NAME, TITLES, SITE_URL, GITHUB_URL, LINKEDIN_URL } from "../../lib/profile";
import { REPO_URL, PORTFOLIO_URL, CONTACT_URL } from "../../lib/links";

export const revalidate = 60;

function line(entry: Entry): string {
    const link = entry.link ? ` (${entry.link})` : "";
    return `- **${entry.title}** · ${entry.when}${link}: ${entry.whatChanged}`;
}

export async function GET() {
    const { entries, source } = await readRecord();
    const kept = entries.filter((entry) => entry.state === "Kept");
    const debris = entries.filter((entry) => entry.state === "Debris");
    const strata = [...new Set(entries.map((entry) => entry.stratum))];

    const text = [
        `# ${NAME} · Accretion`,
        "",
        `> ${NAME}'s public record, ${source === "substrate" ? "read live from his Notion" : "from the stored copy of his Notion record"}, oldest first. ` +
            "Every entry is either kept (the record can prove it) or debris (not yet, with what would lock it). " +
            "Nothing is promoted because it looks good; the state is a field in the database.",
        "",
        `Titles: ${TITLES.join(" · ")}, the two names the planet's moons take once the record proves each one.`,
        "",
        "## Where to verify",
        "",
        `- [The page this text mirrors](${SITE_URL})`,
        `- [The code, commit by commit](${REPO_URL}/commits/main): every build's paragraph sits above its code`,
        `- [Portfolio](${PORTFOLIO_URL}) · [Contact](${CONTACT_URL})`,
        `- [GitHub](${GITHUB_URL}) · [LinkedIn](${LINKEDIN_URL})`,
        "",
        ...strata.flatMap((stratum) => {
            const inStratum = kept.filter((entry) => entry.stratum === stratum);
            return inStratum.length === 0 ? [] : [`## Kept · Stratum ${stratum}`, "", ...inStratum.map(line), ""];
        }),
        "## Debris · not yet claimed",
        "",
        ...debris.map((entry) => `${line(entry)} Locks when: ${entry.lockCondition || "never; it stays a seam."}`),
        "",
    ].join("\n");

    return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
