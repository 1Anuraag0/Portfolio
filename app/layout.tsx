import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixel Portfolio — A Journey Through Code",
  description:
    "An indie-inspired, pixel art portfolio that tells a story through scroll. Explore projects, skills, and creativity in a Japanese countryside setting.",
  keywords: ["portfolio", "pixel art", "indie", "developer", "Japanese", "scroll animation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="crt-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
