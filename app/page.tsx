import Accretion from "../components/Accretion";
import SmoothScroll from "../components/SmoothScroll";
import TrailCursor from "../components/TrailCursor";
import { profileData } from "../lib/profile";

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
            <TrailCursor text="INSPECT OBJECTS" />
        </>
    );
}