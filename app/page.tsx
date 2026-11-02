import Accretion from "../components/Accretion";
import SmoothScroll from "../components/SmoothScroll";

export default function Home() {
    return (
        <>
            <SmoothScroll smoothness={30} />
            <Accretion />
        </>
    );
}