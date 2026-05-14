import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { aboutSections, type AboutImage, type AboutSection } from "@/content/about";
import { cn } from "@/lib/cn";

/**
 * About page. Four magazine-style sections per the locked Phase 5.5 spec:
 *
 *   1. Disposition  — air force family upbringing (text + 1 image, alternating)
 *   2. Agency       — college (image + text, alternating opposite)
 *   3. Proof        — NWN + HEBE merged (text + 4-photo grid below)
 *   4. Off-hours — photography, sketches, travel; full-bleed auto-scroll marquee
 *
 * Layout discriminator on each section drives composition. Each section is
 * separated by a hairline `border-t border-rule` (matches the rest of the
 * site). Page header carries the editorial display heading; footer carries
 * the back-to-portfolio link.
 *
 * Photos for sections 1–3 still point to placeholder SVGs in `/public/about/`
 * and use a plain `<img>` (avoids `dangerouslyAllowSVG`). Section 4 uses
 * real raster photos under `/public/about/photography/` and renders through
 * `next/image` for proper srcset / lazy-loading. Per-asset swaps remain a
 * one-line change in [content/about.ts](content/about.ts).
 */
export function About() {
  return (
    <article className="section-y pt-40 md:pt-48">
      <Container width="narrow">
        {/* ---------- Page header ---------- */}
        <header>
          <Eyebrow tone="accent">About</Eyebrow>
          <Heading
            variant="display"
            italic
            className="mt-6 max-w-[14ch] text-balance"
          >
            About Aurajeet
          </Heading>
        </header>

        {/* ---------- Magazine sections ---------- */}
        <div className="mt-20 md:mt-28">
          {aboutSections.map((section, i) => (
            <section
              key={section.id}
              aria-labelledby={`${section.id}-heading`}
              className={cn(
                "py-16 md:py-20",
                i > 0 && "border-t border-rule",
              )}
            >
              <MagazineSection section={section} />
            </section>
          ))}
        </div>

        {/* ---------- Footer link ---------- */}
        <div className="mt-12 border-t border-rule pt-10 md:mt-16 md:pt-12">
          <TextLink href="/" arrow={false} prefixArrow>
            Back to portfolio
          </TextLink>
        </div>
      </Container>
    </article>
  );
}

// ---------- Section composer ----------

function MagazineSection({ section }: { section: AboutSection }) {
  const { layout, eyebrow, headline, body, images, id } = section;
  const headingId = `${id}-heading`;

  // ---------- 1 + 2: alternating image-side ----------
  if (layout === "image-right" || layout === "image-left") {
    const image = images[0];
    const isImageLeft = layout === "image-left";

    const textBlock = (
      <div className={cn(isImageLeft && "md:order-2")}>
        <SectionEyebrow text={eyebrow} />
        <Heading
          variant="h3"
          as="h2"
          id={headingId}
          className="mt-5 max-w-[20ch] text-balance"
        >
          {headline}
        </Heading>
        <BodyProse paragraphs={body} className="max-w-[44ch]" />
      </div>
    );

    const imageBlock = (
      <div
        className={cn(
          "overflow-hidden border border-rule bg-paper-pure",
          isImageLeft && "md:order-1",
        )}
      >
        <PlaceholderImg
          src={image.src}
          alt={image.alt}
          className="block aspect-[4/3] w-full object-cover"
        />
      </div>
    );

    return (
      <div
        className={cn(
          "grid gap-10",
          "md:grid-cols-2 md:items-center md:gap-12",
          "lg:gap-16",
        )}
      >
        {textBlock}
        {imageBlock}
      </div>
    );
  }

  // ---------- 3: text + photo grid below ----------
  if (layout === "grid-below") {
    return (
      <div>
        <SectionEyebrow text={eyebrow} />
        <Heading
          variant="h3"
          as="h2"
          id={headingId}
          className="mt-5 max-w-[24ch] text-balance"
        >
          {headline}
        </Heading>
        <BodyProse paragraphs={body} className="max-w-[68ch]" />

        <div
          className={cn(
            "mt-12 grid grid-cols-2 gap-4",
            "md:mt-16 md:grid-cols-4 md:gap-6",
          )}
        >
          {images.map((img, i) => (
            <div
              key={img.src + i}
              className="overflow-hidden border border-rule bg-paper-pure"
            >
              <PlaceholderImg
                src={img.src}
                alt={img.alt}
                className="block aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- 4: marquee (full-bleed auto-scroll photo strip) ----------
  if (layout === "marquee") {
    return (
      <div>
        <SectionEyebrow text={eyebrow} />
        <Heading
          variant="h3"
          as="h2"
          id={headingId}
          className="mt-5 max-w-[24ch] text-balance"
        >
          {headline}
        </Heading>
        <BodyProse paragraphs={body} className="max-w-[44ch]" />

        <PhotoMarquee
          images={images}
          ariaLabel="Off-hours by Aurajeet — photography, sketches, and travel, auto-scrolling gallery"
        />
      </div>
    );
  }

  // ---------- collage (mixed-aspect tiles) — kept available for future sections ----------
  return (
    <div>
      <SectionEyebrow text={eyebrow} />
      <Heading
        variant="h3"
        as="h2"
        id={headingId}
        className="mt-5 max-w-[24ch] text-balance"
      >
        {headline}
      </Heading>
      <BodyProse paragraphs={body} className="max-w-[44ch]" />

      <div
        className={cn(
          "mt-12 grid grid-cols-2 grid-flow-row-dense items-start gap-4",
          "md:mt-16 md:grid-cols-3 md:gap-6",
        )}
      >
        {images.map((img, i) => (
          <div
            key={img.src + i}
            className={cn(
              "overflow-hidden border border-rule bg-paper-pure",
              img.aspect === "portrait" && "aspect-[2/3]",
              img.aspect === "square" && "aspect-square",
              img.aspect === "landscape" && "aspect-[3/2] col-span-2",
            )}
          >
            <PlaceholderImg
              src={img.src}
              alt={img.alt}
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Photo collage marquee ----------
//
// Single-pane horizontal strip. Photos are arranged into column groups
// that each fill the full pane height — portrait/square photos occupy
// one full-height column (width = pane_height × aspect_ratio); landscape
// pairs stack two photos at half-height each, column width = half_height
// × ratio. No rows, no distribution logic — one cohesive scrolling canvas.
// Two copies side-by-side; keyframe slides 0 → −50% for a seamless loop.

const PANE_HEIGHT_CLASS =
  "h-[200px] sm:h-[260px] md:h-[340px] lg:h-[420px]";

const MARQUEE_DURATION_S = 100;

type PhotoGroup =
  | { kind: "single"; img: AboutImage }
  | { kind: "stack"; top: AboutImage; bottom: AboutImage };

function buildPhotoGroups(images: AboutImage[]): PhotoGroup[] {
  const portraits: AboutImage[] = [];
  const landscapes: AboutImage[] = [];
  const squares: AboutImage[] = [];

  for (const img of images) {
    const w = img.width ?? 1600;
    const h = img.height ?? 1200;
    if (h > w) portraits.push(img);
    else if (w > h) landscapes.push(img);
    else squares.push(img);
  }

  // Pair consecutive landscapes into 2-photo stacks
  const stacks: PhotoGroup[] = [];
  for (let i = 0; i + 1 < landscapes.length; i += 2) {
    stacks.push({ kind: "stack", top: landscapes[i], bottom: landscapes[i + 1] });
  }
  const loneLandscapes: PhotoGroup[] =
    landscapes.length % 2 !== 0
      ? [{ kind: "single", img: landscapes[landscapes.length - 1] }]
      : [];

  const singles: PhotoGroup[] = [
    ...portraits.map((img) => ({ kind: "single" as const, img })),
    ...squares.map((img) => ({ kind: "single" as const, img })),
    ...loneLandscapes,
  ];

  // Interleave: single, single, stack, single, single, stack, …
  const groups: PhotoGroup[] = [];
  let si = 0;
  let st = 0;
  while (si < singles.length || st < stacks.length) {
    if (si < singles.length) groups.push(singles[si++]);
    if (si < singles.length) groups.push(singles[si++]);
    if (st < stacks.length) groups.push(stacks[st++]);
  }

  return groups;
}

function PhotoMarquee({
  images,
  ariaLabel,
}: {
  images: AboutSection["images"];
  ariaLabel: string;
}) {
  const groups = buildPhotoGroups(images);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "relative left-1/2 -translate-x-1/2 w-screen overflow-hidden",
        "mt-14 md:mt-20",
        PANE_HEIGHT_CLASS,
      )}
    >
      <div
        className={cn(
          "flex h-full w-max items-stretch gap-1 md:gap-1.5",
          "animate-marquee-x",
        )}
        style={{ "--marquee-duration": `${MARQUEE_DURATION_S}s` } as React.CSSProperties}
      >
        {[0, 1].map((copyIdx) => (
          <ul
            key={copyIdx}
            aria-hidden={copyIdx === 1 || undefined}
            aria-label={copyIdx === 0 ? "Off-hours photography collage" : undefined}
            className="flex shrink-0 items-stretch gap-1 md:gap-1.5"
          >
            {groups.map((group, i) => (
              <GroupTile key={`${copyIdx}-${i}`} group={group} />
            ))}
          </ul>
        ))}
      </div>

      {/* Edge fades */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0",
          "w-10 md:w-20 lg:w-28",
          "bg-gradient-to-r from-paper to-transparent",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0",
          "w-10 md:w-20 lg:w-28",
          "bg-gradient-to-l from-paper to-transparent",
        )}
      />
    </div>
  );
}

function GroupTile({ group }: { group: PhotoGroup }) {
  if (group.kind === "stack") {
    return <StackTile top={group.top} bottom={group.bottom} />;
  }
  return <SingleTile img={group.img} />;
}

function SingleTile({ img }: { img: AboutImage }) {
  const w = img.width ?? 1600;
  const h = img.height ?? 1200;
  return (
    <li
      className="relative shrink-0 h-full overflow-hidden border border-rule bg-paper-pure"
      style={{ aspectRatio: `${w}/${h}` }}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover select-none"
        sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, (max-width: 1280px) 340px, 420px"
        draggable={false}
      />
    </li>
  );
}

function StackTile({
  top,
  bottom,
}: {
  top: AboutImage;
  bottom: AboutImage;
}) {
  const tw = top.width ?? 1600;
  const th = top.height ?? 1200;
  return (
    <li
      className="relative shrink-0 h-full flex flex-col gap-1 md:gap-1.5"
      style={{ aspectRatio: `${tw}/${th * 2}` }}
    >
      <div className="relative flex-1 overflow-hidden border border-rule bg-paper-pure">
        <Image
          src={top.src}
          alt={top.alt}
          fill
          className="object-cover select-none"
          sizes="(max-width: 640px) 133px, (max-width: 768px) 173px, (max-width: 1280px) 227px, 280px"
          draggable={false}
        />
      </div>
      <div className="relative flex-1 overflow-hidden border border-rule bg-paper-pure">
        <Image
          src={bottom.src}
          alt={bottom.alt}
          fill
          className="object-cover select-none"
          sizes="(max-width: 640px) 133px, (max-width: 768px) 173px, (max-width: 1280px) 227px, 280px"
          draggable={false}
        />
      </div>
    </li>
  );
}

// ---------- Section eyebrow helper ----------
//
// Magazine folio treatment: the leading "01" / "02" / "03" / "04" reads as
// the accent (the wayfinding), the "· Childhood" / "· College" / etc. label
// stays muted (the category). Splits at the FIRST " · " only — anything
// without a leading number renders entirely muted (default Eyebrow behavior).
//
// Content stays untouched in [content/about.ts](content/about.ts) — the
// "01 · Childhood" string is preserved; only the rendering colors the parts
// differently.
function SectionEyebrow({ text }: { text: string }) {
  const sep = " · ";
  const idx = text.indexOf(sep);
  if (idx < 0) {
    return <Eyebrow>{text}</Eyebrow>;
  }
  const num = text.slice(0, idx);
  const label = text.slice(idx + sep.length);
  return (
    <Eyebrow>
      <span className="text-ink-accent">{num}</span>
      <span>
        {sep}
        {label}
      </span>
    </Eyebrow>
  );
}

// ---------- Body prose helper ----------
//
// Renders an array of paragraph strings as stacked `<p>` elements with
// consistent typography. Used by all four magazine layouts; `className`
// passes through layout-specific max-widths (44ch alongside images, 68ch
// for the full-width grid-below section).
function BodyProse({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-6 space-y-4 text-base leading-relaxed text-ink/85",
        "md:text-lg",
        className,
      )}
    >
      {paragraphs.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

// ---------- Image helper ----------
//
// Centralizes the lint-disable for placeholder `<img>` usage in this file.
// SVG placeholders + `next/image`'s `dangerouslyAllowSVG` requirement is
// the same trade-off as the Projects section; swap to `next/image` when
// real photos land in a follow-up pass.
//
// `src` and `alt` are extracted explicitly so the JSX-a11y rule can verify
// `alt` is always passed (rest-spread defeats its static check).
function PlaceholderImg({
  src,
  alt,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" {...rest} />
  );
}
