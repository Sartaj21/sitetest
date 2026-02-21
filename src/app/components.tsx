"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Linkedin,
  Zap,
  Server,
  Sun,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import imageUrlBuilder from "@sanity/image-url";

// ============================================================================
// SANITY IMAGE URL
// ============================================================================

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "axtaz9gs";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export function urlFor(source: any) {
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

export const D: SiteSettings = {
  heroHeadline: "Powering the Energy Transition",
  heroSubheadline:
    "M2PV Capital invests in sustainable mobility and green data infrastructure across the American Southwest.",
  heroTagline: "Energy Infrastructure",
  thesisTitle:
    "The infrastructure gap is the investment opportunity of the decade",
  thesisDescription:
    "The Southwest Sunbelt offers peak solar irradiance, critical logistics corridors, and surging demand for clean power. Our integrated approach connects renewable generation directly to high-growth demand: EV charging networks and hyperscale data centers.",
  stat1Value: "$1T+",
  stat1Label: "U.S. Energy Infrastructure Gap",
  stat2Value: "300+",
  stat2Label: "Days of Sun in the Southwest",
  stat3Value: "1+ GW",
  stat3Label: "Solar Capacity Needed by 2030",
  stat4Value: "8,764",
  stat4Label: "Federally Designated OZ Tracts",
  statsSource: "Sources: ASCE Infrastructure Report, NREL Solar Resource Data, EIA, U.S. Treasury",
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
  contactEmail: "ceo@m2pvcapital.com",
  footerDisclaimer:
    "© 2026 M2PV Capital. This website does not constitute an offer to sell or a solicitation of an offer to buy any securities.",
};

export const NAV_LINKS = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Firm Overview", href: "/about" },
      { label: "Sectors", href: "/sectors" },
    ],
  },
  { label: "Insights", href: "/insights" },
];

export const DEFAULT_SECTORS: Sector[] = [
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
      "Utility-scale PV and battery storage systems stabilizing the Western Interconnection with contracted cash flows.",
    icon: "Sun",
    stats: [
      { value: "1+ GW", label: "Pipeline" },
      { value: "Contracted", label: "PPAs" },
    ],
  },
];

export const DEFAULT_TEAM: TeamMember[] = [
  { _id: "1", name: "Managing Partner", title: "Managing Partner", bio: "Over 20 years of experience in infrastructure investing and energy project development." },
  { _id: "2", name: "General Partner", title: "General Partner", bio: "Extensive background in renewable energy development and project finance." },
  { _id: "3", name: "Partner", title: "Partner", bio: "Specializes in data center infrastructure and technology investments." },
  { _id: "4", name: "Principal", title: "Principal", bio: "Expert in EV charging infrastructure and sustainable transportation." },
  { _id: "5", name: "Vice President", title: "Vice President", bio: "Deep expertise in utility-scale solar development and grid interconnection." },
  { _id: "6", name: "Vice President", title: "Vice President", bio: "Background in institutional asset management and alternative investments." },
  { _id: "7", name: "Associate", title: "Associate", bio: "Focus on deal execution and portfolio management." },
  { _id: "8", name: "Analyst", title: "Analyst", bio: "Specializes in financial modeling and due diligence." },
];

export const DEFAULT_INSIGHTS: Insight[] = [
  { _id: "1", title: "The Power-Hungry AI: Data Center Energy Demands", category: "INSIGHTS", date: "JAN 15, 2026", readTime: "5 MIN READ", excerpt: "How the explosion in AI compute is reshaping power requirements for hyperscale facilities." },
  { _id: "2", title: "Grid Constraints: The Hidden Bottleneck", category: "INSIGHTS", date: "DEC 28, 2025", readTime: "4 MIN READ", excerpt: "Why interconnection queues are creating unprecedented opportunities for shovel-ready solar projects." },
  { _id: "3", title: "Fleet Electrification: The Logistics Opportunity", category: "NEWS", date: "DEC 10, 2025", readTime: "3 MIN READ", excerpt: "Mapping the depot charging infrastructure needed for commercial fleet transitions along I-10." },
];

export const SECTOR_IMAGES = [
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
];

export const INSIGHT_IMAGES = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
];

// ============================================================================
// SHARED ANIMATION VARIANTS
// ============================================================================

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// Additional Blue Owl-inspired animation variants
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ============================================================================
// TEXT REVEAL — Blue Owl-style word-by-word reveal
// ============================================================================

export function TextReveal({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = children.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.04,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// ============================================================================
// COUNT UP — Animated number counter
// ============================================================================

export function CountUp({
  value,
  className = "",
  prefix = "",
  suffix = "",
}: {
  value: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  // Extract numeric part
  const numMatch = value.match(/([\d,.]+)/);
  const numStr = numMatch ? numMatch[1] : value;
  const numericVal = parseFloat(numStr.replace(/,/g, ""));
  const hasDecimal = numStr.includes(".");
  const textBefore = value.substring(0, value.indexOf(numStr));
  const textAfter = value.substring(value.indexOf(numStr) + numStr.length);

  useEffect(() => {
    if (!inView || isNaN(numericVal)) {
      setDisplay(value);
      return;
    }
    let start = 0;
    const duration = 1800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numericVal;
      if (hasDecimal) {
        setDisplay(current.toFixed(1));
      } else if (numericVal >= 1000) {
        setDisplay(Math.round(current).toLocaleString());
      } else {
        setDisplay(Math.round(current).toString());
      }
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, numericVal, value, hasDecimal]);

  if (isNaN(numericVal)) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {textBefore}{display}{textAfter}
    </span>
  );
}

// ============================================================================
// PARALLAX IMAGE — Smooth scroll-driven parallax
// ============================================================================

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.15,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, mass: 0.5 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y: smoothY }}
        className="w-full h-[120%] object-cover"
      />
    </div>
  );
}

// ============================================================================
// REVEAL SECTION — Section wrapper with smooth entrance
// ============================================================================

export function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ============================================================================
// MAGNETIC BUTTON — Subtle hover follow effect
// ============================================================================

export function MagneticButton({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPos({ x, y });
  }, []);

  const handleLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.a>
  );
}

// ============================================================================
// HORIZONTAL LINE REVEAL — Animated divider line
// ============================================================================

export function LineReveal({ className = "" }: { className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`h-px bg-gray-200 origin-left ${className}`}
    />
  );
}

// ============================================================================
// CUSTOM CURSOR — circle style smooth following cursor
// ============================================================================

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only show custom cursor on desktop with fine pointer
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    // Detect hover on interactive elements
    const onOverCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
      setIsHovering(!!interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousemove", onOverCapture, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // Smooth follow animation
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // Inner dot — fast follow
      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.35);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.35);
      // Outer ring — slower follow for trailing effect
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hide default cursor
    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = "a, button, [role='button'], input, textarea, select { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onOverCapture);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
      const s = document.getElementById("custom-cursor-style");
      if (s) s.remove();
    };
  }, [isVisible]);

  // Don't render on SSR or touch devices
  const [isFinePointer, setIsFinePointer] = useState(false);
  useEffect(() => {
    setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Inner dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: isHovering ? 10 : 6,
          height: isHovering ? 10 : 6,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.3s, height 0.3s, opacity 0.3s",
          willChange: "transform",
          mixBlendMode: "difference" as const,
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: isHovering ? 54 : isClicking ? 26 : 36,
          height: isHovering ? 54 : isClicking ? 26 : 36,
          borderRadius: "50%",
          border: `1.5px solid rgba(255, 255, 255, ${isHovering ? 0.9 : 0.5})`,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 0.06)" : "transparent",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.3s, background-color 0.3s, opacity 0.3s",
          willChange: "transform",
          mixBlendMode: "difference" as const,
        }}
      />
    </>
  );
}

// ============================================================================
// SECTION LABEL
// ============================================================================

export function SectionLabel({ children }: { children: string }) {
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

export function SectorIcon({ name, className }: { name?: string; className?: string }) {
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

// Pages with dark hero banners — navbar text should be light when not scrolled
const DARK_HERO_PAGES = ["/about", "/sectors", "/insights", "/contact"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const isDarkHero = DARK_HERO_PAGES.includes(pathname || "");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Text color logic: scrolled = always dark; not scrolled = dark on homepage, light on dark-hero pages
  const linkColor = scrolled
    ? "text-gray-500 hover:text-primary hover:bg-gray-50"
    : isDarkHero
      ? "text-white/70 hover:text-white hover:bg-white/10"
      : "text-primary/60 hover:text-primary hover:bg-primary/5";

  const logoTextColor = scrolled ? "text-primary" : isDarkHero ? "text-white" : "text-primary";
  const toggleColor = scrolled ? "text-primary" : isDarkHero ? "text-white" : "text-primary";

  const openDropdown = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdown(label);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDropdown(null), 150);
  };

  return (
    <>
      <CustomCursor />
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
            <a href="/" className="flex items-center gap-2.5 shrink-0">
              <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center ${
                scrolled ? "bg-primary" : isDarkHero ? "bg-white/15 border border-white/20" : "bg-primary"
              }`}>
                <span className="text-white text-[11px] sm:text-xs font-bold tracking-tight">M2</span>
              </div>
              <div className="hidden xs:block leading-none">
                <span className={`text-sm sm:text-[15px] font-semibold tracking-tight ${logoTextColor}`}>
                  M2PV Capital
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {NAV_LINKS.map((link) => {
                const hasChildren = "children" in link && link.children;
                const isActive = pathname === link.href || (hasChildren && link.children!.some(c => pathname === c.href));

                if (hasChildren) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => openDropdown(link.label)}
                      onMouseLeave={closeDropdown}
                    >
                      <button
                        className={`flex items-center gap-1 px-3.5 xl:px-4 py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-200 rounded-sm ${
                          isActive
                            ? scrolled ? "text-primary bg-gray-50" : isDarkHero ? "text-white bg-white/10" : "text-primary bg-primary/5"
                            : linkColor
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdown === link.label ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {dropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-1.5 w-52 py-2 bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden"
                            onMouseEnter={() => openDropdown(link.label)}
                            onMouseLeave={closeDropdown}
                          >
                            {link.children!.map((child) => (
                              <a
                                key={child.label}
                                href={child.href}
                                className={`block px-5 py-2.5 text-[13px] font-medium transition-colors ${
                                  pathname === child.href
                                    ? "text-accent-600 bg-accent-50"
                                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                                }`}
                              >
                                {child.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`px-3.5 xl:px-4 py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-200 rounded-sm ${
                      isActive
                        ? scrolled ? "text-primary bg-gray-50" : isDarkHero ? "text-white bg-white/10" : "text-primary bg-primary/5"
                        : linkColor
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href="/contact"
                className={`ml-3 px-5 py-2 text-[13px] font-semibold tracking-[0.02em] transition-all duration-300 rounded-sm ${
                  scrolled
                    ? "bg-primary text-white hover:bg-primary-light"
                    : isDarkHero
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary-light"
                }`}
              >
                Investor Relations
              </a>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden p-1.5 -mr-1.5 rounded transition-colors ${toggleColor}`}
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
              <a href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
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
              {NAV_LINKS.map((link, i) => {
                const hasChildren = "children" in link && link.children;
                if (hasChildren) {
                  return (
                    <div key={link.label}>
                      <motion.button
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.06 }}
                        onClick={() => setDropdown(dropdown === link.label ? null : link.label)}
                        className="w-full flex items-center justify-between py-3.5 text-[22px] sm:text-2xl font-light text-primary border-b border-gray-100"
                      >
                        {link.label}
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${dropdown === link.label ? "rotate-180" : ""}`} />
                      </motion.button>
                      <AnimatePresence>
                        {dropdown === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden pl-4 border-b border-gray-100"
                          >
                            {link.children!.map((child, ci) => (
                              <motion.a
                                key={child.label}
                                href={child.href}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: ci * 0.04 }}
                                onClick={() => setOpen(false)}
                                className="block py-2.5 text-base sm:text-lg text-gray-500 hover:text-accent-500 transition-colors"
                              >
                                {child.label}
                              </motion.a>
                            ))}
                            <div className="h-2" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
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
                );
              })}
              <motion.a
                href="/contact"
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
              <p className="text-xs text-gray-400">ceo@m2pvcapital.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

export function Footer({ settings }: { settings: SiteSettings }) {
  const email = settings.contactEmail || D.contactEmail!;

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-12 lg:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
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

          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              <li><a href="/about" className="text-sm text-white/50 hover:text-white transition-colors">About</a></li>
              <li><a href="/sectors" className="text-sm text-white/50 hover:text-white transition-colors">Sectors</a></li>

              <li><a href="/insights" className="text-sm text-white/50 hover:text-white transition-colors">Insights</a></li>
              <li><a href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-4">Sectors</h4>
            <ul className="space-y-2.5">
              {["Mobility", "Digital Infrastructure", "Renewables"].map((s) => (
                <li key={s}>
                  <a href="/sectors" className="text-sm text-white/50 hover:text-white transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-4">Contact</h4>
            <a href={`mailto:${email}`} className="text-sm text-white/50 hover:text-white transition-colors block mb-2">
              {email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] sm:text-xs text-white/25 max-w-xl leading-relaxed">
            {settings.footerDisclaimer || D.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// PAGE HERO — reusable hero banner for inner pages (not homepage)
// ============================================================================

export function PageHero({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative pt-28 sm:pt-32 lg:pt-40 pb-14 sm:pb-16 lg:pb-20 bg-primary overflow-hidden">
      {/* Ambient gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#252b45] opacity-100" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/[0.04] to-transparent" />

      <motion.div style={{ y: textY, opacity }} className="relative z-10 mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center gap-3 mb-5"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-8 h-px bg-accent-400 origin-left"
            />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-accent-300">
              {label}
            </span>
          </motion.div>

          <TextReveal
            as="h1"
            delay={0.3}
            className="text-[clamp(2rem,5vw,3.5rem)] font-serif text-white leading-[1.15] tracking-[-0.02em] max-w-3xl"
          >
            {title}
          </TextReveal>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-5 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
