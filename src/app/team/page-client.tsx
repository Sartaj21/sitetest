"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin } from "lucide-react";
import {
  SiteSettings, TeamMember, D,
  fadeUp, staggerContainer, staggerItem,
  Navbar, Footer, PageHero, SectionLabel,
  TextReveal, RevealSection,
} from "../components";

// ============================================================================
// TEAM DATA
// ============================================================================

interface TeamPerson {
  name: string;
  title: string;
  image: string;
  bio: string;
  linkedIn?: string;
}

const LEADERSHIP: TeamPerson[] = [
  {
    name: "Ralph Mesmer",
    title: "Founder & CEO",
    image: "/team/ralph.png",
    bio: "Ralph founded M2PV Capital to bridge the gap between engineering excellence and energy infrastructure investment. With deep roots in system engineering and project development across the American Southwest, he leads the firm\u2019s investment strategy and oversees all portfolio operations.",
  },
  {
    name: "Sarah Scott",
    title: "Chief Financial Officer",
    image: "/team/sarah.jpg",
    bio: "Sarah oversees all financial operations, fund accounting, and investor relations at M2PV Capital. Her background in institutional finance and alternative investments ensures disciplined capital deployment and transparent reporting.",
  },
  {
    name: "Gabriel Araish",
    title: "Advisor",
    image: "/team/gabriel.png",
    bio: "Gabriel serves as a strategic advisor to M2PV Capital, bringing extensive experience in energy markets and infrastructure development. He provides guidance on deal sourcing, market positioning, and long-term portfolio strategy.",
  },
];

const OPERATING_TEAM: TeamPerson[] = [
  {
    name: "Craig Sutton",
    title: "Director, Real Estate",
    image: "/team/craig.jpg",
    bio: "Craig leads site acquisition and real estate strategy, identifying and securing optimal locations for energy infrastructure deployment across opportunity zones in the Southwest.",
  },
  {
    name: "Mike Blackman",
    title: "Director, IT",
    image: "/team/mike.jpg",
    bio: "Mike manages the firm\u2019s technology infrastructure and supports technical due diligence on data center and digital infrastructure investments.",
  },
  {
    name: "Sartaj Gill",
    title: "Analyst, Finance",
    image: "/team/sartaj.jpg",
    bio: "Sartaj supports financial modeling, due diligence, and portfolio analytics across the firm\u2019s energy infrastructure investments.",
  },
];

// ============================================================================
// PAGE COMPONENT
// ============================================================================

interface TeamPageClientProps {
  settings: SiteSettings | null;
  team: TeamMember[];
}

export default function TeamPageClient({ settings }: TeamPageClientProps) {
  const s = settings || D;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="Leadership"
        title="Our Team"
        subtitle="Experienced professionals across energy infrastructure, renewable development, and investing."
      />
      <LeadershipSection />
      <OperatingTeamSection />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// LEADERSHIP — PE-style large portrait cards
// ============================================================================

function LeadershipSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <RevealSection className="pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 bg-white">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-10 sm:mb-14"
        >
          <SectionLabel>Leadership</SectionLabel>
          <TextReveal
            as="p"
            className="text-[15px] sm:text-base text-gray-500 max-w-lg leading-relaxed"
          >
            Our leadership team combines experience in infrastructure investing, energy project development, and system engineering.
          </TextReveal>
        </motion.div>

        {/* Leadership grid — 3 large cards */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10"
        >
          {LEADERSHIP.map((person, i) => (
            <motion.div
              key={person.name}
              variants={staggerItem}
              className="group"
            >
              {/* Photo */}
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-surface mb-5 sm:mb-6">
                <img
                  src={person.image}
                  alt={person.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Info */}
              <h3 className="text-lg sm:text-xl font-serif text-primary leading-snug tracking-tight">
                {person.name}
              </h3>
              <p className="mt-1 text-xs sm:text-[13px] text-accent-500 font-semibold tracking-[0.08em] uppercase">
                {person.title}
              </p>

              {person.linkedIn && (
                <a
                  href={person.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-gray-300 hover:text-primary transition-colors duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </RevealSection>
  );
}

// ============================================================================
// OPERATING TEAM — Compact row, smaller circular photos
// ============================================================================

function OperatingTeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <RevealSection className="py-12 sm:py-16 lg:py-20 bg-[#f5f6fa]">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-8 sm:mb-10"
        >
          <SectionLabel>Team</SectionLabel>
          <TextReveal
            as="p"
            className="text-[15px] sm:text-base text-gray-500 max-w-md leading-relaxed"
          >
            The professionals supporting our investment and operational activities.
          </TextReveal>
        </motion.div>

        {/* Team grid — smaller circular photos */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-3xl"
        >
          {OPERATING_TEAM.map((person) => (
            <motion.div
              key={person.name}
              variants={staggerItem}
              className="group"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 overflow-hidden rounded-full bg-white mb-4 mx-auto sm:mx-0 shadow-sm">
                <img
                  src={person.image}
                  alt={person.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-[15px] sm:text-base font-semibold text-primary leading-snug">
                  {person.name}
                </h4>
                <p className="mt-0.5 text-[11px] sm:text-xs text-gray-400 tracking-[0.06em] uppercase font-medium">
                  {person.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </RevealSection>
  );
}