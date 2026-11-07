import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/profile";

// Every page on the site: the record, the index it grew out of, the record as text, and the
// builds that live on their own pages.
const PATHS = ["", "/before", "/llms.txt", "/textscrambler", "/back2top", "/animatedfolder", "/motiontiles", "/signallocation"];

export default function sitemap(): MetadataRoute.Sitemap {
    return PATHS.map((path) => ({ url: `${SITE_URL}${path}` }));
}
