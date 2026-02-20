"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  SiteSettings, Sector, D, DEFAULT_SECTORS, SECTOR_IMAGES,
  fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem,
  Navbar, Footer, PageHero, SectionLabel, SectorIcon,
  TextReveal, ParallaxImage, RevealSection, MagneticButton, CountUp,
} from "../components";

interface SectorsPageClientProps {
  settings: SiteSettings | null;
  sectors: Sector[];
}

export default function SectorsPageClient({ settings, sectors }: SectorsPageClientProps) {
  const s = settings || D;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="Focus Areas"
        title="Investing across the energy value chain."
        subtitle="We target high-conviction opportunities at the intersection of renewable energy, digital infrastructure, and sustainable transportation."
      />
      <SectorsList sectors={sectors} />
      <ThesisBanner settings={s} />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// SECTORS LIST — Full detail cards
// ============================================================================

function SectorsList({ sectors }: { sectors: Sector[] }) {
  const list = sectors.length > 0 ? sectors : DEFAULT_SECTORS;

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="space-y-12 lg:space-y-20">
          {list.map((sector, i) => {
            const isOdd = i % 2 === 1;
            return (
              <SectorCard key={sector._id} sector={sector} index={i} reversed={isOdd} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectorCard({ sector, index, reversed }: { sector: Sector; index: number; reversed: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-14 items-center`}
    >
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={reversed ? fadeRight : fadeLeft}
        className={`${reversed ? "lg:order-2" : ""}`}
      >
        <ParallaxImage
          src={SECTOR_IMAGES[index % SECTOR_IMAGES.length]}
          alt={sector.name}
          className="aspect-[16/10] rounded-sm"
          speed={0.1}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={reversed ? fadeLeft : fadeRight}
        className={`${reversed ? "lg:order-1" : ""}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded bg-surface flex items-center justify-center text-accent-500">
            <SectorIcon name={sector.icon} className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-semibold text-accent-500 tracking-[0.15em] uppercase">0{index + 1}</span>
        </div>
        <TextReveal
          as="h2"
          className="text-2xl sm:text-3xl lg:text-4xl font-serif text-primary"
        >
          {sector.name}
        </TextReveal>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 text-accent-500 text-sm font-medium"
        >
          {sector.shortDescription}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-5 text-[15px] text-gray-500 leading-[1.75]"
        >
          {sector.fullDescription}
        </motion.p>
        {sector.stats && (
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="mt-6 pt-5 border-t border-gray-100 flex gap-8"
          >
            {sector.stats.map((s, j) => (
              <motion.div key={j} variants={staggerItem}>
                <p className="text-xl sm:text-2xl font-serif text-primary tracking-tight">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400 tracking-[0.1em] uppercase">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ============================================================================
// THESIS BANNER — CTA to learn more
// ============================================================================

function ThesisBanner({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <RevealSection className="py-14 sm:py-16 lg:py-20 bg-primary">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-3xl">
          <TextReveal
            as="h2"
            className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-serif text-white leading-[1.2]"
          >
            {settings.thesisTitle || D.thesisTitle || "The infrastructure gap is the investment opportunity of the decade"}
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-5 text-base text-white/60 leading-relaxed max-w-xl"
          >
            {settings.thesisDescription || D.thesisDescription}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <MagneticButton
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary hover:bg-white/90 text-sm font-semibold tracking-wide transition-colors rounded-sm"
            >
              Investor Relations
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </RevealSection>
  );
}
