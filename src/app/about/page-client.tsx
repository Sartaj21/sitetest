"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Zap, Server, Sun, Battery } from "lucide-react";
import {
  SiteSettings, D, fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem,
  Navbar, Footer, PageHero, SectionLabel,
  TextReveal, CountUp, LineReveal, RevealSection,
} from "../components";

interface AboutPageClientProps {
  settings: SiteSettings | null;
  team?: any[];
}

export default function AboutPageClient({ settings }: AboutPageClientProps) {
  const s = settings || D;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="About M2PV Capital"
        title="Building the energy infrastructure of tomorrow."
        subtitle="We deploy growth equity and project capital across sustainable mobility, solar generation, battery storage, and green data infrastructure."
      />
      <FirmOverview settings={s} />
      <InvestmentApproach />
      <OpportunityZone settings={s} />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// FIRM OVERVIEW
// ============================================================================

function FirmOverview({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <RevealSection className="py-16 sm:py-20 lg:py-28 bg-white">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeLeft}
            className="lg:col-span-5"
          >
            <SectionLabel>Our Firm</SectionLabel>
            <TextReveal
              as="h2"
              className="text-[clamp(1.5rem,3vw,2.25rem)] font-serif text-primary leading-[1.25] tracking-[-0.01em]"
            >
              M2PV Capital is a energy infrastructure investment firm focused on the American Southwest.
            </TextReveal>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeRight}
            className="lg:col-span-7 lg:pt-4"
          >
            <p className="text-[15px] sm:text-base text-gray-600 leading-[1.8]">
              M2PV Capital deploys growth equity and project capital across sustainable mobility,
              solar generation, battery storage, and green data infrastructure. We target the
              convergence of renewable energy and digital demand, building vertically integrated
              platforms that capture value at every stage of the electron&apos;s journey.
            </p>
            <p className="mt-5 text-[15px] sm:text-base text-gray-600 leading-[1.8]">
              What sets us apart: our principals are experienced system architects who co-develop every
              investment we pursue. We don&apos;t just deploy capital — we design, engineer, and oversee project
              execution, giving us direct control over quality, cost, and timeline that purely financial
              sponsors cannot replicate.
            </p>
            <p className="mt-5 text-[15px] sm:text-base text-gray-600 leading-[1.8]">
              Because our team combines deep engineering expertise with investment experience,
              we evaluate every opportunity through a dual lens — technical feasibility and financial merit.
              We believe the Southwest Sunbelt represents the most compelling opportunity set in North American
              energy infrastructure today.
            </p>
            <LineReveal className="mt-8" />
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
            >
              {[
                { val: settings.stat1Value || D.stat1Value!, lbl: settings.stat1Label || D.stat1Label! },
                { val: settings.stat2Value || D.stat2Value!, lbl: settings.stat2Label || D.stat2Label! },
                { val: settings.stat3Value || D.stat3Value!, lbl: settings.stat3Label || D.stat3Label! },
                { val: settings.stat4Value || D.stat4Value!, lbl: settings.stat4Label || D.stat4Label! },
              ].map((s, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <p className="text-2xl sm:text-3xl font-serif text-primary tracking-tight">
                    <CountUp value={s.val} />
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-gray-400 tracking-[0.12em] uppercase font-medium">{s.lbl}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </RevealSection>
  );
}

// ============================================================================
// INVESTMENT APPROACH — Thesis steps
// ============================================================================

function InvestmentApproach() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <RevealSection className="py-16 sm:py-20 lg:py-28 bg-[#f0f2f8]">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}>
          <SectionLabel>Our Approach</SectionLabel>
          <TextReveal
            as="h2"
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-serif text-primary leading-[1.25] tracking-[-0.01em] max-w-2xl"
          >
            An engineer-led platform that captures value across the full energy value chain.
          </TextReveal>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { num: "01", title: "Generation", desc: "Utility-scale solar PV and wind projects in peak irradiance zones.", icon: <Sun className="w-5 h-5" /> },
            { num: "02", title: "Storage", desc: "Grid-scale battery storage systems for peak shaving and grid stability.", icon: <Battery className="w-5 h-5" /> },
            { num: "03", title: "Mobility", desc: "EV charging networks along critical logistics corridors.", icon: <Zap className="w-5 h-5" /> },
            { num: "04", title: "Compute", desc: "Solar-powered AI data centers serving hyperscale demand.", icon: <Server className="w-5 h-5" /> },
          ].map((step) => (
            <motion.div
              key={step.num}
              variants={staggerItem}
              className="group bg-white border border-gray-100 hover:border-accent-200 p-5 sm:p-6 lg:p-7 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 rounded-sm"
            >
              <div className="w-9 h-9 rounded bg-surface flex items-center justify-center text-accent-500 mb-4 group-hover:bg-accent-50 group-hover:scale-110 transition-all duration-300">
                {step.icon}
              </div>
              <span className="text-[10px] text-accent-500 font-semibold tracking-[0.15em] uppercase">{step.num}</span>
              <h4 className="mt-2 text-lg sm:text-xl font-serif text-primary">{step.title}</h4>
              <p className="mt-2 text-[13px] text-gray-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </RevealSection>
  );
}

// ============================================================================
// OPPORTUNITY ZONE
// ============================================================================

function OpportunityZone({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const bullets = settings.opportunityZoneBullets || D.opportunityZoneBullets!;

  return (
    <RevealSection className="py-16 sm:py-20 lg:py-28 bg-white">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeLeft} className="lg:col-span-7">
            <SectionLabel>{settings.opportunityZoneSubtitle || D.opportunityZoneSubtitle!}</SectionLabel>
            <TextReveal
              as="h2"
              className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-primary leading-[1.2]"
            >
              {settings.opportunityZoneTitle || D.opportunityZoneTitle || "Qualified Opportunity Zone Fund"}
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-[15px] sm:text-base text-gray-500 leading-[1.75]"
            >
              {settings.opportunityZoneDescription || D.opportunityZoneDescription}
            </motion.p>
            <motion.ul
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="mt-8 space-y-3"
            >
              {bullets.map((b) => (
                <motion.li key={b} variants={staggerItem} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                  <span className="text-sm sm:text-[15px] text-gray-600">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.a
              href={settings.opportunityZoneLearnMoreUrl || D.opportunityZoneLearnMoreUrl!}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 inline-flex items-center gap-2 text-accent-500 hover:text-accent-700 text-sm font-semibold transition-colors group"
            >
              {settings.opportunityZoneLearnMoreText || D.opportunityZoneLearnMoreText}
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeRight}
            className="lg:col-span-5 flex justify-start lg:justify-center"
          >
            <div className="border-l-2 border-accent-400 pl-8 sm:pl-10">
              <p className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-primary tracking-tight leading-none">
                <CountUp value={settings.opportunityZoneStatValue || D.opportunityZoneStatValue || "8,764"} />
              </p>
              <p className="mt-3 text-xs sm:text-sm text-gray-400 tracking-wide uppercase max-w-[240px]">
                {settings.opportunityZoneStatLabel || D.opportunityZoneStatLabel}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </RevealSection>
  );
}
