import type { Metadata } from "next";
import "./globals.css";
import { fraunces, geistSans } from "@/lib/fonts";
import { SmoothScroll } from "@/lib/smooth-scroll";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Portfolio — Project Manager",
    template: "%s — Portfolio",
  },
  description:
    "Project Manager portfolio. Selected work, experience, and recent projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <SmoothScroll />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
