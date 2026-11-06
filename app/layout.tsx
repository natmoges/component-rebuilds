import type { Metadata } from "next";
import { Inter, Roboto_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LogoPreloader from "../components/LogoPreloader";

// Integration item 7: type in three roles, loaded once for every page. next/font serves the
// files from this site, so no visitor's browser calls Google. globals.css maps each face to its role.
const display = Space_Grotesk({ subsets: ["latin"], variable: "--face-display" });
const text = Inter({ subsets: ["latin"], variable: "--face-text" });
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--face-mono" });

export const metadata: Metadata = {
  title: "Component Rebuilds — Nat Moges",
  description:
    "The sourced components from my portfolio, rebuilt from scratch in React + TypeScript, one layer at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>
        <LogoPreloader
          logoSrc="/preloader/natftp-hud.png"
          videoSrc="/preloader/preloader-starfield.mp4"
          posterSrc="/preloader/preloader-starfield-poster.jpg"
        />
        {children}
      </body>
    </html>
  );
}
