"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Mail,
  ChevronDown,
  Linkedin,
} from "lucide-react";
import imageUrlBuilder from '@sanity/image-url';

// Sanity image URL builder
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'axtaz9gs';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

function urlFor(source: any) {
  if (!source) return null;
  return imageUrlBuilder({ projectId, dataset }).image(source);
}

// ============================================================================
// TYPES
// ============================================================================

export interface SiteSettings {
  // Hero
  heroHeadline?: string;
  heroSubheadline?: string;
  heroTagline?: string;
  // Thesis
  thesisTitle?: string;
  thesisDescription?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
  statsSource?: string;
  // Ecosystem
  ecosystemTitle?: string;
  ecosystemDescription?: string;
  rotatingWords?: string[];
  // Opportunity Zone
  opportunityZoneTitle?: string;
  opportunityZoneSubtitle?: string;
  opportunityZoneDescription?: string;
  opportunityZoneBullets?: string[];
  opportunityZoneStatValue?: string;
  opportunityZoneStatLabel?: string;
  opportunityZoneLearnMoreUrl?: string;
  opportunityZoneLearnMoreText?: string;
  // Contact
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  footerTagline?: string;
  footerDisclaimer?: string;
  // Styling
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  title: string;
  bio?: string;
  image?: any;
  linkedIn?: string;
  order?: number;
}

export interface Sector {
  _id: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  icon?: string;
  stats?: { value: string; label: string }[];
  order?: number;
}

export interface Insight {
  _id: string;
  title: string;
  slug?: { current: string };
  coverImage?: any;
  category?: string;
  excerpt?: string;
  body?: any[];
  date?: string;
  readTime?: string;
  featured?: boolean;
  order?: number;
}

// ============================================================================
// DEFAULT CONTENT (Fallbacks)
// ============================================================================

const DEFAULT_SETTINGS: SiteSettings = {
  // Hero
  heroHeadline: "Powering the Energy Transition",
  heroSubheadline: "M2PV Capital invests in sustainable mobility and green data infrastructure across the American Southwest.",
  heroTagline: "Private Equity · Energy Infrastructure",
  // Thesis
  thesisTitle: "The infrastructure gap is the investment opportunity of the decade",
  thesisDescription: "The Southwest Sunbelt offers peak solar irradiance, critical logistics corridors, and surging demand for clean power. Our integrated approach connects renewable generation directly to high-growth demand: EV charging networks and hyperscale data centers.",
  stat1Value: "$1T+",
  stat1Label: "Infrastructure Gap",
  stat2Value: "300+",
  stat2Label: "Days of Sun",
  stat3Value: "1+ GW",
  stat3Label: "Pipeline",
  stat4Value: "8,764",
  stat4Label: "Opportunity Zones",
  statsSource: "Sources: U.S. Department of Energy, NREL, IRS",
  // Ecosystem
  rotatingWords: ["Logistics Corridors", "Fleet Depots", "Data Centers", "Grid Edge", "Industrial Parks", "Distribution Hubs"],
  // Opportunity Zone
  opportunityZoneTitle: "Qualified Opportunity Zone Fund",
  opportunityZoneSubtitle: "Tax-Advantaged Structure",
  opportunityZoneDescription: "M2PV Capital operates as a Qualified Opportunity Zone Fund, enabling investors to defer and potentially reduce capital gains taxes while investing in transformative energy infrastructure.",
  opportunityZoneBullets: [
    "Capital gains tax deferral until 2026",
    "10%+ basis step-up for 5-year holds",
    "Tax-free appreciation on 10-year holds"
  ],
  opportunityZoneStatValue: "8,764",
  opportunityZoneStatLabel: "Designated Opportunity Zones in Target States",
  opportunityZoneLearnMoreUrl: "https://www.irs.gov/credits-deductions/businesses/opportunity-zones",
  opportunityZoneLearnMoreText: "Learn More at IRS.gov",
  // Contact
  contactEmail: "ir@m2pvcapital.com",
  footerDisclaimer: "© 2026 M2PV Capital. This website does not constitute an offer to sell or a solicitation of an offer to buy any securities.",
};

const NAV_LINKS = [
  { label: "Thesis", href: "#thesis" },
  { label: "Sectors", href: "#sectors" },
  { label: "Team", href: "#team" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_SECTORS = [
  {
    _id: "1",
    name: "Mobility",
    shortDescription: "Electrifying Critical Corridors",
    fullDescription: "High-speed charging networks positioned along the Southwest's busiest logistics routes—I-10, I-40, and the CANAMEX corridor.",
    icon: "Zap",
    stats: [{ value: "200+ MW", label: "Capacity" }, { value: "50+ Sites", label: "Locations" }],
  },
  {
    _id: "2",
    name: "Digital Infrastructure",
    shortDescription: "Solar-Powered Hyperscale",
    fullDescription: "Sustainable data centers powered by renewable generation, leveraging abundant desert solar for AI and cloud computing.",
    icon: "Server",
    stats: [{ value: "500+ MW", label: "Power" }, { value: "Tier III+", label: "Rating" }],
  },
  {
    _id: "3",
    name: "Renewables",
    shortDescription: "Grid-Scale Solar & Storage",
    fullDescription: "Utility-scale PV and battery storage systems stabilizing the Western Interconnection with 25-year contracted cash flows.",
    icon: "Sun",
    stats: [{ value: "1+ GW", label: "Pipeline" }, { value: "25-Year", label: "PPAs" }],
  },
];

const DEFAULT_TEAM: TeamMember[] = [
  { _id: "1", name: "Managing Partner", title: "Managing Partner", bio: "Over 20 years of experience in infrastructure investing and energy project development." },
  { _id: "2", name: "General Partner", title: "General Partner", bio: "Extensive background in renewable energy development and project finance." },
  { _id: "3", name: "Partner", title: "Partner", bio: "Specializes in data center infrastructure and technology investments." },
  { _id: "4", name: "Principal", title: "Principal", bio: "Expert in EV charging infrastructure and sustainable transportation." },
  { _id: "5", name: "Vice President", title: "Vice President", bio: "Deep expertise in utility-scale solar development and grid interconnection." },
  { _id: "6", name: "Vice President", title: "Vice President", bio: "Background in institutional asset management and alternative investments." },
  { _id: "7", name: "Associate", title: "Associate", bio: "Focus on deal execution and portfolio management." },
  { _id: "8", name: "Analyst", title: "Analyst", bio: "Specializes in financial modeling and due diligence." },
];

const DEFAULT_INSIGHTS: Insight[] = [
  { _id: "1", title: "The Power-Hungry AI: Data Center Energy Demands", category: "INSIGHTS", date: "JAN 15, 2026", readTime: "5 MIN READ", excerpt: "How the explosion in AI compute is reshaping power requirements for hyperscale facilities." },
  { _id: "2", title: "Grid Constraints: The Hidden Bottleneck", category: "INSIGHTS", date: "DEC 28, 2025", readTime: "4 MIN READ", excerpt: "Why interconnection queues are creating unprecedented opportunities for shovel-ready solar projects." },
  { _id: "3", title: "Fleet Electrification: The Logistics Opportunity", category: "NEWS", date: "DEC 10, 2025", readTime: "3 MIN READ", excerpt: "Mapping the depot charging infrastructure needed for commercial fleet transitions along I-10." },
];

const SECTOR_IMAGES = [
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
];

const INSIGHT_IMAGES = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
];

// ============================================================================
// PROPS
// ============================================================================

interface PageClientProps {
  settings: SiteSettings | null;
  team: TeamMember[];
  sectors: Sector[];
  insights: Insight[];
}

// ============================================================================
// NAVBAR
// ============================================================================

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled ? "bg-stone-950/90 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <a href="#" className="group flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                <span className="font-bold text-stone-950 text-sm tracking-tight">M2</span>
              </div>
              <span className="text-white text-lg font-medium tracking-tight hidden sm:block">
                M2PV Capital
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-stone-400 hover:text-white transition-colors duration-300 tracking-wide uppercase"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-stone-950 lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl text-white font-light tracking-wide"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  const headline = settings.heroHeadline || DEFAULT_SETTINGS.heroHeadline!;
  const subheadline = settings.heroSubheadline || DEFAULT_SETTINGS.heroSubheadline!;

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Video Background - Solar Panels (with fallback image for mobile) */}
      <motion.div style={{ scale }} className="absolute inset-0">
        {/* Video - may not autoplay on some mobile devices */}
        <video
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          className="w-full h-full object-cover opacity-70 hidden sm:block"
          poster="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
          src="https://videos.pexels.com/video-files/2800369/2800369-hd_1920_1080_30fps.mp4"
        />
        {/* Fallback image for mobile */}
        <div 
          className="sm:hidden w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity, y }} className="relative z-10 max-w-[1800px] mx-auto px-8 lg:px-16 w-full">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] text-white font-light leading-[0.9] tracking-[-0.02em]"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed font-light"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12"
          >
            <a
              href="#thesis"
              className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
            >
              <span className="text-sm uppercase tracking-[0.2em]">Our Perspective</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Animated Mouse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        {/* Mouse outline */}
        <div className="relative w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          {/* Scrolling dot */}
          <motion.div 
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-white/60 rounded-full mt-2"
          />
        </div>
        {/* Scroll text */}
        <motion.p 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/40 text-[10px] tracking-[0.3em] uppercase"
        >
          Scroll
        </motion.p>
      </motion.div>

      {/* Minimal Corner Branding */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <p className="text-white/30 text-xs uppercase tracking-[0.3em]">
          Energy Infrastructure
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// THESIS SECTION
// ============================================================================

function ThesisSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="thesis" ref={ref} className="min-h-screen flex flex-col justify-center py-20 lg:py-32 bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        {/* Large Statement */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-[1.1] tracking-[-0.02em]">
            {settings.thesisTitle || DEFAULT_SETTINGS.thesisTitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-2xl ml-auto"
        >
          <p className="text-lg text-white/50 leading-relaxed">
            {settings.thesisDescription || DEFAULT_SETTINGS.thesisDescription}
          </p>
        </motion.div>

        {/* Stats Grid - More Minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 pt-16 border-t border-white/10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { value: settings.stat1Value || DEFAULT_SETTINGS.stat1Value, label: settings.stat1Label || DEFAULT_SETTINGS.stat1Label },
              { value: settings.stat2Value || DEFAULT_SETTINGS.stat2Value, label: settings.stat2Label || DEFAULT_SETTINGS.stat2Label },
              { value: settings.stat4Value || DEFAULT_SETTINGS.stat4Value, label: settings.stat4Label || DEFAULT_SETTINGS.stat4Label },
              { value: settings.stat3Value || DEFAULT_SETTINGS.stat3Value, label: settings.stat3Label || DEFAULT_SETTINGS.stat3Label },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                className="group"
              >
                <p className="text-4xl lg:text-5xl xl:text-6xl text-white font-light tracking-tight mb-3">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-[0.15em]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
          
          {/* Stats Source */}
          <p className="mt-12 text-white/20 text-xs">
            {settings.statsSource || DEFAULT_SETTINGS.statsSource}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTORS SECTION
// ============================================================================

function SectorsSection({ sectors }: { sectors: Sector[] }) {
  const [selectedSector, setSelectedSector] = useState<(Sector & { image: string }) | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const displaySectors = sectors.length > 0 ? sectors : DEFAULT_SECTORS;

  return (
    <>
      <section id="sectors" ref={ref} className="min-h-screen flex flex-col justify-center py-20 lg:py-32 bg-[#111111]">
        {/* Section Header */}
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-[-0.02em]">
              Our Sectors
            </h2>
            <p className="mt-8 text-lg text-white/50 max-w-xl">
              We partner with world-class operators to build infrastructure that powers the energy transition.
            </p>
          </motion.div>

          {/* Sector Cards with Images */}
          <div className="grid md:grid-cols-3 gap-8">
            {displaySectors.map((sector, index) => (
              <motion.div
                key={sector._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedSector({ ...sector, image: SECTOR_IMAGES[index % SECTOR_IMAGES.length] })}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-black">
                  <img
                    src={SECTOR_IMAGES[index % SECTOR_IMAGES.length]}
                    alt={sector.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-white/30 text-xs tracking-wider mb-2 block">0{index + 1}</span>
                    <h3 className="text-2xl lg:text-3xl text-white font-light tracking-[-0.02em] group-hover:text-white/80 transition-colors">
                      {sector.name}
                    </h3>
                    <p className="mt-3 text-white/40 text-sm max-w-xs">{sector.shortDescription}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sector Modal */}
      <AnimatePresence>
        {selectedSector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedSector(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-neutral-900 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video overflow-hidden">
                <img src={selectedSector.image} alt={selectedSector.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-10 lg:p-14">
                <div className="flex items-center gap-6 mb-6">
                  {selectedSector.stats?.map((stat, i) => (
                    <span key={i} className="text-sm text-white/40 uppercase tracking-wider">
                      {stat.value} <span className="text-white/20">{stat.label}</span>
                    </span>
                  ))}
                </div>
                <h3 className="text-4xl lg:text-5xl text-white font-light tracking-[-0.02em]">{selectedSector.name}</h3>
                <p className="mt-4 text-white/40 text-lg">{selectedSector.shortDescription}</p>
                <p className="mt-8 text-white/60 text-lg leading-relaxed">{selectedSector.fullDescription}</p>
                <button
                  onClick={() => setSelectedSector(null)}
                  className="mt-12 text-sm text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                >
                  ← Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// ECOSYSTEM SECTION
// ============================================================================

function EcosystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedStep, setSelectedStep] = useState<{ num: string; title: string; desc: string; details: string; stats: string } | null>(null);

  const steps = [
    { 
      num: "01", 
      title: "Generation", 
      desc: "Utility-scale solar PV",
      details: "We develop and acquire utility-scale solar photovoltaic projects across the American Southwest, targeting high-irradiance zones with proven grid interconnection pathways. Our projects range from 50MW to 500MW capacity.",
      stats: "1+ GW pipeline"
    },
    { 
      num: "02", 
      title: "Storage", 
      desc: "Grid-scale BESS",
      details: "Battery Energy Storage Systems (BESS) enable 24/7 power delivery by storing excess solar generation for dispatch during peak demand periods. We co-locate storage with generation assets to maximize value capture.",
      stats: "4-hour duration"
    },
    { 
      num: "03", 
      title: "Mobility", 
      desc: "EV charging networks",
      details: "Our EV charging infrastructure targets high-traffic corridors and fleet depots across the Southwest. We provide turnkey charging solutions powered by our renewable generation assets.",
      stats: "500+ planned stations"
    },
    { 
      num: "04", 
      title: "Compute", 
      desc: "AI data centers",
      details: "Hyperscale data centers require massive amounts of reliable, low-cost power. We develop solar-powered compute facilities that offer corporate buyers direct access to renewable energy at scale.",
      stats: "100MW+ capacity"
    },
  ];

  return (
    <>
      <section ref={ref} className="relative min-h-screen flex flex-col justify-center py-20 lg:py-32 overflow-hidden">
        {/* Video Background - Solar Farm (with mobile fallback) */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            preload="auto"
            className="w-full h-full object-cover hidden sm:block"
            poster="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
            src="https://videos.pexels.com/video-files/5561459/5561459-hd_1920_1080_25fps.mp4"
          />
          {/* Fallback image for mobile */}
          <div 
            className="sm:hidden w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto mb-24"
          >
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6">Integrated Platform</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-[1.1] tracking-[-0.02em]">
              Capturing value at every stage of the electron's journey
            </h2>
          </motion.div>

          {/* Integrated Flow Diagram - Clickable */}
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4">
            {steps.map((item, index) => (
              <React.Fragment key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  onClick={() => setSelectedStep(item)}
                  className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-8 lg:p-10 group hover:bg-white/15 hover:border-white/20 transition-all duration-500 cursor-pointer"
                >
                  <span className="text-white/30 text-xs tracking-wider block mb-6">{item.num}</span>
                  <h4 className="text-2xl lg:text-3xl text-white font-light mb-3 group-hover:text-white transition-colors">{item.title}</h4>
                  <p className="text-white/40 text-sm group-hover:text-white/60 transition-colors">{item.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-white/30 group-hover:text-white/60 transition-colors">
                    <span className="text-xs tracking-wider uppercase">Learn more</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </motion.div>
                {/* Arrow connector between items */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center px-2">
                    <ArrowRight className="w-6 h-6 text-white/30" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Benefits Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-20 pt-12 border-t border-white/10"
          >
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Lower Cost", desc: "Captive generation reduces OPEX" },
                { title: "Higher Margin", desc: "Vertical integration captures value" },
                { title: "Grid Resilience", desc: "Battery storage ensures 24/7 uptime" },
              ].map((item, i) => (
                <div key={item.title}>
                  <p className="text-xl lg:text-2xl text-white font-light">{item.title}</p>
                  <p className="mt-2 text-white/40 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Step Popup */}
      <AnimatePresence>
        {selectedStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedStep(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-zinc-900 border border-white/10 max-w-xl w-full p-10 lg:p-14"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-amber-400/80 text-sm tracking-wider block mb-4">{selectedStep.num}</span>
              <h3 className="text-4xl lg:text-5xl text-white font-light mb-4">{selectedStep.title}</h3>
              <p className="text-white/40 text-lg mb-8">{selectedStep.desc}</p>
              
              <p className="text-white/70 leading-relaxed mb-10">{selectedStep.details}</p>
              
              <div className="pt-8 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedStep(null)}
                  className="text-xs text-white/40 hover:text-white transition-colors tracking-wider uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// ROTATING TEXT SECTION (with solar video background)
// ============================================================================

function RotatingTextSection({ settings }: { settings: SiteSettings }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = settings.rotatingWords || DEFAULT_SETTINGS.rotatingWords!;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center py-20 lg:py-32 overflow-hidden">
      {/* Solar Video Background (with mobile fallback) */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover hidden sm:block"
          poster="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80"
          src="https://videos.pexels.com/video-files/6976543/6976543-hd_1920_1080_25fps.mp4"
        />
        {/* Fallback image for mobile */}
        <div 
          className="sm:hidden w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-8">Powering the Transition</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light leading-[1.1] tracking-[-0.02em] max-w-5xl">
            Digital transformation is everywhere
            <br />
            <span className="text-white/40">except for </span>
            <span className="relative inline-block text-amber-400">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {words[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-16 text-lg text-white/50 max-w-xl"
          >
            We're building the infrastructure that closes the gap—connecting clean power to the places that need it most.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// OPPORTUNITY ZONE SECTION
// ============================================================================

function OpportunityZoneSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const bullets = settings.opportunityZoneBullets || DEFAULT_SETTINGS.opportunityZoneBullets!;
  const learnMoreUrl = settings.opportunityZoneLearnMoreUrl || DEFAULT_SETTINGS.opportunityZoneLearnMoreUrl!;
  const learnMoreText = settings.opportunityZoneLearnMoreText || DEFAULT_SETTINGS.opportunityZoneLearnMoreText!;

  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center py-20 lg:py-32 bg-[#0f0f0f] border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-2 gap-20 items-center"
        >
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-[1.1] tracking-[-0.02em]">
              {settings.opportunityZoneTitle || DEFAULT_SETTINGS.opportunityZoneTitle}
            </h2>
            <p className="mt-8 text-lg text-white/50 leading-relaxed">
              {settings.opportunityZoneDescription || DEFAULT_SETTINGS.opportunityZoneDescription}
            </p>
            <div className="mt-10 space-y-4">
              {bullets.map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-white/70">{item}</p>
                </div>
              ))}
            </div>
            
            {/* Learn More Button */}
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-500 group"
            >
              <span className="text-sm tracking-[0.15em] uppercase">{learnMoreText}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Stat Card */}
          <div className="flex items-end justify-end">
            <div className="border-l border-white/10 pl-12">
              <p className="text-7xl lg:text-8xl text-white font-extralight tracking-tight mb-4">
                {settings.opportunityZoneStatValue || DEFAULT_SETTINGS.opportunityZoneStatValue}
              </p>
              <p className="text-white/40 text-sm tracking-[0.15em] uppercase">
                {settings.opportunityZoneStatLabel || DEFAULT_SETTINGS.opportunityZoneStatLabel}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM SECTION
// ============================================================================

function TeamSection({ team }: { team: TeamMember[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const displayTeam = team.length > 0 ? team : DEFAULT_TEAM;

  return (
    <>
      <section id="team" ref={ref} className="min-h-screen flex flex-col justify-center py-20 lg:py-32 bg-[#1a1a1a] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="mb-24"
          >
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6">Leadership</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-white font-extralight tracking-[-0.02em]">
              Our Team
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {displayTeam.map((member, index) => {
              const imageUrl = member.image 
                ? urlFor(member.image)?.width(400).height(533).url() 
                : `https://api.dicebear.com/7.x/shapes/svg?seed=m2pv${index + 1}&backgroundColor=0a0a0a&shape1Color=404040&shape2Color=262626&shape3Color=171717`;
              
              return (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="aspect-[3/4] overflow-hidden mb-8 bg-neutral-800">
                    <img
                      src={imageUrl || ''}
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl text-white font-light mb-2">{member.name}</h3>
                      <p className="text-white/40 text-sm">{member.title}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Member Popup */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-neutral-950 border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-[3/4] md:aspect-auto overflow-hidden bg-neutral-900">
                  <img
                    src={selectedMember.image 
                      ? urlFor(selectedMember.image)?.width(600).height(800).url() || ''
                      : `https://api.dicebear.com/7.x/shapes/svg?seed=m2pv${selectedMember._id}&backgroundColor=0a0a0a`
                    }
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-10 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl text-white font-extralight tracking-[-0.02em] mb-3">{selectedMember.name}</h3>
                  <p className="text-white/40 text-sm tracking-[0.1em] uppercase mb-8">{selectedMember.title}</p>
                  {selectedMember.bio && (
                    <p className="text-white/60 leading-relaxed mb-10 font-light">{selectedMember.bio}</p>
                  )}
                  <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                    {selectedMember.linkedIn && (
                      <a
                        href={selectedMember.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-xs tracking-[0.1em] uppercase">LinkedIn</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="ml-auto text-xs text-white/30 hover:text-white transition-colors tracking-[0.1em] uppercase"
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

// ============================================================================
// INSIGHTS SECTION
// ============================================================================

function InsightsSection({ insights }: { insights: Insight[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const displayInsights = insights.length > 0 ? insights : DEFAULT_INSIGHTS;

  // Helper to render portable text simply
  const renderBody = (body: any[]) => {
    if (!body) return null;
    return body.map((block, index) => {
      if (block._type === 'block') {
        const text = block.children?.map((child: any) => child.text).join('') || '';
        switch (block.style) {
          case 'h2':
            return <h2 key={index} className="text-2xl text-white font-extralight mt-10 mb-4">{text}</h2>;
          case 'h3':
            return <h3 key={index} className="text-xl text-white font-light mt-8 mb-3">{text}</h3>;
          case 'blockquote':
            return <blockquote key={index} className="border-l border-white/20 pl-6 italic text-white/50 my-6">{text}</blockquote>;
          default:
            return <p key={index} className="text-white/60 leading-relaxed mb-5">{text}</p>;
        }
      }
      if (block._type === 'image') {
        const imgUrl = urlFor(block)?.width(800).url();
        return imgUrl ? (
          <div key={index} className="my-8">
            <img src={imgUrl} alt={block.alt || ''} className="w-full" />
            {block.caption && <p className="text-white/30 text-sm mt-3">{block.caption}</p>}
          </div>
        ) : null;
      }
      return null;
    });
  };

  return (
    <>
      <section id="insights" ref={ref} className="py-40 lg:py-56 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="mb-24"
          >
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6">Perspectives</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-white font-extralight tracking-[-0.02em]">
              Latest Insights
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayInsights.map((insight, index) => {
              const imageUrl = insight.coverImage 
                ? urlFor(insight.coverImage)?.width(600).height(400).url() 
                : INSIGHT_IMAGES[index % INSIGHT_IMAGES.length];
              
              return (
                <motion.article
                  key={insight._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedInsight(insight)}
                >
                  {/* Cover Image */}
                  <div className="aspect-[16/10] overflow-hidden mb-6 bg-neutral-900">
                    <img
                      src={imageUrl || ''}
                      alt={insight.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    <span className="text-white/30 text-xs tracking-[0.2em] uppercase">{insight.category}</span>
                    <span className="text-white/20 text-xs">{insight.date}</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl text-white font-light group-hover:text-white/60 transition-colors duration-500 leading-tight">
                    {insight.title}
                  </h3>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Insight Popup */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-neutral-950 border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover Image */}
              {selectedInsight.coverImage && (
                <div className="aspect-video overflow-hidden border-b border-white/10">
                  <img
                    src={urlFor(selectedInsight.coverImage)?.width(1200).height(675).url() || ''}
                    alt={selectedInsight.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-10 lg:p-14">
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-white/30 text-xs tracking-[0.2em] uppercase">{selectedInsight.category}</span>
                  <span className="text-white/20 text-xs">{selectedInsight.date}</span>
                  {selectedInsight.readTime && (
                    <span className="text-white/20 text-xs">{selectedInsight.readTime}</span>
                  )}
                </div>

                <h2 className="text-3xl lg:text-4xl text-white font-extralight tracking-[-0.02em] mb-8 leading-tight">
                  {selectedInsight.title}
                </h2>

                {selectedInsight.excerpt && (
                  <p className="text-xl text-white/50 mb-10 leading-relaxed font-light">
                    {selectedInsight.excerpt}
                  </p>
                )}

                {/* Article Body */}
                {selectedInsight.body && (
                  <div className="prose prose-invert max-w-none">
                    {renderBody(selectedInsight.body)}
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-white/10">
                  <button
                    onClick={() => setSelectedInsight(null)}
                    className="text-xs text-white/30 hover:text-white transition-colors tracking-[0.1em] uppercase"
                  >
                    ← Back to Insights
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// CONTACT SECTION
// ============================================================================

function ContactSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const email = settings.contactEmail || DEFAULT_SETTINGS.contactEmail!;

  return (
    <section id="contact" ref={ref} className="py-40 lg:py-56 bg-[#151515] border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6">Contact</p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-extralight tracking-[-0.02em] mb-12 leading-[1.1]">
            Let's build the future<br />of energy together.
          </h2>
          
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-4 text-white/60 hover:text-white transition-colors duration-500 group"
          >
            <span className="text-xl lg:text-2xl font-light">{email}</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer({ settings }: { settings: SiteSettings }) {
  const email = settings.contactEmail || DEFAULT_SETTINGS.contactEmail!;
  
  return (
    <footer className="py-16 bg-black border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Logo - Same as header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="font-semibold text-black text-xs">M2</span>
            </div>
            <span className="text-white text-lg font-light tracking-tight">M2PV Capital</span>
          </div>

          {/* Email */}
          <a 
            href={`mailto:${email}`}
            className="text-white/50 hover:text-white transition-colors text-sm"
          >
            {email}
          </a>

          {/* Disclaimer */}
          <p className="text-white/20 text-xs max-w-md leading-relaxed text-right">
            {settings.footerDisclaimer || DEFAULT_SETTINGS.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN CLIENT COMPONENT
// ============================================================================

export default function PageClient({ settings, team, sectors, insights }: PageClientProps) {
  const siteSettings = settings || DEFAULT_SETTINGS;

  return (
    <main className="min-h-screen bg-black antialiased">
      <Navbar />
      <HeroSection settings={siteSettings} />
      <ThesisSection settings={siteSettings} />
      <SectorsSection sectors={sectors} />
      <EcosystemSection />
      <RotatingTextSection settings={siteSettings} />
      <OpportunityZoneSection settings={siteSettings} />
      <TeamSection team={team} />
      <InsightsSection insights={insights} />
      <ContactSection settings={siteSettings} />
      <Footer settings={siteSettings} />
    </main>
  );
}
