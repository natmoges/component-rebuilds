// Each page's preview, written once. A shared link to a build page names that
// build in its own words; the image stays the grown planet (app/opengraph-image.png).
import type { Metadata } from "next";

// A page that sets its own preview replaces the home page's, image included, so it names the image.
const SHARE_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "The grown planet at the end of the record, its two moons named Creative Technologist and Systems Architect, with the satellite SAT_1 above." };

export function pageMeta(title: string, description: string, path: string): Metadata {
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: { title, description, url: path, siteName: "Nat Moges", type: "website", images: [SHARE_IMAGE] },
        twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
    };
}
