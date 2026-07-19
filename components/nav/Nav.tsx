"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { EASE_LUXE } from "@/lib/motion";

type NavLink = {
  label: string;
  href: string;
  download?: boolean;
};

const links: NavLink[] = [
  { label: "Experience", href: "/#work" },
  { label: "Projects", href: "/#projects" },
  // About is temporarily pulled from the nav while the page is reworked.
  // Restore alongside `app/about/` and the sitemap entry when it ships.
  { label: "Resume", href: "/resume.pdf", download: true },
  { label: "Contact", href: "/#contact" },
];

const luxeEase = EASE_LUXE;

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Hero-aware trigger: on routes with a `#hero` element, the nav stays
    // transparent while the hero is intersecting the viewport (minus the
    // fixed nav strip) and activates the blur+border the moment the hero's
    // bottom edge passes above it. On routes without a hero, fall back to
    // the simple scroll heuristic so the chrome still responds to scroll.
    // The pathname dep re-runs this effect on client-side route changes so
    // the observer/listener attaches to the correct DOM after navigation.
    const heroEl = document.getElementById("hero");

    if (heroEl) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setScrolled(!entry.isIntersecting);
        },
        {
          rootMargin: "-64px 0px 0px 0px",
          threshold: 0,
        },
      );
      observer.observe(heroEl);
      return () => observer.disconnect();
    }

    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-[var(--ease-luxe)]",
          scrolled
            ? "border-b border-rule bg-white/90 backdrop-blur"
            : "border-b border-transparent bg-white/75 backdrop-blur-sm",
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            aria-label="AM, home"
            className="font-display text-lg tracking-tight text-ink md:text-xl"
          >
            AM
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 font-sans text-[11px] font-medium uppercase tracking-[var(--tracking-eyebrow)] md:flex"
          >
            {links.map((l) =>
              l.download ? (
                <a
                  key={l.href}
                  href={l.href}
                  download
                  className="text-ink transition-opacity duration-300 hover:opacity-50"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-ink transition-opacity duration-300 hover:opacity-50"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 flex flex-col items-end gap-1.5 p-2 md:hidden"
          >
            <span
              className={cn(
                "block h-px w-6 bg-ink transition-transform duration-300 ease-[var(--ease-luxe)]",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-4 bg-ink transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-px w-6 bg-ink transition-transform duration-300 ease-[var(--ease-luxe)]",
                open && "-translate-y-[6px] -rotate-45",
              )}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: luxeEase }}
            className="fixed inset-0 z-40 bg-paper md:hidden"
          >
            <div className="container-wide flex h-full flex-col justify-center pt-16">
              <ul className="flex flex-col gap-7">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.06,
                      ease: luxeEase,
                    }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      {...(l.download ? { download: true } : {})}
                      className="block font-display text-[clamp(2.5rem,11vw,4rem)] leading-none text-ink"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
