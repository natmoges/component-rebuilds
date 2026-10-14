import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import AnimatedFolder, { type Project } from "../../components/AnimatedFolder";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "AnimatedFolder · Component Rebuilds",
};

const robotoMono = Roboto_Mono({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

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
    const fonts = {
        titleFont: robotoMono.style.fontFamily,
        cardTitleFont: robotoMono.style.fontFamily,
        countFont: inter.style.fontFamily,
    };

    return (
        <main className={styles.main}>
            <AnimatedFolder title="SOVEREIGN INFRASTRUCTURE" projects={sovereign} {...fonts} />
            <AnimatedFolder title="DIGITAL PRODUCT ENGINE" projects={product} {...fonts} />
            <AnimatedFolder title="BUSINESS OPERATING SYSTEM" projects={businessOs} {...fonts} />
        </main>
    );
}