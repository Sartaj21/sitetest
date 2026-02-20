"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
  Linkedin,
  ChevronDown,
  Zap,
  Server,
  Sun,
  TrendingUp,
  Shield,
  BarChart3,
  Battery,
} from "lucide-react";
import imageUrlBuilder from "@sanity/image-url";

// Sanity image URL builder
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "axtaz9gs";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

function urlFor(source: any) {
  if (!source) return null;
  return imageUrlBuilder({ projectId, dataset }).image(source);
}

// ============================================================================
// TYPES
// ============================================================================

export interface SiteSettings {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroTagline?: string;
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
  ecosystemTitle?: string;
  ecosystemDescription?: string;
  rotatingWords?: string[];
  opportunityZoneTitle?: string;
  opportunityZoneSubtitle?: string;
  opportunityZoneDescription?: string;
  opportunityZoneBullets?: string[];
  opportunityZoneStatValue?: string;
  opportunityZoneStatLabel?: string;
  opportunityZoneLearnMoreUrl?: string;
  opportunityZoneLearnMoreText?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  footerTagline?: string;
  footerDisclaimer?: string;
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
// DEFAULT CONTENT
// ============================================================================

const D: SiteSettings = {
  heroHeadline: "Powering the Energy Transition",
  heroSubheadline:
    "M2PV Capital invests in sustainable mobility and green data infrastructure across the American Southwest.",
  heroTagline: "Private Equity · Energy Infrastructure",
  thesisTitle:
    "The infrastructure gap is the investment opportunity of the decade",
  thesisDescription:
    "The Southwest Sunbelt offers peak solar irradiance, critical logistics corridors, and surging demand for clean power. Our integrated approach connects renewable generation directly to high-growth demand: EV charging networks and hyperscale data centers.",
  stat1Value: "$1T+",
  stat1Label: "Infrastructure Gap",
  stat2Value: "300+",
  stat2Label: "Days of Sun",
  stat3Value: "1+ GW",
  stat3Label: "Pipeline",
  stat4Value: "8,764",
  stat4Label: "Opportunity Zones",
  statsSource: "Sources: U.S. Department of Energy, NREL, IRS",
  rotatingWords: [
    "Logistics Corridors",
    "Fleet Depots",
    "Data Centers",
    "Grid Edge",
    "Industrial Parks",
    "Distribution Hubs",
  ],
  opportunityZoneTitle: "Qualified Opportunity Zone Fund",
  opportunityZoneSubtitle: "Tax-Advantaged Structure",
  opportunityZoneDescription:
    "M2PV Capital operates as a Qualified Opportunity Zone Fund, enabling investors to defer and potentially reduce capital gains taxes while investing in transformative energy infrastructure.",
  opportunityZoneBullets: [
    "Capital gains tax deferral until 2026",
    "10%+ basis step-up for 5-year holds",
    "Tax-free appreciation on 10-year holds",
  ],
  opportunityZoneStatValue: "8,764",
  opportunityZoneStatLabel: "Designated Opportunity Zones in Target States",
  opportunityZoneLearnMoreUrl:
    "https://www.irs.gov/credits-deductions/businesses/opportunity-zones",
  opportunityZoneLearnMoreText: "Learn More at IRS.gov",
  contactEmail: "ir@m2pvcapital.com",
  footerDisclaimer:
    "© 2026 M2PV Capital. This website does not constitute an offer to sell or a solicitation of an offer to buy any securities.",
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Thesis", href: "#thesis" },
  { label: "Sectors", href: "#sectors" },
  { label: "Team", href: "#team" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_SECTORS: Sector[] = [
  {
    _id: "1",
    name: "Mobility",
    shortDescription: "Electrifying Critical Corridors",
    fullDescription:
      "High-speed charging networks positioned along the Southwest's busiest logistics routes — I-10, I-40, and the CANAMEX corridor.",
    icon: "Zap",
    stats: [
      { value: "200+ MW", label: "Capacity" },
      { value: "50+ Sites", label: "Locations" },
    ],
  },
  {
    _id: "2",
    name: "Digital Infrastructure",
    shortDescription: "Solar-Powered Hyperscale",
    fullDescription:
      "Sustainable data centers powered by renewable generation, leveraging abundant desert solar for AI and cloud computing.",
    icon: "Server",
    stats: [
      { value: "500+ MW", label: "Power" },
      { value: "Tier III+", label: "Rating" },
    ],
  },
  {
    _id: "3",
    name: "Renewables",
    shortDescription: "Grid-Scale Solar & Storage",
    fullDescription:
      "Utility-scale PV and battery storage systems stabilizing the Western Interconnection with 25-year contracted cash flows.",
    icon: "Sun",
    stats: [
      { value: "1+ GW", label: "Pipeline" },
      { value: "25-Year", label: "PPAs" },
    ],
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

const HERO_STATEMENTS = [
  "Powering the Energy Transition",
  "Building Critical Infrastructure",
  "Deploying Capital with Purpose",
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
// SHARED ANIMATION VARIANTS
// ============================================================================

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 sm:mb-8">
      <div className="w-8 h-px bg-accent-400" />
      <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-accent-500">
        {children}
      </span>
    </div>
  );
}

// ============================================================================
// ICON MAP
// ============================================================================

function SectorIcon({ name, className }: { name?: string; className?: string }) {
  const cn = className || "w-6 h-6";
  switch (name) {
    case "Zap": return <Zap className={cn} />;
    case "Server": return <Server className={cn} />;
    case "Sun": return <Sun className={cn} />;
    default: return <TrendingUp className={cn} />;
  }
}

// ============================================================================
// NAVBAR
// ============================================================================

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded bg-primary flex items-center justify-center">
                <span className="text-white text-[11px] sm:text-xs font-bold tracking-tight">M2</span>
              </div>
              <div className="hidden xs:block leading-none">
                <span className={`text-sm sm:text-[15px] font-semibold tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-primary" : "text-primary"
                }`}>
                  M2PV Capital
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 xl:px-4 py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-200 rounded-sm ${
                    scrolled
                      ? "text-gray-500 hover:text-primary hover:bg-gray-50"
                      : "text-primary/60 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                className={`ml-3 px-5 py-2 text-[13px] font-semibold tracking-[0.02em] transition-all duration-300 rounded-sm ${
                  scrolled
                    ? "bg-primary text-white hover:bg-primary-light"
                    : "bg-primary text-white hover:bg-primary-light"
                }`}
              >
                Investor Relations
              </a>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden p-1.5 -mr-1.5 rounded transition-colors ${
                scrolled ? "text-primary" : "text-primary"
              }`}
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[45] bg-white lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-14 sm:h-16 px-5 sm:px-8 border-b border-gray-100">
              <a href="#" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-white text-[11px] font-bold">M2</span>
                </div>
                <span className="text-sm font-semibold text-primary tracking-tight">M2PV Capital</span>
              </a>
              <button onClick={() => setOpen(false)} className="p-1.5 -mr-1.5 text-primary" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-8 sm:px-12">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  onClick={() => setOpen(false)}
                  className="py-3.5 text-[22px] sm:text-2xl font-light text-primary border-b border-gray-100 hover:text-accent-500 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + NAV_LINKS.length * 0.06 }}
                onClick={() => setOpen(false)}
                className="mt-8 w-full text-center py-3.5 bg-primary text-white text-sm font-semibold tracking-wide rounded-sm"
              >
                Investor Relations
              </motion.a>
            </nav>

            <div className="px-8 sm:px-12 py-5 border-t border-gray-100">
              <p className="text-xs text-gray-400">ir@m2pvcapital.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// HERO — Flowing aurora wave field animation (M2PV unique)
// ============================================================================

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // --- Wave layer definition ---
    interface WaveLayer {
      yCenter: number;     // base vertical position as fraction of h
      amplitude: number;   // wave height as fraction of h
      frequency: number;   // horizontal frequency
      speed: number;       // animation speed
      thickness: number;   // vertical spread of the filled shape as fraction of h
      color: string;       // base color (without alpha)
      alpha: number;       // max opacity
      phase: number;       // initial phase offset
    }

    // Each wave is a wide, gently curving translucent shape — like light bands
    const layers: WaveLayer[] = [
      // Primary — large sweeping golden aurora
      { yCenter: 0.30, amplitude: 0.12, frequency: 0.0015, speed: 0.18, thickness: 0.22, color: "201,169,110", alpha: 0.18, phase: 0 },
      // Secondary — offset, slightly faster
      { yCenter: 0.45, amplitude: 0.10, frequency: 0.002, speed: 0.24, thickness: 0.18, color: "218,195,140", alpha: 0.14, phase: 1.2 },
      // Tertiary — higher, thinner
      { yCenter: 0.25, amplitude: 0.08, frequency: 0.0025, speed: 0.15, thickness: 0.12, color: "190,160,100", alpha: 0.10, phase: 2.5 },
      // Deep accent — lower in the frame
      { yCenter: 0.58, amplitude: 0.09, frequency: 0.0018, speed: 0.20, thickness: 0.15, color: "201,169,110", alpha: 0.12, phase: 3.8 },
      // Subtle top wash
      { yCenter: 0.15, amplitude: 0.06, frequency: 0.003, speed: 0.12, thickness: 0.10, color: "218,195,140", alpha: 0.07, phase: 5.1 },
      // Low accent
      { yCenter: 0.68, amplitude: 0.07, frequency: 0.0022, speed: 0.28, thickness: 0.10, color: "180,145,80", alpha: 0.08, phase: 0.7 },
    ];

    function drawWaveLayer(layer: WaveLayer, time: number) {
      const t = time * 0.001;
      const steps = Math.ceil(w / 3); // sample every 3px for smooth curves
      const yBase = layer.yCenter * h;
      const amp = layer.amplitude * h;
      const thick = layer.thickness * h;

      // Compute the wave spine — two harmonics blended for organic movement
      const spineY: number[] = [];
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const wave1 = Math.sin(x * layer.frequency + t * layer.speed + layer.phase);
        const wave2 = Math.sin(x * layer.frequency * 1.7 + t * layer.speed * 0.6 + layer.phase * 1.4) * 0.4;
        const wave3 = Math.sin(x * layer.frequency * 0.5 + t * layer.speed * 0.3 + layer.phase * 0.6) * 0.3;
        spineY.push(yBase + (wave1 + wave2 + wave3) * amp);
      }

      // Create a filled shape: top edge = spine - thickness/2, bottom edge = spine + thickness/2
      // with a vertical gradient that fades to transparent at edges
      ctx!.save();

      // Use a vertical gradient for the layer so it fades softly at top and bottom
      const gradCenterY = yBase;
      const gradExtent = thick * 1.2 + amp;
      const grad = ctx!.createLinearGradient(0, gradCenterY - gradExtent, 0, gradCenterY + gradExtent);
      grad.addColorStop(0, `rgba(${layer.color},0)`);
      grad.addColorStop(0.25, `rgba(${layer.color},${layer.alpha * 0.5})`);
      grad.addColorStop(0.5, `rgba(${layer.color},${layer.alpha})`);
      grad.addColorStop(0.75, `rgba(${layer.color},${layer.alpha * 0.5})`);
      grad.addColorStop(1, `rgba(${layer.color},0)`);

      // Top edge of shape
      ctx!.beginPath();
      ctx!.moveTo(0, spineY[0] - thick * 0.5);
      for (let i = 1; i <= steps; i++) {
        const x = (i / steps) * w;
        // Add micro-undulation for thickness breathing
        const breathe = 1 + Math.sin(t * 0.4 + (i / steps) * Math.PI * 2 + layer.phase) * 0.15;
        ctx!.lineTo(x, spineY[i] - thick * 0.5 * breathe);
      }
      // Bottom edge (reverse)
      for (let i = steps; i >= 0; i--) {
        const x = (i / steps) * w;
        const breathe = 1 + Math.sin(t * 0.4 + (i / steps) * Math.PI * 2 + layer.phase + 1) * 0.15;
        ctx!.lineTo(x, spineY[i] + thick * 0.5 * breathe);
      }
      ctx!.closePath();
      ctx!.fillStyle = grad;
      ctx!.fill();

      // Optional: subtle highlight line along the spine (gives definition)
      ctx!.beginPath();
      ctx!.moveTo(0, spineY[0]);
      for (let i = 1; i <= steps; i++) {
        const x = (i / steps) * w;
        ctx!.lineTo(x, spineY[i]);
      }
      ctx!.strokeStyle = `rgba(${layer.color},${layer.alpha * 0.7})`;
      ctx!.lineWidth = 0.7;
      ctx!.stroke();

      ctx!.restore();
    }

    // --- Floating luminous particles ---
    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      alpha: number;
      phase: number;
    }

    const particles: Particle[] = [];

    function initParticles() {
      particles.length = 0;
      const count = Math.floor(Math.min(w * h / 25000, 40)); // responsive count
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.85,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1,
          size: 1 + Math.random() * 2,
          alpha: 0.08 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawParticles(time: number) {
      const t = time * 0.001;
      for (const p of particles) {
        // Gentle drift
        p.x += p.vx + Math.sin(t * 0.3 + p.phase) * 0.1;
        p.y += p.vy + Math.cos(t * 0.2 + p.phase * 1.3) * 0.08;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse = p.alpha * (0.6 + 0.4 * Math.sin(t * 0.8 + p.phase));

        // Glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,169,110,${pulse * 0.25})`;
        ctx!.fill();

        // Core dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,169,110,${pulse})`;
        ctx!.fill();
      }
    }

    // --- Main draw loop ---
    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);

      // Clean white background
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(0, 0, w, h);

      // Draw wave layers back to front (low alpha first)
      for (const layer of layers) {
        drawWaveLayer(layer, time);
      }

      // Floating particles on top
      drawParticles(time);

      // Soft vignette at edges to blend with page
      const vignetteB = ctx!.createLinearGradient(0, h * 0.75, 0, h);
      vignetteB.addColorStop(0, "rgba(255,255,255,0)");
      vignetteB.addColorStop(1, "rgba(255,255,255,0.6)");
      ctx!.fillStyle = vignetteB;
      ctx!.fillRect(0, h * 0.75, w, h * 0.25);

      animId = requestAnimationFrame(draw);
    }

    const handleResize = () => { resize(); initParticles(); };

    resize();
    initParticles();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

function HeroSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  const headlines = [
    settings.heroHeadline || D.heroHeadline!,
    "Building Critical Infrastructure",
    "Deploying Capital with Purpose",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % headlines.length), 4000);
    return () => clearInterval(t);
  }, [headlines.length]);

  const sub = settings.heroSubheadline || D.heroSubheadline!;

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[520px] flex items-end overflow-hidden">
      {/* Animated Canvas Background */}
      <div className="absolute inset-0">
        <HeroCanvas />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <motion.div style={{ opacity, y }} className="relative z-10 w-full pb-20 sm:pb-28 lg:pb-32">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-px bg-primary" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-primary/60">
                Private Equity · Energy Infrastructure
              </span>
            </motion.div>

            {/* Rotating headline */}
            <div className="relative mb-5 sm:mb-6" style={{ minHeight: 'clamp(2.75rem, 7vw, 6rem)' }}>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-[clamp(2rem,5vw,4.5rem)] font-serif font-normal text-primary leading-[1.15] tracking-[-0.02em]"
                >
                  {headlines[idx]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-base sm:text-lg text-primary/70 max-w-lg leading-relaxed"
            >
              {sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-7 sm:mt-8 flex flex-col xs:flex-row gap-3"
            >
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-light text-white text-sm font-semibold tracking-wide transition-colors rounded-sm"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-primary/20 text-primary hover:bg-primary/5 text-sm font-medium tracking-wide transition-all rounded-sm"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-10"
      >
        <div className="w-5 h-8 border border-primary/20 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// ABOUT — Bain/Altamont style overview
// ============================================================================

function AboutSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left — Statement */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="lg:col-span-5"
          >
            <SectionLabel>About M2PV Capital</SectionLabel>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-serif text-primary leading-[1.25] tracking-[-0.01em]">
              A leading energy infrastructure investment firm focused on the American Southwest.
            </h2>
          </motion.div>

          {/* Right — Description */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={1}
            variants={fadeUp}
            className="lg:col-span-7 lg:pt-4"
          >
            <p className="text-[15px] sm:text-base text-gray-600 leading-[1.75]">
              M2PV Capital deploys growth equity and project capital across sustainable mobility,
              solar generation, battery storage, and green data infrastructure. We target the
              convergence of renewable energy and digital demand, building vertically integrated
              platforms that capture value at every stage of the electron&apos;s journey.
            </p>
            <div className="mt-5 h-px w-full bg-gray-100" />
            <div className="mt-5 grid grid-cols-2 gap-6 sm:gap-8">
              {[
                { val: settings.stat1Value || D.stat1Value!, lbl: settings.stat1Label || D.stat1Label! },
                { val: settings.stat3Value || D.stat3Value!, lbl: settings.stat3Label || D.stat3Label! },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl sm:text-3xl font-serif text-primary tracking-tight">{s.val}</p>
                  <p className="mt-1 text-[11px] sm:text-xs text-gray-400 tracking-[0.12em] uppercase font-medium">{s.lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS BANNER — KKR-style AUM row
// ============================================================================

function StatsBanner({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const stats = [
    { val: settings.stat1Value || D.stat1Value!, lbl: settings.stat1Label || D.stat1Label! },
    { val: settings.stat2Value || D.stat2Value!, lbl: settings.stat2Label || D.stat2Label! },
    { val: settings.stat3Value || D.stat3Value!, lbl: settings.stat3Label || D.stat3Label! },
    { val: settings.stat4Value || D.stat4Value!, lbl: settings.stat4Label || D.stat4Label! },
  ];

  return (
    <section ref={ref} className="py-8 sm:py-10 lg:py-12 bg-primary">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 sm:gap-x-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""}`}
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-tight leading-none">
                {s.val}
              </p>
              <p className="mt-1.5 text-[10px] sm:text-[11px] text-white/45 uppercase tracking-[0.15em] font-medium">
                {s.lbl}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-white/20 text-[10px]">{settings.statsSource || D.statsSource}</p>
      </div>
    </section>
  );
}

// ============================================================================
// THESIS SECTION
// ============================================================================

function ThesisSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="thesis" ref={ref} className="py-16 sm:py-20 lg:py-28 bg-[#f0f2f8]">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}>
          <SectionLabel>Investment Thesis</SectionLabel>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.5}
            variants={fadeUp}
          >
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-serif text-primary leading-[1.25] tracking-[-0.01em]">
              {settings.thesisTitle || D.thesisTitle}
            </h2>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={1}
            variants={fadeUp}
          >
            <p className="text-[15px] sm:text-base text-gray-500 leading-[1.8]">
              {settings.thesisDescription || D.thesisDescription}
            </p>
          </motion.div>
        </div>

        {/* Ecosystem steps */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1.5}
          variants={fadeUp}
          className="mt-8 sm:mt-10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { num: "01", title: "Generation", desc: "Utility-scale solar PV", icon: <Sun className="w-5 h-5" /> },
              { num: "02", title: "Storage", desc: "Grid-scale BESS", icon: <Battery className="w-5 h-5" /> },
              { num: "03", title: "Mobility", desc: "EV charging networks", icon: <Zap className="w-5 h-5" /> },
              { num: "04", title: "Compute", desc: "AI data centers", icon: <Server className="w-5 h-5" /> },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="group bg-white border border-gray-100 hover:border-accent-200 p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-md rounded-sm"
              >
                <div className="w-9 h-9 rounded bg-surface flex items-center justify-center text-accent-500 mb-4 group-hover:bg-accent-50 transition-colors">
                  {step.icon}
                </div>
                <span className="text-[10px] text-accent-500 font-semibold tracking-[0.15em] uppercase">{step.num}</span>
                <h4 className="mt-2 text-lg sm:text-xl font-serif text-primary">{step.title}</h4>
                <p className="mt-1.5 text-[13px] text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Flow arrows — desktop only */}
          <div className="hidden lg:flex items-center justify-center gap-1 mt-5 px-[12%]">
            {[0, 1, 2].map((i) => (
              <React.Fragment key={i}>
                <div className="flex-1 h-px bg-gray-200" />
                <ArrowRight className="w-3.5 h-3.5 text-accent-400 shrink-0 mx-1" />
              </React.Fragment>
            ))}
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTORS — Altamont/KKR card style
// ============================================================================

function SectorsSection({ sectors }: { sectors: Sector[] }) {
  const [selected, setSelected] = useState<(Sector & { image: string }) | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const list = sectors.length > 0 ? sectors : DEFAULT_SECTORS;

  return (
    <>
      <section id="sectors" ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}>
            <SectionLabel>Focus Areas</SectionLabel>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-primary leading-[1.2] tracking-[-0.01em] max-w-xl">
              Investing across the energy value chain
            </h2>
          </motion.div>

          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {list.map((sector, i) => (
              <motion.div
                key={sector._id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="group cursor-pointer rounded-sm overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500"
                onClick={() => setSelected({ ...sector, image: SECTOR_IMAGES[i % SECTOR_IMAGES.length] })}
              >
                <div className="aspect-[16/10] overflow-hidden bg-surface">
                  <img
                    src={SECTOR_IMAGES[i % SECTOR_IMAGES.length]}
                    alt={sector.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-accent-500">
                      <SectorIcon name={sector.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-accent-500 tracking-[0.15em] uppercase">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-primary group-hover:text-accent-600 transition-colors">
                    {sector.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{sector.shortDescription}</p>
                  {sector.stats && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex gap-6">
                      {sector.stats.map((s, j) => (
                        <div key={j}>
                          <span className="text-sm font-semibold text-primary">{s.value}</span>
                          <span className="text-[11px] text-gray-400 ml-1.5">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sector Modal */}
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
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video overflow-hidden">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                {selected.stats && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {selected.stats.map((s, i) => (
                      <span key={i} className="text-sm font-semibold text-primary">
                        {s.value} <span className="text-gray-400 font-normal">{s.label}</span>
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-primary">{selected.name}</h3>
                <p className="mt-2 text-accent-500 text-sm font-medium">{selected.shortDescription}</p>
                <p className="mt-6 text-gray-500 leading-relaxed">{selected.fullDescription}</p>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-8 text-xs text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.1em] font-medium"
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
// PARALLAX VIDEO DIVIDER — rotating text
// ============================================================================

function VideoDivider({ settings }: { settings: SiteSettings }) {
  const [ci, setCi] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = settings.rotatingWords || D.rotatingWords!;

  useEffect(() => {
    const t = setInterval(() => setCi((p) => (p + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <section ref={ref} className="relative py-14 sm:py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 hidden sm:block"
          poster="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80"
          src="https://videos.pexels.com/video-files/5561459/5561459-hd_1920_1080_25fps.mp4"
        />
        <div
          className="sm:hidden absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-primary/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-serif text-white leading-[1.25] max-w-3xl">
            The energy transition is transforming{" "}
            <span className="relative inline-block text-accent-300 min-w-[160px] sm:min-w-[220px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ci}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block"
                >
                  {words[ci]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-lg leading-relaxed">
            We&apos;re building the infrastructure that closes the gap — connecting clean power to the places that need it most.
          </p>
        </motion.div>
      </div>
    </section>
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
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-[#f0f2f8]">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp} className="lg:col-span-7">
            <SectionLabel>{settings.opportunityZoneSubtitle || D.opportunityZoneSubtitle!}</SectionLabel>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-primary leading-[1.2]">
              {settings.opportunityZoneTitle || D.opportunityZoneTitle}
            </h2>
            <p className="mt-6 text-[15px] sm:text-base text-gray-500 leading-[1.75]">
              {settings.opportunityZoneDescription || D.opportunityZoneDescription}
            </p>
            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                  <span className="text-sm sm:text-[15px] text-gray-600">{b}</span>
                </li>
              ))}
            </ul>
            <a
              href={settings.opportunityZoneLearnMoreUrl || D.opportunityZoneLearnMoreUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-accent-500 hover:text-accent-700 text-sm font-semibold transition-colors group"
            >
              {settings.opportunityZoneLearnMoreText || D.opportunityZoneLearnMoreText}
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={1}
            variants={fadeUp}
            className="lg:col-span-5 flex justify-start lg:justify-center"
          >
            <div className="border-l-2 border-accent-400 pl-8 sm:pl-10">
              <p className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-primary tracking-tight leading-none">
                {settings.opportunityZoneStatValue || D.opportunityZoneStatValue}
              </p>
              <p className="mt-3 text-xs sm:text-sm text-gray-400 tracking-wide uppercase max-w-[240px]">
                {settings.opportunityZoneStatLabel || D.opportunityZoneStatLabel}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM — Altamont grid style
// ============================================================================

function TeamSection({ team }: { team: TeamMember[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const list = team.length > 0 ? team : DEFAULT_TEAM;

  return (
    <>
      <section id="team" ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}>
            <SectionLabel>Leadership</SectionLabel>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-primary leading-[1.2] max-w-xl">
              Our Team
            </h2>
            <p className="mt-3 text-[15px] sm:text-base text-gray-500 max-w-md">
              Experienced professionals with deep domain expertise across energy infrastructure and private equity.
            </p>
          </motion.div>

          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-5 sm:gap-y-6 lg:gap-y-8">
            {list.map((m, i) => {
              const img = m.image
                ? urlFor(m.image)?.width(400).height(500).url()
                : `https://api.dicebear.com/7.x/shapes/svg?seed=m2pv${i + 1}&backgroundColor=eef0f6&shape1Color=6b7194&shape2Color=4a5280&shape3Color=1a1f36`;
              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="group cursor-pointer"
                  onClick={() => setSelected(m)}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-sm bg-surface mb-4">
                    <img
                      src={img || ""}
                      alt={m.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-600 ease-out"
                    />
                  </div>
                  <h3 className="text-[15px] sm:text-base font-semibold text-primary leading-snug">{m.name}</h3>
                  <p className="text-xs sm:text-[13px] text-gray-400 mt-0.5">{m.title}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

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

// ============================================================================
// MISSION GRAPHIC — Animated energy arc graphic with firm statement
// ============================================================================

function MissionGraphicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0;
    let ch = 0;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      canvas!.width = cw * dpr;
      canvas!.height = ch * dpr;
      canvas!.style.width = cw + "px";
      canvas!.style.height = ch + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, cw, ch);

      const cx = cw / 2;
      const cy = ch / 2;
      const size = Math.min(cw, ch) * 0.42;
      const t = time * 0.001;

      // Radiating golden arcs — represents energy flowing outward
      const arcCount = 5;
      for (let a = 0; a < arcCount; a++) {
        const baseAngle = (a / arcCount) * Math.PI * 2 + t * 0.15;
        const sweep = Math.PI * 0.4 + Math.sin(t * 0.3 + a) * 0.15;
        const radius = size * (0.45 + a * 0.12);
        const alpha = 0.25 - a * 0.035 + Math.sin(t * 0.5 + a * 0.7) * 0.06;

        ctx!.beginPath();
        ctx!.arc(cx, cy, radius, baseAngle, baseAngle + sweep);
        ctx!.strokeStyle = `rgba(201,169,110,${Math.max(0.04, alpha)})`;
        ctx!.lineWidth = 2.5 - a * 0.3;
        ctx!.lineCap = "round";
        ctx!.stroke();
      }

      // Inner concentric rings — subtle, pulsing
      for (let r = 0; r < 3; r++) {
        const radius = size * (0.15 + r * 0.1);
        const pulse = 1 + Math.sin(t * 0.6 + r * 1.2) * 0.08;
        ctx!.beginPath();
        ctx!.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(255,255,255,${0.08 + r * 0.02})`;
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      }

      // Orbiting dots — small particles tracing paths
      const dotCount = 8;
      for (let d = 0; d < dotCount; d++) {
        const orbitR = size * (0.25 + (d % 4) * 0.15);
        const speed = 0.2 + d * 0.06;
        const angle = t * speed + (d / dotCount) * Math.PI * 2;
        const x = cx + Math.cos(angle) * orbitR;
        const y = cy + Math.sin(angle) * orbitR * 0.85;
        const dotSize = 1.5 + Math.sin(t + d) * 0.5;
        const alpha = 0.4 + Math.sin(t * 0.8 + d * 0.9) * 0.2;

        // Dot glow
        ctx!.beginPath();
        ctx!.arc(x, y, dotSize * 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,169,110,${alpha * 0.12})`;
        ctx!.fill();

        // Dot core
        ctx!.beginPath();
        ctx!.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,169,110,${alpha})`;
        ctx!.fill();
      }

      // Central glow
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, size * 0.3);
      glow.addColorStop(0, "rgba(201,169,110,0.08)");
      glow.addColorStop(1, "transparent");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, cw, ch);

      // Flowing sine-wave lines — horizontal energy streams
      for (let l = 0; l < 3; l++) {
        const yBase = cy + (l - 1) * size * 0.35;
        const amp = 15 + l * 8;
        const freq = 0.008 + l * 0.002;
        const lineAlpha = 0.1 + Math.sin(t * 0.4 + l) * 0.04;

        ctx!.beginPath();
        for (let x = cx - size * 0.8; x <= cx + size * 0.8; x += 2) {
          const dx = (x - cx) / (size * 0.8);
          const fade = 1 - dx * dx; // fade at edges
          const y = yBase + Math.sin(x * freq + t * (0.8 + l * 0.3)) * amp * fade;
          if (x === cx - size * 0.8) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(201,169,110,${Math.max(0.02, lineAlpha)})`;
        ctx!.lineWidth = 1;
        ctx!.lineCap = "round";
        ctx!.stroke();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-16 sm:py-24 lg:py-32 bg-primary overflow-hidden">
      <div className="relative z-10 mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          {/* Animated graphic — stacks below text on mobile, left on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none lg:w-[45%] aspect-square shrink-0"
          >
            <MissionGraphicCanvas />
          </motion.div>

          {/* Statement — always takes remaining space */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.3}
            variants={fadeUp}
            className="flex-1 text-center lg:text-left"
          >
            <h2 className="text-[clamp(1.4rem,3vw,2.5rem)] font-serif text-white leading-[1.35] tracking-[-0.01em]">
              M2PV Capital is a leading energy infrastructure investment firm. We aim to deliver strong returns and lasting impact across the communities we serve.
            </h2>
            <motion.a
              href="#about"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.8}
              variants={fadeUp}
              className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-accent-300 hover:text-white text-sm font-semibold uppercase tracking-[0.15em] transition-colors group border-b border-accent-400/30 pb-1 hover:border-white/50"
            >
              Learn About M2PV
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// INSIGHTS — Bain/KKR news grid
// ============================================================================

function InsightsSection({ insights }: { insights: Insight[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<Insight | null>(null);
  const list = insights.length > 0 ? insights : DEFAULT_INSIGHTS;

  const renderBody = (body: any[]) => {
    if (!body) return null;
    return body.map((block, index) => {
      if (block._type === "block") {
        const text = block.children?.map((c: any) => c.text).join("") || "";
        switch (block.style) {
          case "h2": return <h2 key={index} className="text-xl font-serif text-primary mt-8 mb-3">{text}</h2>;
          case "h3": return <h3 key={index} className="text-lg font-serif text-primary mt-6 mb-2">{text}</h3>;
          case "blockquote": return <blockquote key={index} className="border-l-2 border-accent-400 pl-5 italic text-gray-400 my-5">{text}</blockquote>;
          default: return <p key={index} className="text-gray-500 leading-relaxed mb-4 text-[15px]">{text}</p>;
        }
      }
      if (block._type === "image") {
        const imgUrl = urlFor(block)?.width(800).url();
        return imgUrl ? (
          <div key={index} className="my-6"><img src={imgUrl} alt={block.alt || ""} className="w-full rounded-sm" /></div>
        ) : null;
      }
      return null;
    });
  };

  return (
    <>
      <section id="insights" ref={ref} className="py-16 sm:py-20 lg:py-28 bg-[#f0f2f8]">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}>
            <SectionLabel>Perspectives</SectionLabel>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-primary leading-[1.2]">
              Latest Insights
            </h2>
          </motion.div>

          <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {list.map((item, i) => {
              const img = item.coverImage
                ? urlFor(item.coverImage)?.width(600).height(400).url()
                : INSIGHT_IMAGES[i % INSIGHT_IMAGES.length];
              return (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="group cursor-pointer bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-500"
                  onClick={() => setSelected(item)}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={img || ""}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-semibold text-accent-500 tracking-[0.15em] uppercase">{item.category}</span>
                      <span className="text-[11px] text-gray-300">{item.date}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-serif text-primary group-hover:text-accent-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-2 text-[13px] text-gray-400 line-clamp-2">{item.excerpt}</p>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Insight Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={urlFor(selected.coverImage)?.width(1200).height(675).url() || ""}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-[10px] font-semibold text-accent-500 tracking-[0.15em] uppercase">{selected.category}</span>
                  <span className="text-[11px] text-gray-300">{selected.date}</span>
                  {selected.readTime && <span className="text-[11px] text-gray-300">{selected.readTime}</span>}
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-primary leading-snug">{selected.title}</h2>
                {selected.excerpt && (
                  <p className="mt-4 text-gray-400 text-[15px] leading-relaxed">{selected.excerpt}</p>
                )}
                {selected.body && <div className="mt-8">{renderBody(selected.body)}</div>}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.1em] font-medium"
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
// CONTACT — KKR-inspired CTA
// ============================================================================

function ContactSection({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const email = settings.contactEmail || D.contactEmail!;

  return (
    <section id="contact" ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp} className="max-w-2xl">
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-serif text-primary leading-[1.2] tracking-[-0.01em]">
            Let&apos;s build the future of energy together.
          </h2>
          <p className="mt-5 text-[15px] sm:text-base text-gray-500 leading-relaxed max-w-md">
            We welcome inquiries from institutional investors, family offices, and strategic partners
            interested in the energy transition.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col xs:flex-row gap-3">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-light text-sm font-semibold tracking-wide transition-colors rounded-sm"
            >
              Contact Investor Relations <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">{email}</p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER — professional, dark
// ============================================================================

function Footer({ settings }: { settings: SiteSettings }) {
  const email = settings.contactEmail || D.contactEmail!;

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-12 lg:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">M2</span>
              </div>
              <span className="text-[15px] font-semibold text-white tracking-tight">M2PV Capital</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Energy infrastructure private equity focused on the American Southwest.
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Sectors */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-4">Sectors</h4>
            <ul className="space-y-2.5">
              {["Mobility", "Digital Infrastructure", "Renewables"].map((s) => (
                <li key={s}>
                  <a href="#sectors" className="text-sm text-white/50 hover:text-white transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-4">Contact</h4>
            <a href={`mailto:${email}`} className="text-sm text-white/50 hover:text-white transition-colors block mb-2">
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] sm:text-xs text-white/25 max-w-xl leading-relaxed">
            {settings.footerDisclaimer || D.footerDisclaimer}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[11px] text-white/30 hover:text-white/50 transition-colors uppercase tracking-wide">Privacy</a>
            <a href="#" className="text-[11px] text-white/30 hover:text-white/50 transition-colors uppercase tracking-wide">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN CLIENT COMPONENT
// ============================================================================

export default function PageClient({ settings, team, sectors, insights }: PageClientProps) {
  const s = settings || D;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <HeroSection settings={s} />
      <AboutSection settings={s} />
      <MissionSection />
      <StatsBanner settings={s} />
      <ThesisSection settings={s} />
      <SectorsSection sectors={sectors} />
      <VideoDivider settings={s} />
      <OpportunityZone settings={s} />
      <TeamSection team={team} />
      <InsightsSection insights={insights} />
      <ContactSection settings={s} />
      <Footer settings={s} />
    </div>
  );
}
