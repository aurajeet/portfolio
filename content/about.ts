// Single source of truth for the About page at /about. Four magazine-style
// sections — childhood, college, the work (NWN + HEBE merged), and
// off-hours (hobby collage).
//
// Tone register: "the longer version of me." The rest of the site is the
// pitch — case studies, metrics, capability tags. This page is the room
// where the pitch stops and the reader meets the human. Each section
// closes on a fact or image, never a lesson; the connect-the-dots move
// is always the reader's, never ours.
//
// Both `headline` and `body` carry placeholder copy tagged `[PLACEHOLDER · …]`
// describing what the final copy needs to do. Same pattern as the
// placeholder SVGs in `public/about/`. Refine in a follow-up pass once
// real copy + photos are ready; component reads from this file so swap
// is a one-line change per asset / per body / per headline.

export type AboutImage = {
  src: string;
  alt: string;
  /** Aspect controls how the tile lays out inside the collage section.
   *  Ignored by `image-right` / `image-left` / `grid-below` layouts which
   *  use their own aspect anchors. */
  aspect?: "square" | "portrait" | "landscape";
  /** Intrinsic pixel dimensions of the source file. Required by `marquee`
   *  layout (and recommended for any `next/image` consumer) so the strip
   *  reserves correct width per tile and avoids layout shift. Generated
   *  by `.work/convert-photos.mjs` and copied into the manifest below. */
  width?: number;
  height?: number;
};

export type AboutLayout =
  | "image-right"   // text left, single image right (alternates rhythm)
  | "image-left"    // image left, text right (alternates rhythm)
  | "grid-below"    // text top, photo grid below
  | "collage"       // text top, mixed-aspect tile grid below
  | "marquee";      // text top, full-bleed continuous-scroll photo strip

export type AboutSection = {
  id: string;
  /** Section eyebrow — small uppercase tracked label above the headline. */
  eyebrow: string;
  /** Section headline — Fraunces serif, ~h3 scale. Currently carries a
   *  `[PLACEHOLDER · …]` brief; co-derived with each section's final body. */
  headline: string;
  /** Section body as an array of paragraphs (each rendered as its own `<p>`).
   *  Sections that haven't been written yet wrap a `[PLACEHOLDER · …]` brief
   *  in a single-element array; the brief describes what to surface and the
   *  no-thesis discipline. */
  body: string[];
  layout: AboutLayout;
  images: AboutImage[];
};

export const aboutSections: AboutSection[] = [
  {
    id: "section-1",
    eyebrow: "01 · Childhood",
    headline: "Where the jets were the alarm",
    body: [
      "I was born in Srinagar in 2000, just after Kargil. My father served thirty-eight years in the Air Force. We moved every few years. New city, new school, new set of friends. Old ones left behind.",
      "Some things from that life have stayed with me. I make friends fast. I'm comfortable in new places. Routine feels like home.",
      "Mornings were the same everywhere. The first jets lifting at dawn were the only alarm I ever needed. My father in uniform, walking out into a quiet campus. Fighter jets on the apron behind him, the kind most people only dream of seeing.",
    ],
    layout: "image-right",
    images: [
      {
        src: "/about/section-1-childhood.jpg",
        alt: "Aurajeet as a toddler sitting in the cockpit of an Air Force aircraft",
      },
    ],
  },
  {
    id: "section-2",
    eyebrow: "02 · College",
    headline: "The corridor at Mesra",
    body: [
      "I spent four years at BIT Mesra in Ranchi. Hostel for all of them. The corridor is where most of college actually happened.",
      "Some things from college have stayed with me. My closest friends are still the ones I made there. I think better out loud. I work better with a few people in the room.",
      "That corridor is where the ideas got made. Where the dream to do something great got made too. Most of those friends are still in my life. Through the dreams that worked, and the ones that didn't.",
    ],
    layout: "image-left",
    images: [
      {
        src: "/about/section-2-college.jpg",
        alt: "Aurajeet and college friends in paintball gear at BIT Mesra",
      },
    ],
  },
  {
    id: "section-3",
    eyebrow: "03 · The work",
    headline: "The state I keep going back to",
    body: [
      "2am, a small room, opposite a national leader who would later become Education Minister. His team and mine, figuring out what to do next. That was two years of campaigns across five states. Now I run a family business in essential oils.",
      "Some things from these two jobs have stayed with me. I'm not nervous anymore in a room full of people older, more experienced, and smarter than me. The confidence comes from the prep, not from me.",
      "The work took me to a lot of places. Most fade. The state I keep going back to is Arunachal. Strangers there don't stay strangers. I'm pretty sure I'll move there one day.",
    ],
    layout: "grid-below",
    images: [
      {
        src: "/about/section-3-work-1.jpg",
        alt: "Laptop open overlooking a hillside city in Arunachal Pradesh — working from the field",
      },
      {
        src: "/about/section-3-work-2.jpg",
        alt: "Essential oil distillation units at HEBE's processing facility",
      },
      {
        src: "/about/section-3-work-3.jpg",
        alt: "Aurajeet with the NWN campaign team on a field visit",
      },
      {
        src: "/about/section-3-work-4.jpg",
        alt: "Political event in Arunachal Pradesh — Sankalp Patra launch, 2024",
      },
    ],
  },
  {
    id: "section-4",
    eyebrow: "04 · Off-hours",
    headline: "Camera, sketchbook, somewhere new",
    body: [
      "A camera in my pocket, a sketchbook in my bag, and a list of places I keep finding excuses to visit. The frames below come from all three.",
    ],
    layout: "marquee",
    // 15-frame collection from .work/photos-manifest.json (regenerate with
    // `node .work/convert-photos.mjs` after dropping new sources into
    // Photos/Photography/). Width/height are post-rotation dimensions —
    // EXIF orientation is baked in at convert time, so what you see is
    // what next/image gets. Order = display order at the start of the
    // loop; a portrait lead anchors the strip then alternates.
    images: [
      { src: "/about/photography/photo-01.jpg", alt: "Photograph by Aurajeet, №01", width: 828,  height: 1600 },
      { src: "/about/photography/photo-03.jpg", alt: "Photograph by Aurajeet, №03", width: 1600, height: 1200 },
      { src: "/about/photography/photo-07.jpg", alt: "Photograph by Aurajeet, №07", width: 1200, height: 1600 },
      { src: "/about/photography/photo-10.jpg", alt: "Photograph by Aurajeet, №10", width: 1600, height: 1200 },
      { src: "/about/photography/photo-15.jpg", alt: "Photograph by Aurajeet, №15", width: 1600, height: 1600 },
      { src: "/about/photography/photo-02.jpg", alt: "Photograph by Aurajeet, №02", width: 1200, height: 1600 },
      { src: "/about/photography/photo-04.jpg", alt: "Photograph by Aurajeet, №04", width: 1600, height: 1200 },
      { src: "/about/photography/photo-08.jpg", alt: "Photograph by Aurajeet, №08", width: 1200, height: 1600 },
      { src: "/about/photography/photo-05.jpg", alt: "Photograph by Aurajeet, №05", width: 1600, height: 1200 },
      { src: "/about/photography/photo-11.jpg", alt: "Photograph by Aurajeet, №11", width: 1200, height: 1600 },
      { src: "/about/photography/photo-13.jpg", alt: "Photograph by Aurajeet, №13", width: 1600, height: 1200 },
      { src: "/about/photography/photo-09.jpg", alt: "Photograph by Aurajeet, №09", width: 1200, height: 1600 },
      { src: "/about/photography/photo-06.jpg", alt: "Photograph by Aurajeet, №06", width: 1600, height: 1200 },
      { src: "/about/photography/photo-12.jpg", alt: "Photograph by Aurajeet, №12", width: 1200, height: 1600 },
      { src: "/about/photography/photo-14.jpg", alt: "Photograph by Aurajeet, №14", width: 1600, height: 1200 },
    ],
  },
];
