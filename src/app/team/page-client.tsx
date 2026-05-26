"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin } from "lucide-react";
import {
  SiteSettings, TeamMember, D,
  fadeUp, staggerContainer, staggerItem,
  Navbar, Footer, PageHero,
  RevealSection, urlFor,
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
    imagePosition: "center 20%",
    bio: "M2 founded M2PV Capital to bridge engineering excellence and energy infrastructure investment. He leads the firm's deployment of solar PV and small modular nuclear into rural areas supplying the next generation of American AI compute.",
  },
  {
    _id: "f-gabriel",
    name: "Gabriel Araish",
    title: "Advisor",
    role: "leadership",
    image: null,
    bio: "Gabriel advises M2PV Capital on strategy, capital markets, and project finance, bringing extensive experience across U.S. markets.",
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

// Local image fallbacks. Keyed by both _id (stable) AND name (for Sanity data),
// so cases like "R. M. Mesmer (\"M2\")" still resolve.
const LOCAL_IMAGES: Record<string, string> = {
  "f-ralph": "/team/ralph.jpg",
  "f-gabriel": "/team/gabriel.png",
  "f-craig": "/team/craig.jpg",
  "f-mike": "/team/mike.jpg",
  "f-sartaj": "/team/sartaj.jpg",
  "R. M. Mesmer (\"M2\")": "/team/ralph.jpg",
  "R. M. Mesmer": "/team/ralph.jpg",
  "Gabriel Araish": "/team/gabriel.png",
  "Craig Sutton": "/team/craig.jpg",
  "Mike Blackman": "/team/mike.jpg",
  "Sartaj Gill": "/team/sartaj.jpg",
};

function getImageUrl(member: TeamMember): string {
  if (member.image) {
    const sanityUrl = urlFor(member.image)?.width(900).height(1200).url();
    if (sanityUrl) return sanityUrl;
  }
  return LOCAL_IMAGES[member._id] || LOCAL_IMAGES[member.name] || "";
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

  const sanityLeadership = team.filter((m) => m.role === "leadership");
  const sanityOperating = team.filter((m) => m.role === "operating");

  const leadership = sanityLeadership.length > 0 ? sanityLeadership : FALLBACK_LEADERSHIP;
  const operating = sanityOperating.length > 0 ? sanityOperating : FALLBACK_OPERATING;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="Leadership"
        title="The people building it."
        subtitle="Engineers, operators, and investors deploying solar PV and nuclear SMR capacity behind AI compute demand."
      />
      <LeadershipSection members={leadership} />
      <OperatingTeamSection members={operating} />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// LEADERSHIP — 1786-style editorial portraits with bios
// ============================================================================

function LeadershipSection({ members }: { members: TeamMember[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <RevealSection className="pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 lg:pb-28 bg-white">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Editorial section header */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-14 sm:mb-20 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-black" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] uppercase text-black">
              Leadership
            </span>
          </div>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-black leading-[1.15] tracking-[-0.015em]">
            A firm built by engineers who deploy capital like operators.
          </h2>
        </motion.div>

        {/* Single-column editorial layout — alternating sides */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-20 sm:space-y-24 lg:space-y-32"
        >
          {members.map((person, i) => {
            const imgUrl = getImageUrl(person);
            const objectPos = person.imagePosition || "center 20%";
            const reversed = i % 2 === 1;

            return (
              <motion.article
                key={person._id}
                variants={staggerItem}
                className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start"
              >
                {/* Portrait — large, grayscale, color on hover */}
                <div className={`lg:col-span-5 ${reversed ? "lg:order-2 lg:col-start-8" : ""}`}>
                  <div className="group aspect-[4/5] overflow-hidden rounded-sm bg-surface relative">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={person.name}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="w-full h-full object-cover grayscale contrast-[1.05] transition-all duration-[900ms] ease-out group-hover:grayscale-0 group-hover:scale-[1.02]"
                        style={{ objectPosition: objectPos }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                        <span className="font-serif text-4xl text-neutral-300">
                          {person.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                    )}
                    {/* Index marker */}
                    <div className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.2em] text-white/80 mix-blend-difference">
                      0{i + 1}
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div className={`lg:col-span-6 lg:pt-6 ${reversed ? "lg:order-1 lg:col-start-2" : ""}`}>
                  <p className="text-[11px] font-bold text-black tracking-[0.22em] uppercase">
                    {person.title}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-serif text-black leading-[1.1] tracking-[-0.02em]">
                    {person.name}
                  </h3>
                  <div className="mt-6 w-12 h-px bg-black" />
                  {person.bio && (
                    <p className="mt-7 text-[15px] sm:text-base text-neutral-600 leading-[1.85] max-w-xl">
                      {person.bio}
                    </p>
                  )}

                  {person.linkedIn && (
                    <a
                      href={person.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 text-neutral-500 hover:text-black transition-colors duration-300 text-[11px] font-bold tracking-[0.2em] uppercase"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </RevealSection>
  );
}

// ============================================================================
// OPERATING TEAM — Square portraits, editorial grid
// ============================================================================

function OperatingTeamSection({ members }: { members: TeamMember[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <RevealSection className="py-20 sm:py-24 lg:py-28 bg-black text-white">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-14 sm:mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-white" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] uppercase text-white">
              Team
            </span>
          </div>
          <h2 className="text-[clamp(1.5rem,2.8vw,2.25rem)] font-serif text-white leading-[1.15] tracking-[-0.01em]">
            The operators behind every deal.
          </h2>
        </motion.div>

        {/* Square editorial grid */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
        >
          {members.map((person) => {
            const imgUrl = getImageUrl(person);
            const objectPos = person.imagePosition || "center 20%";
            return (
              <motion.div
                key={person._id}
                variants={staggerItem}
                className="group"
              >
                <div className="aspect-square overflow-hidden bg-neutral-900 mb-5">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={person.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale contrast-[1.05] transition-all duration-[800ms] ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                      style={{ objectPosition: objectPos }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-4xl text-neutral-700">
                        {person.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[10px] font-bold text-white/60 tracking-[0.22em] uppercase">
                  {person.title}
                </p>
                <h4 className="mt-2 text-xl sm:text-2xl font-serif text-white leading-tight tracking-[-0.01em]">
                  {person.name}
                </h4>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </RevealSection>
  );
}
