"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin } from "lucide-react";
import {
  SiteSettings, TeamMember, D,
  fadeUp, staggerContainer, staggerItem,
  Navbar, Footer, PageHero, SectionLabel,
  TextReveal, RevealSection, urlFor,
} from "../components";

// ============================================================================
// FALLBACK DATA (used when Sanity has no team members)
// ============================================================================

const FALLBACK_LEADERSHIP: TeamMember[] = [
  {
    _id: "f-ralph",
    name: "R. M. Mesmer (\"M2\")",
    title: "Founder & CEO",
    role: "leadership",
    image: null,
    imagePosition: "95% 15%",
    bio: "R. M. Mesmer founded M2PV Capital to bridge the gap between engineering excellence and energy infrastructure investment.",
  },
  {
    _id: "f-sarah",
    name: "Sarah Scott",
    title: "Chief Financial Officer",
    role: "leadership",
    image: null,
    bio: "Sarah oversees all financial operations, fund accounting, and investor relations at M2PV Capital.",
  },
  {
    _id: "f-gabriel",
    name: "Gabriel Araish",
    title: "Advisor",
    role: "leadership",
    image: null,
    bio: "Gabriel serves as a strategic advisor to M2PV Capital, bringing extensive experience in energy markets.",
  },
];

const FALLBACK_OPERATING: TeamMember[] = [
  {
    _id: "f-craig",
    name: "Craig Sutton",
    title: "Director, Real Estate",
    role: "operating",
    image: null,
  },
  {
    _id: "f-mike",
    name: "Mike Blackman",
    title: "Director, IT",
    role: "operating",
    image: null,
  },
  {
    _id: "f-sartaj",
    name: "Sartaj Gill",
    title: "Analyst, Finance",
    role: "operating",
    image: null,
  },
];

// Local image fallbacks (used when member has no Sanity image)
const LOCAL_IMAGES: Record<string, string> = {
  "R. M. Mesmer": "/m2.jpeg",
  "Sarah Scott": "/team/sarah.jpg",
  "Gabriel Araish": "/team/gabriel.png",
  "Craig Sutton": "/team/craig.jpg",
  "Mike Blackman": "/team/mike.jpg",
  "Sartaj Gill": "/team/sartaj.jpg",
};

function getImageUrl(member: TeamMember): string {
  if (member.image) {
    return urlFor(member.image)?.width(600).height(800).url() || LOCAL_IMAGES[member.name] || "";
  }
  return LOCAL_IMAGES[member.name] || "";
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

interface TeamPageClientProps {
  settings: SiteSettings | null;
  team: TeamMember[];
}

export default function TeamPageClient({ settings, team }: TeamPageClientProps) {
  const s = settings || D;

  // Split Sanity team by role, fall back to hardcoded if empty
  const sanityLeadership = team.filter((m) => m.role === "leadership");
  const sanityOperating = team.filter((m) => m.role === "operating");

  const leadership = sanityLeadership.length > 0 ? sanityLeadership : FALLBACK_LEADERSHIP;
  const operating = sanityOperating.length > 0 ? sanityOperating : FALLBACK_OPERATING;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="Leadership"
        title="Our Team"
        subtitle="Experienced professionals across energy infrastructure, renewable development, and investing."
      />
      <LeadershipSection members={leadership} />
      <OperatingTeamSection members={operating} />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// LEADERSHIP — PE-style large portrait cards
// ============================================================================

function LeadershipSection({ members }: { members: TeamMember[] }) {
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

        {/* Leadership grid — large cards */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10"
        >
          {members.map((person, i) => {
            const imgUrl = getImageUrl(person);
            const objectPos = person.imagePosition || "center";
            return (
              <motion.div
                key={person._id}
                variants={staggerItem}
                className="group"
              >
                {/* Photo */}
                <div className="aspect-[3/4] overflow-hidden rounded-sm bg-surface mb-5 sm:mb-6">
                  <img
                    src={imgUrl}
                    alt={person.name}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={{ objectPosition: objectPos }}
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
            );
          })}
        </motion.div>
      </div>
    </RevealSection>
  );
}

// ============================================================================
// OPERATING TEAM — Compact row, smaller circular photos
// ============================================================================

function OperatingTeamSection({ members }: { members: TeamMember[] }) {
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
          {members.map((person) => {
            const imgUrl = getImageUrl(person);
            const objectPos = person.imagePosition || "top";
            return (
              <motion.div
                key={person._id}
                variants={staggerItem}
                className="group"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 overflow-hidden rounded-full bg-white mb-4 mx-auto sm:mx-0 shadow-sm">
                  <img
                    src={imgUrl}
                    alt={person.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    style={{ objectPosition: objectPos }}
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
            );
          })}
        </motion.div>
      </div>
    </RevealSection>
  );
}