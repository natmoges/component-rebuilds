import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/profile";

// Polish, readable by a machine: every reader is welcome, and the sitemap says where everything is.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
