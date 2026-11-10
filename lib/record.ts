import storedCopy from "../data/accretion.json";

const DATA_SOURCE_ID = "5e4fd1ef-aa6f-4ccc-8ecc-a0a9c029d25a";

export interface Entry {
    id: string;
    title: string;
    when: string;
    stratum: string;
    state: "Kept" | "Debris";
    whatChanged: string;
    lockCondition: string;
    credit: string;
    link: string | null;
    image: string | null;
    snippet: string | null;
    // What the image shows, for anyone who can't see it (polish, the edges). Empty: title and date.
    alt: string | null;
}

export interface Reading {
    entries: Entry[];
    source: "substrate" | "cache";
}

type Text = { plain_text: string }[];

type Row = {
    id: string;
    properties: {
        Title: { title: Text };
        When: { rich_text: Text };
        Stratum: { select: { name: string } | null };
        State: { select: { name: "Kept" | "Debris" } | null };
        "What changed": { rich_text: Text };
        "Lock condition": { rich_text: Text };
        Credit: { rich_text: Text };
        Link: { url: string | null };
        Image: { rich_text: Text };
        Snippet: { rich_text: Text };
        Alt?: { rich_text: Text };
    };
};

function plain(text: Text): string {
    return text.map((piece) => piece.plain_text).join("");
}

function toEntry(row: Row): Entry {
    const p = row.properties;
    return {
        id: row.id,
        title: plain(p.Title.title),
        when: plain(p.When.rich_text),
        stratum: p.Stratum.select?.name ?? "",
        state: p.State.select?.name ?? "Debris",
        whatChanged: plain(p["What changed"].rich_text),
        lockCondition: plain(p["Lock condition"].rich_text),
        credit: plain(p.Credit.rich_text),
        link: p.Link.url,
        image: plain(p.Image.rich_text) || null,
        snippet: plain(p.Snippet.rich_text) || null,
        alt: plain(p.Alt?.rich_text ?? []) || null,
    };
}

async function readSubstrate(): Promise<Entry[]> {
    const response = await fetch(
        `https://api.notion.com/v1/data_sources/${DATA_SOURCE_ID}/query`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
                "Notion-Version": "2025-09-03",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter: { property: "Publish", checkbox: { equals: true } },
                sorts: [{ property: "Order", direction: "ascending" }],
            }),
            next: { revalidate: 60 },
        }
    );
    if (!response.ok) throw new Error(`Substrate unreachable: ${response.status}`);
    const body: { results: Row[] } = await response.json();
    return body.results.map(toEntry);
}

export async function readRecord(): Promise<Reading> {
    try {
        return { entries: await readSubstrate(), source: "substrate" };
    } catch {
        return { entries: storedCopy as Entry[], source: "cache" };
    }
}