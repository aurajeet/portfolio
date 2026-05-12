import { Fraunces, Geist } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // "optional" avoids a font-swap LCP re-evaluation on slow connections;
  // Next.js generates a closely-matched size-adjusted fallback so layout
  // shift is minimal even when the web font doesn't arrive in the ~100ms
  // optional window.
  display: "optional",
});

export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "optional",
});
