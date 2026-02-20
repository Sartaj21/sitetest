"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Linkedin } from "lucide-react";
import {
  SiteSettings, TeamMember, D, DEFAULT_TEAM,
  fadeUp, staggerContainer, staggerItem,
  Navbar, Footer, PageHero, SectionLabel, urlFor,
  TextReveal, RevealSection,
} from "../components";

interface TeamPageClientProps {
  settings: SiteSettings | null;
  team: TeamMember[];
}

export default function TeamPageClient({ settings, team }: TeamPageClientProps) {
  const s = settings || D;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="Leadership"
        title="Our Team"
        subtitle="Experienced professionals with deep domain expertise across energy infrastructure, renewable development, and private equity."
      />
      <TeamGrid team={team} />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// TEAM GRID
// ============================================================================

function TeamGrid({ team }: { team: TeamMember[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const list = team.length > 0 ? team : DEFAULT_TEAM;

  return (
    <>
      <RevealSection className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-10 sm:mb-12">
            <SectionLabel>The People Behind M2PV</SectionLabel>
            <TextReveal
              as="p"
              className="text-[15px] sm:text-base text-gray-500 max-w-lg leading-relaxed"
            >
              Our team combines decades of experience in infrastructure investing, energy project development, and institutional asset management.
            </TextReveal>
          </div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-5 sm:gap-y-6 lg:gap-y-8"
          >
            {list.map((m, i) => {
              const img = m.image
                ? urlFor(m.image)?.width(400).height(500).url()
                : `https://api.dicebear.com/7.x/shapes/svg?seed=m2pv${i + 1}&backgroundColor=eef0f6&shape1Color=6b7194&shape2Color=4a5280&shape3Color=1a1f36`;
              return (
                <motion.div
                  key={m._id}
                  variants={staggerItem}
                  className="group cursor-pointer"
                  onClick={() => setSelected(m)}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-sm bg-surface mb-4">
                    <img
                      src={img || ""}
                      alt={m.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                  </div>
                  <h3 className="text-[15px] sm:text-base font-semibold text-primary leading-snug group-hover:text-accent-600 transition-colors duration-300">{m.name}</h3>
                  <p className="text-xs sm:text-[13px] text-gray-400 mt-0.5">{m.title}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </RevealSection>

      {/* Team Member Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 aspect-[3/4] md:aspect-auto overflow-hidden bg-surface">
                  <img
                    src={
                      selected.image
                        ? urlFor(selected.image)?.width(500).height(660).url() || ""
                        : `https://api.dicebear.com/7.x/shapes/svg?seed=m2pv${selected._id}&backgroundColor=eef0f6`
                    }
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-serif text-primary">{selected.name}</h3>
                  <p className="mt-1 text-accent-500 text-xs font-semibold tracking-[0.1em] uppercase">{selected.title}</p>
                  {selected.bio && (
                    <p className="mt-6 text-sm sm:text-[15px] text-gray-500 leading-relaxed">{selected.bio}</p>
                  )}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-5">
                    {selected.linkedIn && (
                      <a
                        href={selected.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-xs tracking-wide uppercase font-medium">LinkedIn</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelected(null)}
                      className="ml-auto text-xs text-gray-400 hover:text-primary transition-colors uppercase tracking-wide font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}