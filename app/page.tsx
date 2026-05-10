import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";

type Stub = {
  id: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  caption: string;
  cta?: { label: string; href: string };
};

const sections: Stub[] = [
  {
    id: "hero",
    index: "01",
    eyebrow: "Section · Hero",
    title: (
      <>
        Opening <em className="font-display italic">line</em>,
        <br />
        and a portrait.
      </>
    ),
    caption:
      "Split layout — eyebrow, name, tagline, two CTAs on the left, your portrait on the right. Arriving in Phase 2.",
  },
  {
    id: "work",
    index: "02",
    eyebrow: "Section · Education & Experience",
    title: (
      <>
        Where I&rsquo;ve <em className="font-display italic">studied</em>
        <br />
        and shipped.
      </>
    ),
    caption:
      "Timeline of college and roles, with a deeper view that opens a dedicated experience page. Arriving in Phase 3.",
    cta: { label: "Detailed Experience", href: "/experience" },
  },
  {
    id: "projects",
    index: "03",
    eyebrow: "Section · Recent Projects",
    title: (
      <>
        A horizontal <em className="font-display italic">scroll</em>
        <br />
        through recent work.
      </>
    ),
    caption:
      "Edge-peeking project cards. A separate page lists every project, sorted by recency and filterable by category. Arriving in Phase 4.",
    cta: { label: "All Projects", href: "/projects" },
  },
  {
    id: "contact",
    index: "04",
    eyebrow: "Section · Contact",
    title: (
      <>
        Quiet way to <em className="font-display italic">say hello</em>.
      </>
    ),
    caption:
      "Direct links — email and LinkedIn. No form. Arriving in Phase 5.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32">
        <Container>
          <Eyebrow>Phase 1 — Foundation Live</Eyebrow>
          <Heading
            variant="display"
            className="mt-8 max-w-[18ch] text-balance"
          >
            The chrome is in <em className="font-display italic">place</em>.
            Sections roll in next.
          </Heading>
          <p className="mt-10 max-w-md font-sans text-sm leading-relaxed text-mute md:text-base">
            Typography, palette, spacing, motion, and the navigation are all
            calibrated. The five sections below are placeholders — each one
            arrives in its own dedicated phase.
          </p>
        </Container>
      </section>

      {sections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="section-y border-t border-rule"
        >
          <Container>
            <div className="grid gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-3">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <p className="mt-3 font-display text-2xl text-ink/40">
                  {s.index}
                </p>
              </div>
              <div className="md:col-span-9">
                <Heading variant="h1" className="max-w-[18ch] text-balance">
                  {s.title}
                </Heading>
                <p className="mt-8 max-w-md font-sans text-sm leading-relaxed text-mute md:text-base">
                  {s.caption}
                </p>
                {s.cta && (
                  <div className="mt-10">
                    <TextLink href={s.cta.href}>{s.cta.label}</TextLink>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
