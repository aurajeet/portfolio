import type { Metadata } from "next";
import "./globals.css";
import { fraunces, geistSans } from "@/lib/fonts";
import { SmoothScroll } from "@/lib/smooth-scroll";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/layout/Footer";
import { ChatFab } from "@/components/chat/ChatFab";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Aurajeet Mahapatra · Project Manager",
    template: "%s · Aurajeet Mahapatra",
  },
  description:
    "Project Manager portfolio. Selected work, experience, and recent projects.",
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
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
        <ChatFab />
      </body>
    </html>
  );
}
