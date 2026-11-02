import type { Metadata } from "next";
import "./globals.css";
import LogoPreloader from "../components/LogoPreloader";

export const metadata: Metadata = {
  title: "Component Rebuilds — Nat Moges",
  description:
    "The sourced components from my portfolio, rebuilt from scratch in React + TypeScript, one layer at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
