import Accretion from "../components/Accretion";
import SmoothScroll from "../components/SmoothScroll";
import TrailCursor from "../components/TrailCursor";

export default function Home() {
    return (
        <>
            <SmoothScroll smoothness={40} />
            <Accretion />
            <TrailCursor text="INSPECT OBJECTS" />
        </>
    );
}