import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "VibeRead — Focus & Flow",
  description: "Une application web de Deep Work combinant lecture immersive, paysage vidéo et ambiance sonore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable}`}>
      <body className="antialiased bg-black text-white overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
