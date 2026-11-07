// Who the record belongs to, written once (polish, readable by a machine). The page's structured
// data and /llms.txt both read from here; the links are the ones lib/links.ts already publishes.
import { PORTFOLIO_URL, REPO_URL } from "./links";

export const SITE_URL = "https://component-rebuilds.vercel.app";
export const NAME = "Nat Moges";
// The two titles the record proves: the moons name themselves with them (build 14).
export const TITLES = ["Creative Technologist", "Systems Architect"];
export const GITHUB_URL = "https://github.com/natmoges";
export const LINKEDIN_URL = "https://www.linkedin.com/in/natmoges";

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
