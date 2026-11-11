import Accretion from "../components/Accretion";
import SmoothScroll from "../components/SmoothScroll";
import TrailCursor from "../components/TrailCursor";
import RecordLink from "../components/RecordLink";
import { profileData } from "../lib/profile";
import type { Metadata } from "next";

// The build pages each name their own address (lib/meta.ts). The record's home page didn't, so it does here.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
    return (
        <>
            {/* Polish, readable by a machine: who this record belongs to, as data. */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(profileData).replace(/</g, "\\u003c") }}
            />
            <SmoothScroll smoothness={40} />
            <Accretion />
            <RecordLink onRecord />
            <TrailCursor text="INSPECT OBJECTS" />
        </>
    );
}