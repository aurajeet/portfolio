import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Work } from "@/components/sections/Work";

export const metadata: Metadata = {
  title: { absolute: "Aurajeet Mahapatra · Project Manager" },
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
    title: "Aurajeet Mahapatra · Project Manager",
    description:
      "Project Manager portfolio. Selected work, experience, and recent projects.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurajeet Mahapatra · Project Manager",
    description:
      "Project Manager portfolio. Selected work, experience, and recent projects.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Projects />
      <Contact />
    </>
  );
}
