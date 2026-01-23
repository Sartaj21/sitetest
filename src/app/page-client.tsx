"use client";

import { useEffect, useRef, useState } from "react";
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
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const headline = settings.heroHeadline || DEFAULT_SETTINGS.heroHeadline!;
  const subheadline = settings.heroSubheadline || DEFAULT_SETTINGS.heroSubheadline!;
  const tagline = settings.heroTagline || DEFAULT_SETTINGS.heroTagline!;

  // Split headline by line break indicator
  const headlineParts = headline.split(" ");
  const midpoint = Math.ceil(headlineParts.length / 2);
  const line1 = headlineParts.slice(0, midpoint).join(" ");
  const line2 = headlineParts.slice(midpoint).join(" ");

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center bg-stone-950 overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
          alt="Solar infrastructure"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950" />
      </motion.div>

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-stone-400 text-sm uppercase tracking-[0.3em] mb-6"
          >
            {tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[0.95] tracking-tight mb-8"
          >
            {line1}
            <br />
            <span className="text-stone-400">{line2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-xl md:text-2xl text-stone-400 max-w-2xl leading-relaxed font-light"
          >
            {subheadline}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-stone-500 text-xs uppercase tracking-[0.2em]">Scroll to Explore</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="w-5 h-5 text-stone-500" />
        </motion.div>
      </motion.div>
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
    <section id="thesis" ref={ref} className="py-32 lg:py-48 bg-stone-950">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-8">Our Perspective</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-[1.1]">
              {settings.thesisTitle || DEFAULT_SETTINGS.thesisTitle}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p className="text-lg text-stone-400 leading-relaxed">
              {settings.thesisDescription || DEFAULT_SETTINGS.thesisDescription}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-24 pt-12 border-t border-stone-800/50"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">
                {settings.stat1Value || DEFAULT_SETTINGS.stat1Value}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">
                {settings.stat1Label || DEFAULT_SETTINGS.stat1Label}
              </p>
            </div>
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">
                {settings.stat2Value || DEFAULT_SETTINGS.stat2Value}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">
                {settings.stat2Label || DEFAULT_SETTINGS.stat2Label}
              </p>
            </div>
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">
                {settings.stat4Value || DEFAULT_SETTINGS.stat4Value}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">
                {settings.stat4Label || DEFAULT_SETTINGS.stat4Label}
              </p>
            </div>
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">
                {settings.stat3Value || DEFAULT_SETTINGS.stat3Value}
              </p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">
                {settings.stat3Label || DEFAULT_SETTINGS.stat3Label}
              </p>
            </div>
          </div>
          
          {/* Stats Source */}
          <p className="mt-8 text-stone-600 text-xs text-center">
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
      <section id="sectors" ref={ref} className="bg-stone-900">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-end justify-between mb-16"
          >
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-4">Investment Focus</p>
              <h2 className="text-4xl md:text-5xl text-white font-light">Our Sectors</h2>
            </div>
            <p className="text-stone-400 text-lg max-w-md hidden lg:block">
              We partner with world-class operators to build infrastructure that powers the energy transition.
            </p>
          </motion.div>
        </div>

        {displaySectors.map((sector, index) => (
          <motion.div
            key={sector._id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group relative cursor-pointer border-t border-stone-800 hover:bg-stone-800/50 transition-all duration-500"
            onClick={() => setSelectedSector({ ...sector, image: SECTOR_IMAGES[index % SECTOR_IMAGES.length] })}
          >
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
              <div className="grid lg:grid-cols-12 gap-8 py-12 lg:py-16 items-center">
                <div className="lg:col-span-4 overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={SECTOR_IMAGES[index % SECTOR_IMAGES.length]}
                      alt={sector.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <p className="text-stone-500 text-sm uppercase tracking-wider mb-3">{sector.shortDescription}</p>
                  <h3 className="text-3xl lg:text-4xl text-white font-light mb-4 group-hover:text-stone-300 transition-colors">
                    {sector.name}
                  </h3>
                  <p className="text-stone-400 text-lg leading-relaxed">{sector.fullDescription}</p>
                </div>

                <div className="lg:col-span-2 flex justify-end">
                  <div className="w-14 h-14 rounded-full border border-stone-700 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-stone-950 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <AnimatePresence>
        {selectedSector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-xl"
            onClick={() => setSelectedSector(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-stone-900 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video overflow-hidden">
                <img src={selectedSector.image} alt={selectedSector.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  {selectedSector.stats?.map((stat, i) => (
                    <span key={i} className="text-sm text-stone-400 uppercase tracking-wider">
                      {stat.value}
                    </span>
                  ))}
                </div>
                <h3 className="text-4xl text-white font-light mb-2">{selectedSector.name}</h3>
                <p className="text-stone-500 mb-8">{selectedSector.shortDescription}</p>
                <p className="text-stone-300 text-lg leading-relaxed mb-10">{selectedSector.fullDescription}</p>
                <button
                  onClick={() => setSelectedSector(null)}
                  className="text-sm text-stone-500 hover:text-white transition-colors uppercase tracking-wider"
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
// ECOSYSTEM SECTION
// ============================================================================

function EcosystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 lg:py-40 bg-stone-950">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-8">Integrated Value Chain</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-[1.1] max-w-4xl mx-auto">
            Capturing value at every stage of the electron's journey
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent hidden md:block" style={{ transform: 'translateY(-60px)' }} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2">
            {[
              { title: "Generation", desc: "Utility-scale solar PV", icon: "sun" },
              { title: "Storage", desc: "Grid-scale BESS", icon: "battery" },
              { title: "Mobility", desc: "EV charging networks", icon: "zap" },
              { title: "Compute", desc: "AI data centers", icon: "server" },
            ].map((item, index) => (
              <div key={item.title} className="relative bg-stone-900/80 backdrop-blur p-8 lg:p-10 text-center group hover:bg-stone-800/80 transition-all duration-500">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-stone-500 group-hover:bg-stone-700 transition-all">
                  {item.icon === "sun" && (
                    <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  )}
                  {item.icon === "battery" && (
                    <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="7" width="12" height="10" rx="1" />
                      <path d="M10 7V5a2 2 0 012-2v0a2 2 0 012 2v2" />
                      <path d="M10 12h4" />
                      <path d="M12 10v4" />
                    </svg>
                  )}
                  {item.icon === "zap" && (
                    <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  )}
                  {item.icon === "server" && (
                    <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="4" width="16" height="6" rx="1" />
                      <rect x="4" y="14" width="16" height="6" rx="1" />
                      <circle cx="8" cy="7" r="1" fill="currentColor" />
                      <circle cx="8" cy="17" r="1" fill="currentColor" />
                    </svg>
                  )}
                </div>
                <h4 className="text-lg text-white font-light mb-2">{item.title}</h4>
                <p className="text-stone-500 text-sm">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-stone-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 pt-12 border-t border-stone-800/30"
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl text-white font-light mb-2">Lower Cost</p>
                <p className="text-stone-500 text-sm">Captive generation reduces OPEX</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl text-white font-light mb-2">Higher Margin</p>
                <p className="text-stone-500 text-sm">Vertical integration captures value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl text-white font-light mb-2">Grid Resilience</p>
                <p className="text-stone-500 text-sm">Battery storage ensures 24/7 uptime</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// ROTATING TEXT SECTION
// ============================================================================

function RotatingTextSection({ settings }: { settings: SiteSettings }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = settings.rotatingWords || DEFAULT_SETTINGS.rotatingWords!;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section ref={ref} className="py-32 lg:py-48 bg-white overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-stone-900 font-light leading-[1.15] max-w-5xl mx-auto">
            The grid powers everything
            <br />
            <span className="text-stone-400">except for </span>
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-stone-900 inline-block"
                >
                  {words[currentIndex]}
                </motion.span>
              </AnimatePresence>
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-stone-900" />
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-12 text-xl text-stone-500 max-w-2xl mx-auto"
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
    <section ref={ref} className="py-32 lg:py-48 bg-stone-950">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-6">
              {settings.opportunityZoneSubtitle || DEFAULT_SETTINGS.opportunityZoneSubtitle}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-tight mb-8">
              {settings.opportunityZoneTitle || DEFAULT_SETTINGS.opportunityZoneTitle}
            </h2>
            <p className="text-xl text-stone-400 leading-relaxed mb-8">
              {settings.opportunityZoneDescription || DEFAULT_SETTINGS.opportunityZoneDescription}
            </p>
            <div className="space-y-4 mb-10">
              {bullets.map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <p className="text-stone-300">{item}</p>
                </div>
              ))}
            </div>
            
            {/* Learn More Button */}
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 border border-stone-700 text-white hover:bg-white hover:text-stone-950 transition-all duration-300 group"
            >
              <span className="text-sm uppercase tracking-wider">{learnMoreText}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          <div className="relative">
            <div className="aspect-square bg-stone-900 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
                alt="Solar installation"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-5xl text-white font-light mb-2">
                  {settings.opportunityZoneStatValue || DEFAULT_SETTINGS.opportunityZoneStatValue}
                </p>
                <p className="text-stone-400">
                  {settings.opportunityZoneStatLabel || DEFAULT_SETTINGS.opportunityZoneStatLabel}
                </p>
              </div>
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const displayTeam = team.length > 0 ? team : DEFAULT_TEAM;

  return (
    <>
      <section id="team" ref={ref} className="py-32 lg:py-48 bg-stone-900">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-4">Leadership</p>
            <h2 className="text-4xl md:text-5xl text-white font-light">Our Team</h2>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6 px-6 lg:px-12 pb-4" style={{ width: 'max-content' }}>
            {displayTeam.map((member, index) => {
              const imageUrl = member.image 
                ? urlFor(member.image)?.width(400).height(533).url() 
                : `https://api.dicebear.com/7.x/shapes/svg?seed=m2pv${index + 1}&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c`;
              
              return (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group flex-shrink-0 w-[280px] lg:w-[320px] cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="aspect-[3/4] overflow-hidden mb-6 bg-stone-800">
                    <img
                      src={imageUrl || ''}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl text-white font-light mb-1 group-hover:text-stone-300 transition-colors">{member.name}</h3>
                  <p className="text-stone-500 text-sm">{member.title}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Team Member Popup */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-xl"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-stone-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-[3/4] md:aspect-auto overflow-hidden bg-stone-800">
                  <img
                    src={selectedMember.image 
                      ? urlFor(selectedMember.image)?.width(600).height(800).url() || ''
                      : `https://api.dicebear.com/7.x/shapes/svg?seed=m2pv${selectedMember._id}&backgroundColor=1c1917`
                    }
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <h3 className="text-3xl text-white font-light mb-2">{selectedMember.name}</h3>
                  <p className="text-stone-400 text-lg mb-6">{selectedMember.title}</p>
                  {selectedMember.bio && (
                    <p className="text-stone-300 leading-relaxed mb-8">{selectedMember.bio}</p>
                  )}
                  <div className="flex items-center gap-4">
                    {selectedMember.linkedIn && (
                      <a
                        href={selectedMember.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="ml-auto text-sm text-stone-500 hover:text-white transition-colors uppercase tracking-wider"
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
            return <h2 key={index} className="text-2xl text-white font-light mt-8 mb-4">{text}</h2>;
          case 'h3':
            return <h3 key={index} className="text-xl text-white font-light mt-6 mb-3">{text}</h3>;
          case 'blockquote':
            return <blockquote key={index} className="border-l-2 border-stone-600 pl-4 italic text-stone-400 my-4">{text}</blockquote>;
          default:
            return <p key={index} className="text-stone-300 leading-relaxed mb-4">{text}</p>;
        }
      }
      if (block._type === 'image') {
        const imgUrl = urlFor(block)?.width(800).url();
        return imgUrl ? (
          <div key={index} className="my-6">
            <img src={imgUrl} alt={block.alt || ''} className="w-full rounded" />
            {block.caption && <p className="text-stone-500 text-sm mt-2 text-center">{block.caption}</p>}
          </div>
        ) : null;
      }
      return null;
    });
  };

  return (
    <>
      <section id="insights" ref={ref} className="py-32 lg:py-48 bg-stone-950">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-4">News & Insights</p>
            <h2 className="text-4xl md:text-5xl text-white font-light">Latest Perspectives</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayInsights.map((insight, index) => {
              const imageUrl = insight.coverImage 
                ? urlFor(insight.coverImage)?.width(800).height(500).url() 
                : INSIGHT_IMAGES[index % INSIGHT_IMAGES.length];
              
              return (
                <motion.article
                  key={insight._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedInsight(insight)}
                >
                  <div className="aspect-[16/10] overflow-hidden mb-6">
                    <img
                      src={imageUrl || ''}
                      alt={insight.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs text-stone-500 uppercase tracking-wider">{insight.category}</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">{insight.date} · {insight.readTime}</p>
                  <h3 className="text-xl text-white font-light mb-4 group-hover:text-stone-400 transition-colors leading-tight">
                    {insight.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider group-hover:text-white transition-colors">
                    Read More
                    <ArrowRight className="w-3 h-3" />
                  </span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-stone-900 max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={selectedInsight.coverImage 
                    ? urlFor(selectedInsight.coverImage)?.width(1200).height(675).url() || ''
                    : INSIGHT_IMAGES[0]
                  }
                  alt={selectedInsight.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">{selectedInsight.category}</span>
                  <span className="text-xs text-stone-600">•</span>
                  <span className="text-xs text-stone-500">{selectedInsight.date}</span>
                  {selectedInsight.readTime && (
                    <>
                      <span className="text-xs text-stone-600">•</span>
                      <span className="text-xs text-stone-500">{selectedInsight.readTime}</span>
                    </>
                  )}
                </div>

                <h2 className="text-3xl lg:text-4xl text-white font-light mb-6 leading-tight">
                  {selectedInsight.title}
                </h2>

                {selectedInsight.excerpt && (
                  <p className="text-lg text-stone-400 mb-8 leading-relaxed">
                    {selectedInsight.excerpt}
                  </p>
                )}

                {/* Article Body */}
                {selectedInsight.body && (
                  <div className="prose prose-invert max-w-none">
                    {renderBody(selectedInsight.body)}
                  </div>
                )}

                <div className="mt-10 pt-6 border-t border-stone-800">
                  <button
                    onClick={() => setSelectedInsight(null)}
                    className="text-sm text-stone-500 hover:text-white transition-colors uppercase tracking-wider"
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
    <section id="contact" ref={ref} className="py-32 lg:py-48 bg-stone-900">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-6">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-tight mb-8">
            Partner with M2PV Capital
          </h2>
          <p className="text-xl text-stone-400 leading-relaxed mb-12 font-light">
            For investor inquiries and partnership opportunities in energy infrastructure.
          </p>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-4 text-white hover:text-stone-400 transition-colors group"
          >
            <Mail className="w-6 h-6" />
            <span className="text-2xl font-light">{email}</span>
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
  return (
    <footer className="py-12 bg-stone-950 border-t border-stone-900">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <span className="font-bold text-stone-950 text-sm">M2</span>
            </div>
            <span className="text-white text-lg font-medium">M2PV Capital</span>
          </div>

          <p className="text-stone-600 text-sm max-w-md">
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
    <main className="min-h-screen bg-stone-950 antialiased">
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
