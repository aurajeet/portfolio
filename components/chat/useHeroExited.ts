"use client";

import { useEffect, useRef, useState } from "react";

export type HeroPromptMode = "scroll" | "idle" | null;

const IDLE_TIMEOUT_MS = 15_000;

export function useHeroExited(): { triggered: boolean; mode: HeroPromptMode } {
  const [state, setState] = useState<{ triggered: boolean; mode: HeroPromptMode }>({
    triggered: false,
    mode: null,
  });
  const firedRef = useRef(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#hero");
    if (!hero) return;

    let heroWasSeen = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    function fire(mode: Exclude<HeroPromptMode, null>) {
      if (firedRef.current) return;
      firedRef.current = true;
      setState({ triggered: true, mode });
    }

    // Path A: IntersectionObserver — fires when hero scrolls out of view.
    // heroWasSeen guard prevents false-firing when page loads already scrolled past hero.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        heroWasSeen = true;
      } else if (heroWasSeen) {
        fire("scroll");
        observer.disconnect();
      }
    });
    observer.observe(hero);

    // Path B: Idle timer — fires if user sits on the hero for 15s without scrolling.
    // Any scroll event cancels the timer; Path A takes over if they scroll.
    function onScroll() {
      if (idleTimer !== null) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
      window.removeEventListener("scroll", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    idleTimer = setTimeout(() => {
      fire("idle");
    }, IDLE_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      if (idleTimer !== null) clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return state;
}
