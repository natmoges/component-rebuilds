// The ladder index. Every build is listed with the component it rebuilds and who made the original.
// Each rung is a layer. Each build reuses what the last one taught and adds one new idea.
import styles from "./page.module.css";

type BuildStatus = "shipped" | "next" | "planned";

type Build = {
  number: string;
  name: string;
  reference: string;
  rung: number;
  status: BuildStatus;
  href?: string;
};

const rungs = [
  { number: 1, name: "Single components" },
  { number: 2, name: "Composition + data" },
  { number: 3, name: "Page-level behaviour" },
  { number: 4, name: "Drawing the pixels" },
  { number: 5, name: "3D / WebGL" },
];

const builds: Build[] = [
  { number: "01", name: "vinyl", reference: "DiscPlayer by Ahmad (@ohitshmad)", rung: 1, status: "shipped", href: "https://vinyl-swart.vercel.app" },
  { number: "02", name: "TextScrambler", reference: "Frameblox", rung: 1, status: "next" },
  { number: "03", name: "BackToTop", reference: "The Velox Studio", rung: 1, status: "planned" },
  { number: "04", name: "AnimatedFolder", reference: "Launchly", rung: 2, status: "planned" },
  { number: "05", name: "Motion Tiles", reference: "Uzair J.", rung: 2, status: "planned" },
  { number: "06", name: "Live Location", reference: "Amr Rashed", rung: 2, status: "planned" },
  { number: "07", name: "The Ladder", reference: "My own — no reference", rung: 2, status: "planned" },
  { number: "08", name: "Smooth Scroll", reference: "Framer University", rung: 3, status: "planned" },
  { number: "09", name: "TrailCursor", reference: "Akın Gündoğan", rung: 3, status: "planned" },
  { number: "10", name: "LogoPreloader", reference: "Sukoya Design", rung: 3, status: "planned" },
  { number: "11", name: "StarCloud", reference: "Sabo Sugi (v1)", rung: 4, status: "planned" },
  { number: "12", name: "Gravity", reference: "Framer University", rung: 4, status: "planned" },
  { number: "13", name: "Retro Screen Effect", reference: "Blue Jackson (optional)", rung: 4, status: "planned" },
  { number: "14", name: "The Orbit", reference: "Replaces a Spline embed", rung: 5, status: "planned" },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Component Rebuilds</h1>
        <p>
          The sourced components from my portfolio, rebuilt from scratch in React + TypeScript,
          one layer at a time. Every original is credited. None of its code is here.
        </p>
      </header>

      {rungs.map((rung) => (
        <section key={rung.number} className={styles.rung}>
          <h2>
            Rung {rung.number} · {rung.name}
          </h2>
          <ul className={styles.list}>
            {builds
              .filter((build) => build.rung === rung.number)
              .map((build) => (
                <li key={build.number} className={styles.row} data-status={build.status}>
                  <span className={styles.number}>{build.number}</span>
                  <span className={styles.name}>
                    {build.href ? <a href={build.href}>{build.name}</a> : build.name}
                  </span>
                  <span className={styles.reference}>{build.reference}</span>
                  <span className={styles.status}>{build.status}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
