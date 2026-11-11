// Who the record belongs to, written once (polish, readable by a machine). The page's structured
// data and /llms.txt both read from here; the links are the ones lib/links.ts already publishes.
import { PORTFOLIO_URL, REPO_URL } from "./links";

export const SITE_URL = "https://record.natmoges.com";
export const NAME = "Nat Moges";
// The two titles the record proves: the moons name themselves with them (build 14).
export const TITLES = ["Creative Technologist", "Systems Architect"];
export const GITHUB_URL = "https://github.com/natmoges";
export const LINKEDIN_URL = "https://www.linkedin.com/in/natmoges";

// The roles he's going for, each with the public evidence for it (polish, readable by a machine;
// Operating Parameters → Target role types, Nov 7, 2026). Public evidence only: never interview outcomes.
export const TARGET_ROLES: { role: string; evidence: string }[] = [
    { role: "Creative technologist", evidence: "the whole record end to end (the music, the media, the systems, the builds) and natmoges.com" },
    {
        role: "Design engineer, including founding roles",
        evidence: "fourteen React + TypeScript builds, each from a credited reference, each specced in a paragraph before any code",
    },
    {
        role: "Forward-deployed engineer / AI-native builder",
        evidence: "the integration pass, where three models read the site cold, the findings were reconciled, an AI co-pilot edited the repo and every change was tested before it was committed",
    },
    {
        role: "Front-end / web developer (Framer, Next.js), with an AI co-pilot",
        evidence: "natmoges.com composed in Framer; this site in Next.js, reading Notion on the server. React / TypeScript: familiar, not fluent",
    },
    {
        role: "Systems / knowledge architect (AI ops)",
        evidence: "the Notion operating system this page reads from; a private cloud run alone since June 2023",
    },
    {
        role: "Creative / growth consulting",
        evidence: "the 56-Day Sprint, run as an instrumented campaign and audited in public; prodbynat, from session to storefront",
    },
];

export const profileData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: SITE_URL,
    name: `Accretion · ${NAME}`,
    mainEntity: {
        "@type": "Person",
        name: NAME,
        jobTitle: TITLES.join(" & "),
        url: PORTFOLIO_URL,
        sameAs: [PORTFOLIO_URL, GITHUB_URL, LINKEDIN_URL, REPO_URL],
    },
};
