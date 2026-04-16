# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Aurajeet Mahapatra Portfolio
**Updated:** 2026-04-16
**Category:** Portfolio/Personal
**Source of truth:** `css/main.css` `:root` block

---

## Global Rules

### Color Palette

| Role | Value | CSS Variable |
|------|-------|--------------|
| Background | `#04050a` | `--color-bg` |
| Surface (cards) | `#0c0d14` | `--color-surface` |
| Surface high (hover) | `#141520` | `--color-surface-high` |
| Border | `rgba(245, 185, 68, 0.12)` | `--color-border` |
| Gold accent / CTA | `#f5b944` | `--color-gold` |
| Gold bright (glow) | `#ffd700` | `--color-gold-bright` |
| Gold dim | `rgba(245, 185, 68, 0.35)` | `--color-gold-dim` |
| Gold subtle | `rgba(245, 185, 68, 0.08)` | `--color-gold-subtle` |
| Primary text | `#e8e8e8` | `--color-text` |
| Secondary text | `#888` | `--color-text-muted` |
| Disabled / decorative | `#444` | `--color-text-faint` |

**Color Notes:** Dark space theme with gold accent. WCAG AA verified — gold #f5b944 on bg #04050a = 11.8:1 contrast ratio.

### Typography

- **Heading Font:** Playfair Display (serif) — elegant, editorial, premium
- **Body Font:** Inter (sans-serif) — clean, precise, high-legibility
- **Mood:** dark, cinematic, technical, precision, clean, premium, professional

**CSS Import (in `index.html` `<head>`):**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**CSS Variables:**
```css
--font-serif: 'Playfair Display', 'Georgia', serif;
--font-sans:  'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--text-xs` | `0.75rem` (12px) | Captions, labels |
| `--text-sm` | `0.875rem` (14px) | Small body |
| `--text-base` | `1rem` (16px) | Body (min mobile) |
| `--text-lg` | `1.125rem` (18px) | Large body |
| `--text-xl` | `1.5rem` (24px) | Section sub-headings |
| `--text-2xl` | `2rem` (32px) | Section headings |
| `--text-3xl` | `3rem` (48px) | Hero heading |
| `--text-4xl` | `4rem` (64px) | Display / name |

### Line Height & Letter Spacing

| Token | Value |
|-------|-------|
| `--leading-tight` | `1.2` |
| `--leading-snug` | `1.35` |
| `--leading-normal` | `1.6` |
| `--tracking-tight` | `-0.02em` |
| `--tracking-normal` | `0em` |
| `--tracking-wide` | `0.08em` (labels, small caps) |
| `--tracking-wider` | `0.15em` (section labels) |

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `0.25rem` (4px) | Tight gaps |
| `--space-2` | `0.5rem` (8px) | Icon gaps, inline spacing |
| `--space-3` | `0.75rem` (12px) | Small gaps |
| `--space-4` | `1rem` (16px) | Standard padding |
| `--space-6` | `1.5rem` (24px) | Section padding |
| `--space-8` | `2rem` (32px) | Large gaps |
| `--space-12` | `3rem` (48px) | Section margins |
| `--space-16` | `4rem` (64px) | Hero padding |
| `--space-24` | `6rem` (96px) | Major spacing |
| `--space-32` | `8rem` (128px) | Section top/bottom padding |

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |

### Animation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Default ease |
| `--ease-in` | `cubic-bezier(0.4, 0.0, 1.0, 1)` | Exit animations |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy interactions |
| `--dur-fast` | `150ms` | Micro-interactions |
| `--dur-base` | `250ms` | Standard transitions |
| `--dur-slow` | `400ms` | Complex transitions |
| `--dur-cinematic` | `1000ms` | Hero/page transitions |

### Z-Index Scale

| Token | Value | Layer |
|-------|-------|-------|
| `--z-space-bg` | `0` | Three.js star canvas |
| `--z-nebula` | `1` | Nebula gradient overlay |
| `--z-sphere` | `2` | Three.js hero sphere |
| `--z-particles` | `3` | ~~2D particle canvas~~ (removed — unused) |
| `--z-content` | `4` | Page content |
| `--z-nav` | `10` | Fixed navigation |
| `--z-modal` | `100` | Modals / overlays |

---

## Component Specs

### Section Labels

```css
.label {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-gold);
}
```

### Section CTAs

```css
.section-cta {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-gold);
  border: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
  transition: border-color var(--dur-base) ease, color var(--dur-base) ease;
}
```

### Project Cards

```css
.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  transition: transform var(--dur-slow) var(--ease-out),
              box-shadow var(--dur-slow) var(--ease-out);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,185,68,0.15);
}
```

### Contact Buttons

```css
/* Primary — filled gold */
.contact-btn--primary {
  background: var(--color-gold);
  color: #04050a;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
}

/* Secondary — outlined */
.contact-btn--secondary {
  background: transparent;
  color: var(--color-gold);
  border: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
}
```

*Contact buttons are reused in two locations: the Contact section at the bottom and the CTA strip between hero and projects.*

### Metric Source Labels

```css
.metric-source {
  font-family: var(--font-sans);
  font-size: clamp(0.65rem, 1vw, 0.7rem);
  font-weight: 300;
  font-style: italic;
  color: var(--color-text-muted);
  opacity: 0.7;
  margin-top: var(--space-1);
}
```

*Per-metric attribution label, displayed below each metric's label in the hero.*

### Prototype CTA (Project Viewer)

```css
.prototype-cta {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: #04050a;
  background: var(--color-gold);
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-md);
}

.prototype-cta:hover {
  background: var(--color-gold-bright);
  box-shadow: 0 0 24px rgba(245, 185, 68, 0.45);
  transform: translateY(-1px);
}

/* Disabled — no prototype URL set */
.prototype-cta--disabled {
  opacity: 0.35;
  pointer-events: none;
}
```

### Navigation

```css
#site-nav {
  position: fixed;
  top: 0;
  z-index: var(--z-nav);
  /* Transparent by default; .scrolled adds backdrop blur */
}

#site-nav.scrolled {
  background: rgba(4, 5, 10, 0.85);
  backdrop-filter: blur(12px);
}
```

---

## Style Guidelines

**Style:** Motion-Driven / Cinematic / Narrative

**Keywords:** Animation-heavy, microinteractions, smooth transitions, scroll effects, parallax, entrance animations, Three.js, GSAP, canvas particles, narrative arc, atmospheric color grading

**Key Effects:**
- Three.js 3D sphere with GLSL shaders (hero) — fades out gently on scroll
- Background atmosphere color grading via CSS gradient overlays (continuous scroll blend, max 60% opacity)
- GSAP scroll-triggered section reveals
- IntersectionObserver for metrics countup
- Rotational star layers (3 depth levels, no scroll-driven parallax)

**Hero Sphere:**
Static 10k-particle sphere with organic vein texture, breathing animation, gold ring reveal. Fades out via scroll-coupled opacity (starts at hero center, fully transparent by hero bottom). No drain, no particle handoff.

**Background Atmospheres:**
Stars remain constant (anchor). Nebula CSS gradients shift continuously at reduced intensity (max 0.6 opacity, 0.7 on mobile):
- Hero: cold void (pure `#04050a`)
- Projects: warm amber nebula
- AI Fluency: cool cyan + muted purple
- About: warm brown deep field
- Contact: aurora borealis spectrum — green, blue, purple from below

**Mobile responsive (≤768px):** All atmosphere gradients recentered horizontally toward 50%. Nebula wisps pulled inward. Aurora bands (`aurora.js`) use separate mobile config with centered `baseX` values, wider `halfW`, reduced ray count and displacement. ScrollTrigger ranges tightened to prevent glow stretching over tall mobile sections.

---

## Anti-Patterns (Do NOT Use)

- Do not use emojis as icons — use SVG or image assets
- Do not omit `cursor: pointer` on clickable elements
- Do not use layout-shifting hover transforms (use `translateY` not `scale` for lift)
- Do not use low contrast text — maintain 4.5:1 minimum (already verified: gold on dark = 11.8:1)
- Do not use instant state changes — always transition (150–300ms)
- Do not hide focus states — must be visible for keyboard navigation
- Do not use light theme colours — this is a dark-only site

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG / image assets)
- [ ] `cursor: pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–400ms)
- [ ] Dark theme: gold on dark contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (GSAP skipped, text visible immediately)
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed nav (nav is transparent until `.scrolled`)
- [ ] No horizontal scroll on mobile
- [ ] All CSS uses design tokens from `:root` — no hardcoded values
