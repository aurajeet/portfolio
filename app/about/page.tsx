import type { Metadata } from "next";
import { About } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Aurajeet Mahapatra, an air force kid turned product manager. Disposition, agency, work, and what I do when no one's measuring.",
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
    title: "About · Aurajeet Mahapatra",
    description:
      "About Aurajeet Mahapatra, an air force kid turned product manager. Disposition, agency, work, and what I do when no one's measuring.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About · Aurajeet Mahapatra",
    description:
      "About Aurajeet Mahapatra, an air force kid turned product manager. Disposition, agency, work, and what I do when no one's measuring.",
  },
};

export default function AboutPage() {
  return <About />;
}
