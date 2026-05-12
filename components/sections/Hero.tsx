"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

// Locked Hero copy. Exported so the AI bot's knowledge assembler
// (`lib/bot/knowledge.ts`) can read the same source-of-truth strings
// the recruiter sees on the landing page — no drift between what the
// site renders and what the bot tells you it says.
export const HERO_EYEBROW =
  "PRODUCT MANAGER · BASED IN BANGALORE · OPEN TO PRODUCT ROLES";
export const HERO_NAME = "aurajeet mahapatra";
export const HERO_TAGLINE =
  "I build products under hard constraints — short cycles, partial data, real consequences.";

const luxeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduced = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.13,
        delayChildren: reduced ? 0 : 0.1,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 1.2,
        ease: luxeEase,
      },
    },
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className={cn(
        "relative flex min-h-[92vh] flex-col",
        "justify-start md:justify-center",
        "pt-32 pb-20 md:pt-28 md:pb-24",
      )}
    >
      {/* Full-bleed cover photo — desktop only */}
      <motion.div
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduced ? 0 : 1.6,
          delay: reduced ? 0 : 0.3,
          ease: luxeEase,
        }}
        className="pointer-events-none absolute inset-0 hidden md:block"
      >
        <Image
          src="/hero-cover.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* subtle scrim: just enough to keep dark ink text readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(250,250,247,0.82) 0%, rgba(250,250,247,0.52) 38%, rgba(250,250,247,0.18) 60%, rgba(250,250,247,0) 75%)",
          }}
        />
      </motion.div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="visible"
          variants={containerVariants}
          className="max-w-full md:max-w-[62%]"
        >
          <motion.div variants={childVariants}>
            <Eyebrow
              className="md:text-ink"
              style={{ textShadow: "0 0 8px #fff, 0 0 20px #fafaf7, 0 0 44px rgba(250,250,247,0.95)" }}
            >
              {HERO_EYEBROW}
            </Eyebrow>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={childVariants}
            className={cn(
              "mt-8 font-display font-normal text-ink",
              "text-[clamp(3.5rem,9vw,var(--text-display-xl))]",
              "leading-[0.92] tracking-[-0.02em]",
            )}
          >
            {HERO_NAME}
          </motion.h1>

          <motion.p
            variants={childVariants}
            className={cn(
              "mt-8 font-display italic text-ink/85",
              "text-xl leading-snug md:text-2xl",
              "max-w-[44ch] text-balance",
            )}
            style={{ textShadow: "0 0 12px #fff, 0 0 28px #fafaf7, 0 0 56px rgba(250,250,247,0.9)" }}
          >
            {HERO_TAGLINE}
          </motion.p>

          <motion.div
            variants={childVariants}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <ButtonLink href="#work" variant="filled">
              View work
            </ButtonLink>
            <ButtonLink href="#contact" variant="outlined">
              Get in touch
            </ButtonLink>
          </motion.div>
        </motion.div>

        {/* mobile: portrait photo stacked below text */}
        <motion.div
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduced ? 0 : 1.6,
            delay: reduced ? 0 : 0.3,
            ease: luxeEase,
          }}
          className="relative mx-auto mt-14 aspect-[4/5] w-full max-w-sm overflow-hidden border border-rule md:hidden"
        >
          <Image
            src="/hero-cover.png"
            alt="Aurajeet Mahapatra"
            fill
            className="object-cover"
            style={{ objectPosition: "80% center" }}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
