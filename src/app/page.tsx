"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useAnimation,
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
  Linkedin,
  ChevronDown,
  Play,
} from "lucide-react";

// ============================================================================
// CONTENT DATA
// ============================================================================

const NAV_LINKS = [
  { label: "Thesis", href: "#thesis" },
  { label: "Sectors", href: "#sectors" },
  { label: "Team", href: "#team" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const SECTORS = [
  {
    id: 1,
    title: "Mobility",
    tagline: "Electrifying Critical Corridors",
    description: "High-speed charging networks positioned along the Southwest's busiest logistics routes—I-10, I-40, and the CANAMEX corridor.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
    stats: ["200+ MW", "50+ Sites"],
    details: {
      description: "Our mobility infrastructure investments focus on high-speed charging networks strategically positioned along the Southwest's critical logistics corridors. We target depot charging facilities for commercial fleets, highway fast-charging stations, and urban charging hubs.",
      highlights: [
        "Strategic positioning along I-10, I-40, and CANAMEX corridors",
        "Partnerships with leading fleet operators and logistics companies",
        "Co-located solar and battery storage for grid independence",
        "Long-term offtake agreements with Fortune 500 shippers",
      ],
    },
  },
  {
    id: 2,
    title: "Digital Infrastructure",
    tagline: "Solar-Powered Hyperscale",
    description: "Sustainable data centers powered by renewable generation, leveraging abundant desert solar for AI and cloud computing.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    stats: ["500+ MW", "Tier III+"],
    details: {
      description: "We invest in sustainable data center infrastructure designed to meet the exponential growth in AI and cloud computing demand. Our facilities leverage the Southwest's abundant solar resources and favorable climate for natural cooling.",
      highlights: [
        "Purpose-built facilities optimized for AI/ML workloads",
        "Direct solar PPA integration for 100% renewable power",
        "Strategic locations in Arizona, Nevada, and New Mexico",
        "Water-efficient cooling leveraging dry desert climate",
      ],
    },
  },
  {
    id: 3,
    title: "Renewables",
    tagline: "Grid-Scale Solar & Storage",
    description: "Utility-scale PV and battery storage systems stabilizing the Western Interconnection with 25-year contracted cash flows.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    stats: ["1+ GW", "25-Year PPAs"],
    details: {
      description: "Our renewable generation portfolio includes utility-scale solar PV installations and battery energy storage systems across the Southwest Sunbelt. We focus on projects that provide grid stability while delivering predictable, long-term cash flows.",
      highlights: [
        "Peak solar irradiance locations in the Sonoran and Mojave deserts",
        "Co-located 4-hour battery storage for dispatchable power",
        "Investment-grade utility and corporate offtakers",
        "Shovel-ready projects with completed interconnection studies",
      ],
    },
  },
];

const TEAM = [
  {
    id: 1,
    name: "Managing Partner",
    role: "Managing Partner",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "mp@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Over 20 years of experience in infrastructure investing and energy project development. Previously led infrastructure investments at a major institutional investor.",
  },
  {
    id: 2,
    name: "General Partner",
    role: "General Partner",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv2&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "gp@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Extensive background in renewable energy development and project finance. Former executive at a leading independent power producer.",
  },
  {
    id: 3,
    name: "Partner",
    role: "Partner",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv3&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "partner@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Specializes in data center infrastructure and technology investments. Previously held senior roles at leading technology infrastructure firms.",
  },
  {
    id: 4,
    name: "Principal",
    role: "Principal",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv4&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "principal@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Expert in EV charging infrastructure and sustainable transportation. Former head of strategic development at a major EV charging network.",
  },
  {
    id: 5,
    name: "Vice President",
    role: "Vice President",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv5&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "vp@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Deep expertise in utility-scale solar development and grid interconnection. Previously worked in project finance at a bulge bracket investment bank.",
  },
  {
    id: 6,
    name: "Vice President",
    role: "Vice President",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv6&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "vp2@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Background in institutional asset management and alternative investments. Previously at a leading infrastructure-focused private equity firm.",
  },
  {
    id: 7,
    name: "Associate",
    role: "Associate",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv7&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "associate@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Focus on deal execution and portfolio management. Experience in investment banking with emphasis on energy and infrastructure M&A.",
  },
  {
    id: 8,
    name: "Analyst",
    role: "Analyst",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=m2pv8&backgroundColor=1c1917&shape1Color=78716c&shape2Color=57534e&shape3Color=44403c",
    email: "analyst@m2pvcapital.com",
    linkedin: "https://linkedin.com",
    bio: "Specializes in financial modeling and due diligence. Background in energy sector equity research.",
  },
];

const INSIGHTS = [
  {
    id: 1,
    date: "JAN 15, 2026",
    title: "The Power-Hungry AI: Data Center Energy Demands",
    category: "INSIGHTS",
    excerpt: "How the explosion in AI compute is reshaping power requirements for hyperscale facilities in the American Southwest.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    readTime: "5 MIN READ",
    content: "The rapid advancement of artificial intelligence is creating unprecedented demand for data center capacity. Our analysis indicates that AI workloads require 3-5x more power density than traditional compute, fundamentally reshaping infrastructure requirements.",
  },
  {
    id: 2,
    date: "DEC 28, 2025",
    title: "Grid Constraints: The Hidden Bottleneck",
    category: "INSIGHTS",
    excerpt: "Why interconnection queues are creating unprecedented opportunities for shovel-ready solar projects.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    readTime: "4 MIN READ",
    content: "With over 2,000 GW of generation capacity waiting in interconnection queues nationwide, projects with completed grid studies and approved interconnection agreements command significant premiums. We focus on acquiring and developing shovel-ready assets.",
  },
  {
    id: 3,
    date: "DEC 10, 2025",
    title: "Fleet Electrification: The Logistics Opportunity",
    category: "NEWS",
    excerpt: "Mapping the depot charging infrastructure needed for commercial fleet transitions along I-10.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    readTime: "3 MIN READ",
    content: "Major logistics operators are committing to fleet electrification, but charging infrastructure remains a critical bottleneck. Our analysis of the I-10 corridor identifies key depot locations where charging infrastructure is most urgently needed.",
  },
];

const ROTATING_WORDS = [
  "Logistics Corridors",
  "Fleet Depots",
  "Data Centers",
  "Grid Edge",
  "Industrial Parks",
  "Distribution Hubs",
];

// ============================================================================
// ANIMATION HOOKS
// ============================================================================

function useParallax(value: any, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// ============================================================================
// NAVBAR - Eclipse Style
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
          isScrolled
            ? "bg-stone-950/90 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <a href="#" className="group flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                <span className="font-bold text-stone-950 text-sm tracking-tight">M2</span>
              </div>
              <span className="text-white text-lg font-medium tracking-tight hidden sm:block">
                M2PV Capital
              </span>
            </a>

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
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
// HERO - Eclipse Style with Dramatic Animation
// ============================================================================

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center bg-stone-950 overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
          alt="Solar infrastructure"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 w-full"
      >
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-stone-400 text-sm uppercase tracking-[0.3em] mb-6"
          >
            Private Equity · Energy Infrastructure
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[0.95] tracking-tight mb-8"
          >
            Powering the
            <br />
            <span className="text-stone-400">Energy Transition</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-xl md:text-2xl text-stone-400 max-w-2xl leading-relaxed font-light"
          >
            M2PV Capital invests in sustainable mobility and green data infrastructure across the American Southwest.
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-stone-500 text-xs uppercase tracking-[0.2em]">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-stone-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// THESIS SECTION - Eclipse Style
// ============================================================================

function ThesisSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="thesis" ref={ref} className="py-32 lg:py-48 bg-stone-950">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Statement */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-8">Our Perspective</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-[1.1]">
              The infrastructure gap is the investment opportunity of the decade
            </h2>
          </motion.div>

          {/* Right - Details */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p className="text-lg text-stone-400 leading-relaxed mb-6">
              The Southwest Sunbelt offers peak solar irradiance, critical logistics corridors, and surging demand for clean power.
            </p>
            <p className="text-lg text-stone-400 leading-relaxed">
              Our integrated approach connects renewable generation directly to high-growth demand: EV charging networks and hyperscale data centers.
            </p>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-24 pt-12 border-t border-stone-800/50"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">$1T+</p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">Infrastructure Gap</p>
            </div>
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">300+</p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">Days of Sun</p>
            </div>
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">8,764</p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">Opportunity Zones</p>
            </div>
            <div className="border-l-2 border-stone-700 pl-6">
              <p className="text-4xl lg:text-5xl text-white font-light tracking-tight mb-2">1+ GW</p>
              <p className="text-stone-500 text-xs uppercase tracking-[0.15em]">Pipeline</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTORS SECTION - Eclipse Portfolio Style
// ============================================================================

function SectorsSection() {
  const [selectedSector, setSelectedSector] = useState<typeof SECTORS[0] | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

        {/* Sector Cards - Full Width */}
        {SECTORS.map((sector, index) => (
          <motion.div
            key={sector.id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group relative cursor-pointer border-t border-stone-800 hover:bg-stone-800/50 transition-all duration-500"
            onClick={() => setSelectedSector(sector)}
          >
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
              <div className="grid lg:grid-cols-12 gap-8 py-12 lg:py-16 items-center">
                {/* Image */}
                <div className="lg:col-span-4 overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={sector.image}
                      alt={sector.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-6">
                  <p className="text-stone-500 text-sm uppercase tracking-wider mb-3">{sector.tagline}</p>
                  <h3 className="text-3xl lg:text-4xl text-white font-light mb-4 group-hover:text-stone-300 transition-colors">
                    {sector.title}
                  </h3>
                  <p className="text-stone-400 text-lg leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                {/* Arrow */}
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

      {/* Sector Modal */}
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
                <img
                  src={selectedSector.image}
                  alt={selectedSector.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  {selectedSector.stats.map((stat, i) => (
                    <span key={i} className="text-sm text-stone-400 uppercase tracking-wider">
                      {stat}
                    </span>
                  ))}
                </div>
                <h3 className="text-4xl text-white font-light mb-2">
                  {selectedSector.title}
                </h3>
                <p className="text-stone-500 mb-8">{selectedSector.tagline}</p>
                <p className="text-stone-300 text-lg leading-relaxed mb-10">
                  {selectedSector.details.description}
                </p>
                <p className="text-stone-500 text-sm uppercase tracking-wider mb-4">Key Highlights</p>
                <ul className="space-y-4 mb-10">
                  {selectedSector.details.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-4 text-stone-300">
                      <span className="w-1 h-1 rounded-full bg-white mt-3 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
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
// ECOSYSTEM SECTION - Eclipse Style
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

        {/* Flow Diagram - Horizontal with arrows */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent hidden md:block" style={{ transform: 'translateY(-60px)' }} />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2">
            {/* Generation */}
            <div className="relative bg-stone-900/80 backdrop-blur p-8 lg:p-10 text-center group hover:bg-stone-800/80 transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-stone-500 group-hover:bg-stone-700 transition-all">
                <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <h4 className="text-lg text-white font-light mb-2">Generation</h4>
              <p className="text-stone-500 text-sm">Utility-scale solar PV</p>
              {/* Arrow */}
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-stone-600" />
              </div>
            </div>

            {/* Storage */}
            <div className="relative bg-stone-900/80 backdrop-blur p-8 lg:p-10 text-center group hover:bg-stone-800/80 transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-stone-500 group-hover:bg-stone-700 transition-all">
                <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="6" y="7" width="12" height="10" rx="1" />
                  <path d="M10 7V5a2 2 0 012-2v0a2 2 0 012 2v2" />
                  <path d="M10 12h4" />
                  <path d="M12 10v4" />
                </svg>
              </div>
              <h4 className="text-lg text-white font-light mb-2">Storage</h4>
              <p className="text-stone-500 text-sm">Grid-scale BESS</p>
              {/* Arrow */}
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-stone-600" />
              </div>
            </div>

            {/* Mobility */}
            <div className="relative bg-stone-900/80 backdrop-blur p-8 lg:p-10 text-center group hover:bg-stone-800/80 transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-stone-500 group-hover:bg-stone-700 transition-all">
                <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h4 className="text-lg text-white font-light mb-2">Mobility</h4>
              <p className="text-stone-500 text-sm">EV charging networks</p>
              {/* Arrow */}
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-stone-600" />
              </div>
            </div>

            {/* Compute */}
            <div className="relative bg-stone-900/80 backdrop-blur p-8 lg:p-10 text-center group hover:bg-stone-800/80 transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:border-stone-500 group-hover:bg-stone-700 transition-all">
                <svg className="w-8 h-8 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="4" width="16" height="6" rx="1" />
                  <rect x="4" y="14" width="16" height="6" rx="1" />
                  <circle cx="8" cy="7" r="1" fill="currentColor" />
                  <circle cx="8" cy="17" r="1" fill="currentColor" />
                </svg>
              </div>
              <h4 className="text-lg text-white font-light mb-2">Compute</h4>
              <p className="text-stone-500 text-sm">AI data centers</p>
            </div>
          </div>
        </motion.div>

        {/* Value Props */}
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
// ROTATING TEXT SECTION - Eclipse "Where It Matters" Style
// ============================================================================

function RotatingTextSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
                  {ROTATING_WORDS[currentIndex]}
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

function OpportunityZoneSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 lg:py-48 bg-stone-950">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-6">Tax-Advantaged Investing</p>
            <h2 className="text-4xl md:text-5xl text-white font-light leading-tight mb-8">
              Opportunity Zone Focus
            </h2>
            <p className="text-xl text-stone-400 leading-relaxed mb-8 font-light">
              M2PV Capital strategically deploys infrastructure investments in federally designated Opportunity Zones, delivering superior risk-adjusted returns through significant tax advantages.
            </p>
            <a
              href="https://www.irs.gov/credits-deductions/businesses/opportunity-zones"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white hover:text-stone-400 transition-colors group"
            >
              <span className="uppercase text-sm tracking-wider">IRS Guidelines</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-stone-900 p-8">
              <p className="text-4xl text-white font-light mb-2">100%</p>
              <p className="text-stone-500 text-sm uppercase tracking-wider">Deferral</p>
            </div>
            <div className="bg-stone-900 p-8">
              <p className="text-4xl text-white font-light mb-2">0%</p>
              <p className="text-stone-500 text-sm uppercase tracking-wider">Tax on Gains</p>
            </div>
            <div className="bg-stone-900 p-8">
              <p className="text-4xl text-white font-light mb-2">10%</p>
              <p className="text-stone-500 text-sm uppercase tracking-wider">Step-Up</p>
            </div>
            <div className="bg-stone-900 p-8">
              <p className="text-4xl text-white font-light mb-2">10yr</p>
              <p className="text-stone-500 text-sm uppercase tracking-wider">Hold Period</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM SECTION - Horizontal Scrolling
// ============================================================================

function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<typeof TEAM[0] | null>(null);
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <section id="team" ref={ref} className="py-32 lg:py-48 bg-stone-900 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-[0.3em] mb-4">Leadership</p>
              <h2 className="text-4xl md:text-5xl text-white font-light">Our Team</h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center hover:bg-stone-800 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-stone-400 rotate-180" />
              </button>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center hover:bg-stone-800 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Horizontal Scroll Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TEAM.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer flex-shrink-0 w-[280px] lg:w-[320px]"
              onClick={() => setSelectedMember(member)}
            >
              <div className="aspect-[3/4] bg-stone-800 mb-4 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.role}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-base mb-1">{member.role}</p>
                  <p className="text-stone-600 text-xs uppercase tracking-wider">View Bio</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center group-hover:border-white transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team Modal */}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-stone-900 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-square bg-stone-800">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.role}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">
                    {selectedMember.role}
                  </p>
                  <h3 className="text-2xl text-white font-light mb-6">
                    {selectedMember.name}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed mb-8">
                    {selectedMember.bio}
                  </p>
                  <div className="flex items-center gap-6 mb-8">
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-2 text-xs text-stone-500 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-stone-500 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-xs text-stone-500 hover:text-white transition-colors uppercase tracking-wider self-start"
                  >
                    Close
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
// INSIGHTS SECTION - Eclipse Style
// ============================================================================

function InsightsSection() {
  const [selectedInsight, setSelectedInsight] = useState<typeof INSIGHTS[0] | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            {INSIGHTS.map((insight, index) => (
              <motion.article
                key={insight.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="aspect-[16/10] overflow-hidden mb-6">
                  <img
                    src={insight.image}
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
            ))}
          </div>
        </div>
      </section>

      {/* Insight Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-xl"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-stone-900 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={selectedInsight.image}
                  alt={selectedInsight.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">{selectedInsight.category}</span>
                  <span className="text-xs text-stone-600">·</span>
                  <span className="text-xs text-stone-500">{selectedInsight.date}</span>
                </div>
                <h3 className="text-3xl text-white font-light mb-8 leading-tight">
                  {selectedInsight.title}
                </h3>
                <p className="text-stone-300 text-lg leading-relaxed mb-6">
                  {selectedInsight.content}
                </p>
                <p className="text-stone-400 leading-relaxed mb-10">
                  {selectedInsight.excerpt}
                </p>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-xs text-stone-500 hover:text-white transition-colors uppercase tracking-wider"
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
// CONTACT SECTION - Eclipse Style
// ============================================================================

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            href="mailto:ir@m2pvcapital.com"
            className="inline-flex items-center gap-4 text-white hover:text-stone-400 transition-colors group"
          >
            <Mail className="w-6 h-6" />
            <span className="text-2xl font-light">ir@m2pvcapital.com</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER - Eclipse Style
// ============================================================================

function Footer() {
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
            © 2026 M2PV Capital. This website does not constitute an offer to sell or a solicitation of an offer to buy any securities.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 antialiased">
      <Navbar />
      <HeroSection />
      <ThesisSection />
      <SectorsSection />
      <EcosystemSection />
      <RotatingTextSection />
      <OpportunityZoneSection />
      <TeamSection />
      <InsightsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
