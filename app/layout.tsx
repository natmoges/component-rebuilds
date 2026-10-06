import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
