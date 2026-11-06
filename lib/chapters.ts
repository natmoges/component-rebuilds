import type { Entry } from "./record";

// The record's chapters (integration item 9): each stratum's number, name and years, read from
// the entries themselves, so a new entry in Notion moves the years with it. Kept apart from
// lib/record.ts so the page's client code never pulls in the Notion read.
export interface Chapter {
    label: string;
    name: string;
    years: string;
}

export function chapterOf(entries: Entry[], stratum: string): Chapter {
    const [number, ...rest] = stratum.split(" · ");
    const inStratum = entries.filter((entry) => entry.stratum === stratum);
    const years = inStratum.flatMap((entry) => (entry.when.match(/\b(19|20)\d{2}\b/g) ?? []).map(Number));
    const span =
        years.length === 0
            ? (inStratum[0]?.when ?? "")
            : Math.min(...years) === Math.max(...years)
              ? String(years[0])
              : `${Math.min(...years)}–${Math.max(...years)}`;
    return { label: `Stratum ${number}`, name: rest.join(" · ") || stratum, years: span };
}
