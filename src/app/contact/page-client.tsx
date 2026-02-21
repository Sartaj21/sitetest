"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  SiteSettings, D, fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem,
  Navbar, Footer, PageHero, SectionLabel,
  TextReveal, RevealSection, MagneticButton, LineReveal,
} from "../components";

interface ContactPageClientProps {
  settings: SiteSettings | null;
}

export default function ContactPageClient({ settings }: ContactPageClientProps) {
  const s = settings || D;
  const email = s.contactEmail || D.contactEmail!;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="Get In Touch"
        title="Let's build the future of energy together."
        subtitle="We welcome inquiries from institutional investors, family offices, and strategic partners."
      />
      <ContactContent email={email} settings={s} />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// CONTACT CONTENT
// ============================================================================

function ContactContent({ email, settings }: { email: string; settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <RevealSection className="py-16 sm:py-20 lg:py-28 bg-white">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Contact info */}
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeLeft}>
            <SectionLabel>Investor Relations</SectionLabel>
            <TextReveal
              as="h2"
              className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-primary leading-[1.2] tracking-[-0.01em]"
            >
              Reach out to our team
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 text-[15px] sm:text-base text-gray-500 leading-relaxed max-w-md"
            >
              Whether you&apos;re an institutional investor, family office, or strategic partner interested
              in the energy transition, we&apos;d like to hear from you.
            </motion.p>

            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="mt-10 space-y-6"
            >
              <motion.div variants={staggerItem}>
                <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-2">Email</h4>
                <a href={`mailto:${email}`} className="text-lg text-primary hover:text-accent-500 transition-colors duration-300 font-medium">
                  {email}
                </a>
              </motion.div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10"
            >
              <MagneticButton
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white hover:bg-primary-light text-sm font-semibold tracking-wide transition-colors rounded-sm"
              >
                Contact Investor Relations <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right — Quick links */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeRight}
            className="lg:pt-4"
          >
            <h3 className="text-lg font-serif text-primary mb-6">Quick Links</h3>
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="space-y-4"
            >
              {[
                { label: "About M2PV Capital", desc: "Learn about our firm, team, and investment approach.", href: "/about" },
                { label: "Investment Sectors", desc: "Explore our focus areas across the energy value chain.", href: "/sectors" },
                { label: "Latest Insights", desc: "Our perspectives on energy infrastructure and markets.", href: "/insights" },
              ].map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  variants={staggerItem}
                  className="group block p-5 border border-gray-100 rounded-sm hover:border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-semibold text-primary group-hover:text-accent-600 transition-colors duration-300">{link.label}</h4>
                      <p className="mt-1 text-sm text-gray-400">{link.desc}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-accent-500 shrink-0 mt-1 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 p-6 bg-[#f0f2f8] rounded-sm"
            >
              <h4 className="text-sm font-semibold text-primary mb-2">Qualified Opportunity Zone Fund</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                M2PV Capital operates as a Qualified Opportunity Zone Fund. Learn more about the
                tax advantages available to investors.
              </p>
              <a
                href="/about"
                className="mt-3 inline-flex items-center gap-1.5 text-accent-500 hover:text-accent-700 text-xs font-semibold transition-colors duration-300"
              >
                Learn More <ArrowRight className="w-3 h-3" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </RevealSection>
  );
}
