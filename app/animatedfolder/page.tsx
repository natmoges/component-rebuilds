import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import AnimatedFolder, { type Project } from "../../components/AnimatedFolder";
import styles from "./page.module.css";
import RecordLink from "../../components/RecordLink";

export const metadata: Metadata = pageMeta(
    "AnimatedFolder · Component Rebuilds",
    "Folders that fan open from data. One component, three copies, three different lists. Build 04, rebuilt from AnimatedFolder by Launchly.",
    "/animatedfolder"
);

const sovereign: Project[] = [
    { id: "artifact", title: "Artifact", image: "/animatedfolder/sovereign-artifact.jpg", link: "https://internal-architecture-brief.my.canva.site/sovereign-infrastructure-case-study" },
    { id: "breakdown", title: "Breakdown", image: "/animatedfolder/sovereign-breakdown.jpg", link: "https://internal-architecture-brief.my.canva.site/sovereign-infrastructure-case-study" },
    { id: "toolchain", title: "Toolchain", image: "/animatedfolder/sovereign-toolchain.jpg", link: "https://internal-architecture-brief.my.canva.site/sovereign-infrastructure-case-study" },
];

const product: Project[] = [
    { id: "artifact", title: "Artifact", image: "/animatedfolder/product-artifact.jpg", link: "https://internal-architecture-brief.my.canva.site/digital-product-engine-case-study" },
    { id: "breakdown", title: "Breakdown", image: "/animatedfolder/product-breakdown.jpg", link: "https://internal-architecture-brief.my.canva.site/digital-product-engine-case-study" },
    { id: "toolchain", title: "Toolchain", image: "/animatedfolder/product-toolchain.jpg", link: "https://internal-architecture-brief.my.canva.site/digital-product-engine-case-study" },
];

const businessOs: Project[] = [
    { id: "artifact", title: "Artifact", image: "/animatedfolder/os-artifact.jpg", link: "https://internal-architecture-brief.my.canva.site/business-operating-system-case-study" },
    { id: "breakdown", title: "Breakdown", image: "/animatedfolder/os-breakdown.jpg", link: "https://internal-architecture-brief.my.canva.site/business-operating-system-case-study" },
    { id: "toolchain", title: "Toolchain", image: "/animatedfolder/os-toolchain.jpg", link: "https://internal-architecture-brief.my.canva.site/business-operating-system-case-study" },
];

export default function AnimatedFolderPage() {
    // The folder's fonts are its knobs; they now come from the shared roles.
    const fonts = {
        titleFont: "var(--font-mono)",
        cardTitleFont: "var(--font-mono)",
        countFont: "var(--font-text)",
    };

    return (
        <main className={styles.main}>
            <RecordLink />
            <AnimatedFolder title="SOVEREIGN INFRASTRUCTURE" projects={sovereign} {...fonts} />
            <AnimatedFolder title="DIGITAL PRODUCT ENGINE" projects={product} {...fonts} />
            <AnimatedFolder title="BUSINESS OPERATING SYSTEM" projects={businessOs} {...fonts} />
        </main>
    );
}