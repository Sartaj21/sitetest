"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Crosshair, Shield } from "lucide-react";
import {
  SiteSettings, Sector,
  D, DEFAULT_SECTORS, SECTOR_IMAGES,
  fadeUp, staggerContainer, staggerItem,
  Navbar, Footer, SectionLabel, SectorIcon, urlFor,
  TextReveal, CountUp, ParallaxImage, RevealSection, MagneticButton, LineReveal,
} from "./components";

// ============================================================================
// PROPS
// ============================================================================

interface PageClientProps {
  settings: SiteSettings | null;
  sectors: Sector[];
}

const HERO_STATEMENTS = [
  "Powering AI With Clean Energy",
  "Solar PV & Nuclear SMR for Rural America",
];

// ============================================================================
// HERO CANVAS — Flowing aurora wave field animation (optimized)
// ============================================================================

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;
    let isVisible = true;
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

    const layers = [
      { yCenter: 0.30, amplitude: 0.12, frequency: 0.0015, speed: 0.18, thickness: 0.22, r: 60, g: 60, b: 60, alpha: 0.16, phase: 0 },
      { yCenter: 0.45, amplitude: 0.10, frequency: 0.002, speed: 0.24, thickness: 0.18, r: 120, g: 120, b: 120, alpha: 0.12, phase: 1.2 },
      { yCenter: 0.25, amplitude: 0.08, frequency: 0.0025, speed: 0.15, thickness: 0.12, r: 30, g: 30, b: 30, alpha: 0.10, phase: 2.5 },
      { yCenter: 0.58, amplitude: 0.09, frequency: 0.0018, speed: 0.20, thickness: 0.15, r: 80, g: 80, b: 80, alpha: 0.12, phase: 3.8 },
    ];

    // Reusable spine array — avoids per-frame allocation
    let spineY: Float32Array;

    function drawWaveLayer(layer: typeof layers[0], t: number) {
      const steps = Math.ceil(w / 6); // Coarser steps for perf
      const yBase = layer.yCenter * h;
      const amp = layer.amplitude * h;
      const thick = layer.thickness * h;

      if (!spineY || spineY.length < steps + 1) {
        spineY = new Float32Array(steps + 1);
      }

      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const v = x * layer.frequency + layer.phase;
        spineY[i] = yBase + (
          Math.sin(v + t * layer.speed) +
          Math.sin(v * 1.7 + t * layer.speed * 0.6) * 0.4 +
          Math.sin(v * 0.5 + t * layer.speed * 0.3) * 0.3
        ) * amp;
      }

      const gc = yBase;
      const ge = thick * 1.2 + amp;
      const grad = ctx!.createLinearGradient(0, gc - ge, 0, gc + ge);
      const c = `${layer.r},${layer.g},${layer.b}`;
      grad.addColorStop(0, `rgba(${c},0)`);
      grad.addColorStop(0.3, `rgba(${c},${layer.alpha * 0.5})`);
      grad.addColorStop(0.5, `rgba(${c},${layer.alpha})`);
      grad.addColorStop(0.7, `rgba(${c},${layer.alpha * 0.5})`);
      grad.addColorStop(1, `rgba(${c},0)`);

      ctx!.beginPath();
      ctx!.moveTo(0, spineY[0] - thick * 0.5);
      for (let i = 1; i <= steps; i++) {
        ctx!.lineTo((i / steps) * w, spineY[i] - thick * 0.5);
      }
      for (let i = steps; i >= 0; i--) {
        ctx!.lineTo((i / steps) * w, spineY[i] + thick * 0.5);
      }
      ctx!.closePath();
      ctx!.fillStyle = grad;
      ctx!.fill();
    }

    interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; phase: number; }
    const particles: Particle[] = [];

    function initParticles() {
      particles.length = 0;
      const count = Math.floor(Math.min(w * h / 40000, 25));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h * 0.85,
          vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.08,
          size: 1 + Math.random() * 1.5, alpha: 0.08 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawParticles(t: number) {
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse = p.alpha * (0.6 + 0.4 * Math.sin(t * 0.8 + p.phase));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(80,80,80,${pulse})`;
        ctx!.fill();
      }
    }

    function draw(time: number) {
      if (!isVisible) { animId = requestAnimationFrame(draw); return; }

      const t = time * 0.001;
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(0, 0, w, h);

      for (const layer of layers) drawWaveLayer(layer, t);
      drawParticles(t);

      // Bottom vignette
      const vg = ctx!.createLinearGradient(0, h * 0.8, 0, h);
      vg.addColorStop(0, "rgba(255,255,255,0)");
      vg.addColorStop(1, "rgba(255,255,255,0.6)");
      ctx!.fillStyle = vg;
      ctx!.fillRect(0, h * 0.8, w, h * 0.2);

      animId = requestAnimationFrame(draw);
    }

    // Pause animation when tab is hidden
    const onVisChange = () => { isVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisChange);

    const handleResize = () => { resize(); initParticles(); };
    resize();
    initParticles();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: "transform" }} />;
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  const [idx, setIdx] = useState(0);
  const headlines = HERO_STATEMENTS;
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % headlines.length), 4000);
    return () => clearInterval(t);
  }, [headlines.length]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <HeroCanvas />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16 pt-20"
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-3 mb-5"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-8 h-px bg-primary origin-left"
              />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-primary/60">
                AI Energy Infrastructure
              </span>
            </motion.div>

            <div className="relative mb-5 sm:mb-6" style={{ minHeight: 'clamp(2.75rem, 7vw, 6rem)' }}>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={idx}
                  initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-[clamp(2rem,5vw,4.5rem)] font-serif font-normal text-primary leading-[1.15] tracking-[-0.02em]"
                >
                  {headlines[idx]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-7 sm:mt-8 flex flex-col xs:flex-row gap-3"
            >
              <MagneticButton
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-light text-white text-sm font-semibold tracking-wide transition-colors rounded-sm"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
              <MagneticButton
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-primary/20 text-primary hover:bg-primary/5 text-sm font-medium tracking-wide transition-all rounded-sm"
              >
                Investor Relations
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
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
// MISSION STATEMENT — KKR-style firm positioning
// ============================================================================

function MissionGraphic({ inView }: { inView: boolean }) {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] hidden md:block">
      {/* Rotating outer ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-black/[0.08]"
        />
      </motion.div>

      {/* Middle pulsing ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-[15%]"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-black/[0.15]"
        >
          {/* Orbiting dot */}
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black/40"
          />
        </motion.div>
      </motion.div>

      {/* Inner glowing ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-[30%]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-black/[0.22]"
        >
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/60"
          />
        </motion.div>
      </motion.div>

      {/* Center glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-[42%] flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full rounded-full bg-black/20 blur-sm"
        />
      </motion.div>

      {/* Crosshair lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
        <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-black/[0.08] to-transparent" />
      </motion.div>

      {/* Corner markers */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
          className="absolute w-3 h-3"
          style={{
            top: i < 2 ? "18%" : undefined,
            bottom: i >= 2 ? "18%" : undefined,
            left: i % 2 === 0 ? "18%" : undefined,
            right: i % 2 === 1 ? "18%" : undefined,
          }}
        >
          <div className={`absolute w-full h-px bg-black/30 ${
            i % 2 === 0 ? "left-0" : "right-0"
          }`} />
          <div className={`absolute w-px h-full bg-black/30 ${
            i < 2 ? "top-0" : "bottom-0"
          }`} />
        </motion.div>
      ))}
    </div>
  );
}

function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div ref={ref} className="relative">
          {/* Animated geometric graphic */}
          <MissionGraphic inView={inView} />

          <div className="max-w-3xl relative z-10">
            {/* Decorative accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-16 h-px bg-black origin-left mb-8"
            />
            <TextReveal
              as="h2"
              className="text-[clamp(1.4rem,3vw,2.5rem)] font-serif text-primary leading-[1.35] tracking-[-0.01em]"
            >
              M2PV Capital deploys solar PV plants and nuclear SMRs — financing the energy that powers AI and delivering durable returns to the communities we build in.
            </TextReveal>
            <motion.a
              href="/about"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-neutral-600 hover:text-black text-sm font-semibold uppercase tracking-[0.15em] transition-colors group border-b border-black/30 pb-1 hover:border-black"
            >
              Learn About M2PV
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS BANNER
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
    <RevealSection className="py-10 sm:py-12 lg:py-16 bg-[#f5f5f5]">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 sm:gap-x-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${i > 0 ? "lg:border-l lg:border-gray-100 lg:pl-8" : ""}`}
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-serif text-primary tracking-tight leading-none">
                <CountUp value={s.val} />
              </p>
              <p className="mt-1.5 text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-[0.15em] font-medium">
                {s.lbl}
              </p>
            </motion.div>
          ))}
        </div>
        <LineReveal className="mt-6" />
        <p className="mt-4 text-gray-300 text-[10px]">{settings.statsSource || D.statsSource}</p>
      </div>
    </RevealSection>
  );
}

// ============================================================================
// INVESTMENT THESIS — Problem framing + why this is the opportunity
// ============================================================================

function InvestmentThesisSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { v: "30+ GW", l: "Hyperscaler PPAs signed in 2024" },
    { v: "2,600+ GW", l: "Stuck in U.S. interconnection queue" },
    { v: "8,764", l: "Eligible tracts in target states" },
    { v: "$1T+", l: "U.S. AI power capex through 2030" },
  ];

  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div ref={ref} className="relative mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-24 lg:py-28">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="flex items-center gap-3 mb-6"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-10 h-px bg-white origin-left"
          />
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] uppercase text-white">
            Investment Thesis
          </span>
        </motion.div>

        <TextReveal
          as="h2"
          className="text-[clamp(1.85rem,4.2vw,3.5rem)] font-serif text-white leading-[1.1] tracking-[-0.015em] max-w-4xl"
        >
          AI&apos;s power problem is a once-in-a-generation infrastructure opportunity.
        </TextReveal>

        {/* Stat-led grid */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mt-14 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="border-t border-white/[0.15] pt-5"
            >
              <p className="text-[clamp(2rem,4vw,3.25rem)] font-serif text-white tracking-tight leading-none">
                <CountUp value={s.v} />
              </p>
              <p className="mt-3 text-[11px] sm:text-xs text-white/55 uppercase tracking-[0.15em] font-medium leading-snug">
                {s.l}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-10 text-[10px] text-white/30 tracking-wide"
        >
          Sources: DOE, EIA, NREL, McKinsey Global Energy Perspective, U.S. Treasury.
        </motion.p>
      </div>
    </section>
  );
}

// ============================================================================
// OUR EDGE — Engineering-led investment differentiator
// ============================================================================

function EdgeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-primary overflow-hidden">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left — headline */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="lg:col-span-5"
          >
            <SectionLabel className="text-accent-300">Our Edge</SectionLabel>
            <TextReveal
              as="h2"
              className="text-[clamp(1.5rem,3vw,2.5rem)] font-serif text-white leading-[1.3] tracking-[-0.01em]"
            >
              We don&apos;t just invest in infrastructure. We engineer it.
            </TextReveal>
          </motion.div>

          {/* Right — two pillars */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-5"
          >
            <motion.div variants={staggerItem} className="group bg-white/[0.04] border border-white/[0.08] hover:border-accent-400/30 rounded-sm p-6 sm:p-7 transition-all duration-500 hover:bg-white/[0.07]">
              <div className="w-10 h-10 rounded bg-accent-400/10 flex items-center justify-center text-accent-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Crosshair className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-white mb-3">Co-Developed Investments</h3>
              <p className="text-[13px] sm:text-sm text-white/45 leading-[1.7]">As experienced system architects, we don&apos;t just fund projects — we co-develop them. From system design to commissioning, our hands-on involvement gives us direct control over quality, timeline, and execution risk.</p>
            </motion.div>
            <motion.div variants={staggerItem} className="group bg-white/[0.04] border border-white/[0.08] hover:border-accent-400/30 rounded-sm p-6 sm:p-7 transition-all duration-500 hover:bg-white/[0.07]">
              <div className="w-10 h-10 rounded bg-accent-400/10 flex items-center justify-center text-accent-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-white mb-3">Engineering-Grade Diligence</h3>
              <p className="text-[13px] sm:text-sm text-white/45 leading-[1.7]">Because our principals are both engineers and investment professionals, we evaluate every opportunity through a dual lens — technical feasibility and financial merit — so we know exactly what constitutes a quality investment.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// OVERVIEW CARDS — Teaser links to main pages
// ============================================================================

function SectorsPreview({ sectors }: { sectors: Sector[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const sectorList = sectors.length > 0 ? sectors : DEFAULT_SECTORS;

  // Circle-expand scroll reveal
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const rawRadius = useTransform(scrollYProgress, [0, 0.6, 1], [0, 80, 120]);
  const clipRadius = useSpring(rawRadius, { stiffness: 50, damping: 25, mass: 0.8 });
  const clipPath = useTransform(clipRadius, (v: number) => `circle(${v}% at 50% 50%)`);

  return (
    <section ref={sectionRef} className="relative bg-white">
    <motion.div style={{ clipPath }} className="py-16 sm:py-20 lg:py-28 bg-[#f5f5f5]">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">

        {/* Sectors Preview */}
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}>
          <SectionLabel>Focus Areas</SectionLabel>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <TextReveal
              as="h2"
              className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-serif text-primary leading-[1.2] tracking-[-0.01em] max-w-xl"
            >
              Deploying energy that powers AI
            </TextReveal>
            <a
              href="/sectors"
              className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-700 text-sm font-semibold transition-colors group shrink-0"
            >
              View All Sectors
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {sectorList.slice(0, 3).map((sector, i) => (
            <motion.a
              key={sector._id}
              href="/sectors"
              variants={staggerItem}
              className="group rounded-sm overflow-hidden border border-gray-200/60 bg-white hover:border-gray-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface">
                <ParallaxImage
                  src={sector.coverImage ? (urlFor(sector.coverImage)?.width(600).height(375).url() || SECTOR_IMAGES[i % SECTOR_IMAGES.length]) : SECTOR_IMAGES[i % SECTOR_IMAGES.length]}
                  alt={sector.name}
                  className="aspect-[16/10]"
                  speed={0.08}
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-accent-500 group-hover:bg-accent-50 group-hover:scale-110 transition-all duration-300">
                    <SectorIcon name={sector.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-accent-500 tracking-[0.15em] uppercase">0{i + 1}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-primary group-hover:text-accent-600 transition-colors duration-300">
                  {sector.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{sector.shortDescription}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.div>
    </section>
  );
}

// ============================================================================
// CONTACT CTA — Simple bottom CTA
// ============================================================================

function ContactCTA({ settings }: { settings: SiteSettings }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const email = settings.contactEmail || D.contactEmail!;

  return (
    <RevealSection className="py-16 sm:py-20 lg:py-28 bg-[#f5f5f5]">
      <div ref={ref} className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-2xl">
          <SectionLabel>Get In Touch</SectionLabel>
          <TextReveal
            as="h2"
            className="text-[clamp(1.75rem,4vw,3rem)] font-serif text-primary leading-[1.2] tracking-[-0.01em]"
          >
            Let&apos;s build the energy backbone of AI together.
          </TextReveal>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8 flex flex-col xs:flex-row gap-3"
          >
            <MagneticButton
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-light text-sm font-semibold tracking-wide transition-colors rounded-sm"
            >
              Investor Relations <ArrowRight className="w-3.5 h-3.5" />
            </MagneticButton>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 text-sm text-gray-400"
          >
            {email}
          </motion.p>
        </div>
      </div>
    </RevealSection>
  );
}

// ============================================================================
// MAIN CLIENT COMPONENT — Homepage Overview
// ============================================================================

export default function PageClient({ settings, sectors }: PageClientProps) {
  const s = settings || D;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <InvestmentThesisSection />
      <MissionSection />
      <StatsBanner settings={s} />
      <EdgeSection />
      <SectorsPreview sectors={sectors} />
      <ContactCTA settings={s} />
      <Footer settings={s} />
    </div>
  );
}
