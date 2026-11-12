import type { Metadata } from "next";
import { Inter, Roboto_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LogoPreloader from "../components/LogoPreloader";
// Vercel Web Analytics counts page visits without a cookie. Nothing else.
import { Analytics } from "@vercel/analytics/next";

// Type in three roles, loaded once for every page. next/font serves the
// files from this site, so no visitor's browser calls Google. globals.css maps each face to its role.
const display = Space_Grotesk({ subsets: ["latin"], variable: "--face-display" });
const text = Inter({ subsets: ["latin"], variable: "--face-text" });
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--face-mono" });

// The page is Accretion now, and a shared link says so, with a frame of the
// grown planet (app/opengraph-image.png, a capture of the page itself). Subpages keep their own titles.
const DESCRIPTION =
  "My record, read live from Notion and scanned in order: kept if the record can prove it, debris if it can't yet, with the fourteen components I rebuilt.";

export const metadata: Metadata = {
  metadataBase: new URL("https://record.natmoges.com"),
  title: "Accretion · Nat Moges",
  description: DESCRIPTION,
  openGraph: {
    title: "Accretion · Nat Moges",
    description: DESCRIPTION,
    url: "/",
    siteName: "Nat Moges",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accretion · Nat Moges",
    description: DESCRIPTION,
  },
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
        <Analytics />
      </body>
    </html>
  );
}
