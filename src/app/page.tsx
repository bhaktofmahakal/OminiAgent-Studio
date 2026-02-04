'use client'

import Link from "next/link";
import Image from "next/image";
import { Bot, Zap, Brain, Shield, Database, BarChart3, Workflow, ArrowRight, CheckCircle, Terminal, Cpu, Network, Lock, ZapOff, Activity, Command, Plus, Eye, Code, ChevronRight, Hash } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";
import { ThreeDScrollTriggerContainer, ThreeDScrollTriggerRow } from "@/components/ui/three-d-scroll-trigger";
import BeamGridBackground from "@/components/ui/beam-grid-background";
import SVGMaskEffectDemo from "@/components/svg-mask-effect-demo";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useRef, useState, useEffect } from "react";
import { RiPulseFill } from "react-icons/ri";

function SystemOverlays() {
  return (
    <>
      <div className="noise-overlay" />
      <div className="fixed inset-0 scanlines z-50 overflow-hidden select-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-primary z-[60] opacity-50 animate-pulse" />
    </>
  )
}

function Nav() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Logic_Gate", link: "#logic" },
    { name: "Neural_Optics", link: "#vault" },
    { name: "Repository", link: "/repository" },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="w-24 h-8 bg-white/5 animate-pulse" />
          ) : isSignedIn ? (
            <NavbarButton href="/dashboard" variant="primary">
              EXE_CONSOLE <ArrowRight className="w-3 h-3" />
            </NavbarButton>
          ) : (
            <>
              <SignInButton mode="modal">
                <NavbarButton variant="secondary">AUTH_LOGIN</NavbarButton>
              </SignInButton>
              <SignUpButton mode="modal">
                <NavbarButton variant="primary">INIT_RECON</NavbarButton>
              </SignUpButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-heading font-black italic uppercase tracking-tighter text-white/40 hover:text-primary transition-colors"
            >
              / {item.name}
            </Link>
          ))}
          <div className="w-full h-px bg-white/5 my-4" />
          <div className="flex w-full flex-col gap-4">
            {!isSignedIn && (
              <SignInButton mode="modal">
                <NavbarButton variant="secondary" className="w-full py-4">AUTH_LOGIN</NavbarButton>
              </SignInButton>
            )}
            <NavbarButton
              href={isSignedIn ? "/dashboard" : undefined}
              variant="primary"
              className="w-full py-4"
            >
              {isSignedIn ? "EXE_CONSOLE" : "INIT_INGRESS"}
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [activeLoads, setActiveLoads] = useState<number[]>([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);
    setActiveLoads([1, 2, 3, 4, 5, 6].map(() => Math.floor(Math.random() * 100)));
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <main ref={containerRef} className="bg-[#080808]">
      <SystemOverlays />
      <Nav />

      {/* HERO: BRUTAL TEXT FOCUS */}
      <section className="min-h-screen flex flex-col justify-center px-6 lg:px-20 pt-40 pb-20 relative overflow-hidden">
        {/* BACKGROUND WATERMARK */}
        <div className="absolute top-20 left-0 text-[15vw] font-black italic opacity-[0.02] select-none pointer-events-none tracking-tighter leading-none">
          ENGINE_CORE_v4.0
        </div>

        <div className="container mx-auto relative z-10 px-6 lg:px-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="w-full flex flex-col items-center"
          >
            <div className="module-tag mb-2 font-black scale-90 uppercase">PHASE_01: INGRESS</div>

            <h1 className="text-4xl lg:text-7xl leading-tight font-heading font-black text-white tracking-tightest mb-4 uppercase outline-text text-transparent hover:text-white transition-all duration-700">
              BUILD_<span className="acid-text italic">CHAOS</span><br />
              _DECODE_ORDER.
            </h1>

            <p className="text-xs lg:text-sm font-body font-bold leading-relaxed opacity-40 max-w-lg mb-6 uppercase tracking-[0.2em] border-y border-white/5 py-3">
              WE REJECT GENERIC AI ARCHITECTURE. OMNIAGENT IS AN EXPERIMENTAL OPERATING FLOOR FOR THOSE WHO ENGINEER AT THE EDGE OF THE LATENT SPACE.
            </p>

            <div className="flex flex-col items-center gap-4 w-full">
              <SignUpButton mode="modal">
                <button className="brutal-btn text-base h-16 px-12 bg-white text-black font-black hover:bg-primary transition-all flex items-center gap-4 group">
                  INIT_PROJECT <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </SignUpButton>

              <div className="grid grid-cols-3 gap-10 lg:gap-16 font-body text-[9px] opacity-20 italic uppercase tracking-[0.3em] border-t border-white/5 pt-4 w-full max-w-2xl">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-primary">{"// UPTIME"}</span>
                  <span>100%_STABLE</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-primary">{"// LATENCY"}</span>
                  <span>0.00ms_NOMINAL</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-primary">{"// ACCESS"}</span>
                  <span>MULTI_MODEL_SYNC</span>
                </div>
              </div>
            </div>

            {/* TECHNICAL DATA TICKER */}
            <div className="mt-10 w-full border-y border-white/5 py-2 overflow-hidden whitespace-nowrap select-none">
              <div className="inline-block animate-marquee font-mono text-[8px] font-black opacity-20 uppercase tracking-[0.4em]">
                NET_STATUS: SECURE • PKT_LOSS: 0.00% • ENCRYPTION: AES-256-GCM • SESSION: ACTIVE_X99 • CORE_TEMP: 42°C • LATENT_FLOPS: 12.4 • PROTO_VERSION: 2026.4.0 • NET_STATUS: SECURE • PKT_LOSS: 0.00% • ENCRYPTION: AES-256-GCM • SESSION: ACTIVE_X99 • CORE_TEMP: 42°C • LATENT_FLOPS: 12.4 • PROTO_VERSION: 2026.4.0
              </div>
            </div>
          </motion.div>
        </div>

        {/* DISTORTED BACKGROUND ELEMENT */}
        <div className="absolute top-1/2 right-[-10%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />
      </section>

      {/* EXPERIMENTAL GRID LOGIC */}
      <section id="logic" onMouseMove={handleMouseMove} className="pt-16 pb-8 bg-white text-black relative z-10 overflow-hidden border-t-8 border-black">
        {/* Dot Matrix Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle at 1.5px 1.5px, rgba(0, 0, 0, 0.4) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            WebkitMaskImage: `radial-gradient(circle 400px at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 100%)`,
          }}
        />

        <div className="absolute top-0 left-0 w-full h-16 bg-[#080808] transform -translate-y-1/2 rotate-1 hidden" />

        {/* BIG BG TEXT */}
        <div className="absolute top-20 right-10 text-[12vw] font-black italic opacity-[0.02] select-none pointer-events-none leading-none -z-10 text-black">
          LOGIC_GATE
        </div>

        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row justify-between items-baseline mb-12 border-b-4 border-black pb-6">
            <h2 className="text-4xl lg:text-5xl font-heading font-black tracking-tighter uppercase leading-none text-black italic">THE CORE</h2>
            <span className="font-body font-black text-[10px] italic text-black/40 tracking-[0.4em]">{"// UNIT_O2: CORE_ENGINE"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: '01', title: 'SYNAPTIC_ROUTING', desc: 'BREAK THE MONOLITH. MULTI-MODEL DYNAMIC INJECTION AT THE PROMPT LAYER.', stats: '99.9% ACCURACY', icon: <Network className="w-8 h-8" /> },
              { id: '02', title: 'RAW_METRICS', desc: 'NO FLUFF. SUB-MILLISECOND LATENCY TRACKING AND ATOMIC TOKEN COSTING.', stats: '42MS AVG RTT', icon: <Activity className="w-8 h-8" /> },
              { id: '03', title: 'HARDENED_VAULT', desc: 'ENTERPRISE-LEVEL NEURAL GUARDRAILS. SECURITY AS A FIRST-CLASS PROTOCOL.', stats: 'SOC2 COMPLIANT', icon: <Shield className="w-8 h-8" /> },
              { id: '04', title: 'ATOMIC_LOGIC', desc: 'DETERMINISTIC EXECUTION STRINGS FOR MISSION CRITICAL DEPLOYMENTS.', stats: '100% RELIABLE', icon: <Cpu className="w-8 h-8" /> }
            ].map((box, i) => (
              <div key={i} className="group flex flex-col border-2 border-black bg-white hover:bg-[#080808] transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0 min-h-[320px]">
                {/* Module Header Bar */}
                <div className="flex justify-between items-center px-6 py-3 border-b-2 border-black bg-black group-hover:bg-primary transition-colors">
                  <span className="font-heading font-black text-xs text-white group-hover:text-black italic tracking-widest uppercase">UNIT_{box.id}</span>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-black/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-black/20" />
                  </div>
                </div>

                {/* Module Body */}
                <div className="p-6 lg:p-8 flex-1 flex flex-col group-hover:text-white transition-colors overflow-hidden">
                  <div className="mb-6 text-black group-hover:text-primary transition-colors">
                    {box.icon}
                  </div>
                  <h3 className="text-lg lg:text-xl font-heading font-black mb-2 leading-tight tracking-tighter uppercase break-words">{box.title}</h3>
                  <p className="font-body font-black text-[9px] leading-relaxed opacity-40 group-hover:opacity-100 mb-4 uppercase italic break-words">{box.desc}</p>

                  <div className="mt-auto pt-4 border-t border-black/10 group-hover:border-white/10">
                    <div className="text-[10px] font-black tracking-[0.3em] opacity-30 group-hover:text-primary group-hover:opacity-100 mb-6 italic">{box.stats}</div>
                    <div className="flex items-center justify-between font-black text-[9px] tracking-widest cursor-pointer group-hover:text-white uppercase transition-all">
                      <span>ACCESS_SPEC_DOCS</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* SVG MASK EFFECT: TRUTH REVEAL */}
          <div className="mt-8 -mx-6 lg:-mx-20">
            <SVGMaskEffectDemo />
          </div>

          {/* SECTION: OPERATOR_FEEDBACK (TESTIMONIALS) */}
          <div className="w-full overflow-hidden border-t-8 border-black bg-white py-12 relative">
            <div className="flex flex-col items-center text-center space-y-1 mb-10 relative z-10">
              <div className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic text-black font-mono">{"// OPERATIONAL_CORE"}</div>
              <h2 className="text-3xl lg:text-5xl font-heading font-black italic tracking-tighter text-black uppercase">THE_CORE_ENGINE</h2>
              <div className="w-12 h-1 bg-primary mt-1" />
            </div>

            <ThreeDScrollTriggerContainer className="space-y-12">
              <ThreeDScrollTriggerRow baseVelocity={1} direction={1}>
                {[
                  "THE LATENCY MAPPING IS UNBELIEVABLE. FINALLY A DASHBOARD THAT FEELS LIKE A TERMINAL.",
                  "SUB-MILLISECOND TOKEN COSTING IS A GAME CHANGER FOR OUR UNITS.",
                  "BRUTALIST DESIGN MEETS ENTERPRISE PERFORMANCE. OMNI IS THE FUTURE.",
                  "MULTI-MODEL DYNAMIC INJECTION SOLVED MONTHS OF ARCHITECTURE DEBT."
                ].map((text, i) => (
                  <div key={i} className="mx-6 p-8 border-2 border-black bg-white text-black font-black uppercase italic text-lg lg:text-xl tracking-tighter whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {text} <span className="text-primary bg-black px-3 py-1 ml-8">/ {['VECTOR_X', 'LOGIC_01', 'CYBER_UNIT', 'DEV_NODE'][i]}</span>
                  </div>
                ))}
              </ThreeDScrollTriggerRow>

              <ThreeDScrollTriggerRow baseVelocity={1} direction={-1}>
                {[
                  "DETERMINISTIC EXECUTION STRINGS ARE 100% RELIABLE.",
                  "EXPERIMENTAL OPERATING FLOOR FOR THE EDGE OF LATENT SPACE.",
                  "WE REJECT GENERIC AI ARCHITECTURE. THIS IS ARCHITECTED FOR POWER.",
                  "SYSTEM_UPTIME: 100%_STABLE {"//"} NO COMPROMISE."
                ].map((text, i) => (
                  <div key={i} className="mx-6 p-8 border-2 border-black bg-[#0d0d0d] text-white font-black uppercase italic text-lg lg:text-xl tracking-tighter whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(204,255,0,1)]">
                    <span className="text-primary mr-8 font-mono">{"// STATUS: OK"}</span> {text}
                  </div>
                ))}
              </ThreeDScrollTriggerRow>
            </ThreeDScrollTriggerContainer>
          </div>

          {/* INFRASTRUCTURE SCHEMATIC OVERLAY */}
          <div className="mt-20 border-8 border-black bg-black relative overflow-hidden">
            {/* Perspective Grid Background */}
            <div
              className="absolute inset-0 z-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ccff00 1px, transparent 1px),
                  linear-gradient(to bottom, #ccff00 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                transform: "perspective(500px) rotateX(25deg) scale(1.5)",
                transformOrigin: "bottom",
              }}
            />

            <div className="p-12 lg:p-20 flex flex-col xl:flex-row justify-between items-center gap-16 relative z-10">
              <div className="flex flex-col gap-6 text-center xl:text-left">
                <div className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter text-white">INFRASTRUCTURE_NODES</div>
                <div className="text-xs opacity-30 uppercase font-black tracking-[0.4em] italic flex items-center justify-center xl:justify-start gap-4 text-white">
                  <div className="w-2.5 h-2.5 bg-primary animate-ping" /> GLOBAL_DEPLOYMENT_FOOTPRINT
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full xl:w-auto">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="flex flex-col items-center gap-3 border border-white/5 p-4 bg-white/[0.02] backdrop-blur-md hover:border-primary/40 transition-all group">
                    <div className="w-full h-0.5 bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: n * 0.2 }}
                        className="w-full h-full bg-primary"
                      />
                    </div>
                    <div className="text-[9px] font-black tracking-widest uppercase text-white/40 group-hover:text-primary">NODE_{n.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] font-bold text-primary italic">LOAD: {activeLoads[n - 1] || 0}%</div>
                  </div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="absolute bottom-5 right-5 text-[8px] font-black opacity-10 uppercase tracking-[0.5em] italic"
                >
                  [BUILD_LOG: {"//"} SUCCESS]
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: VISION_CORE (NEURAL OPTICS) */}
      <section id="vault" className="py-24 bg-black relative overflow-hidden border-y-8 border-white/5 w-full">
        <div className="absolute inset-0">
          <WebcamPixelGrid
            gridCols={60}
            gridRows={40}
            maxElevation={40}
            motionSensitivity={0.3}
            elevationSmoothing={0.2}
            colorMode="monochrome"
            monochromeColor="#ccff00"
            backgroundColor="#080808"
            mirror={true}
            gapRatio={0.05}
            invertColors={false}
            darken={0.7}
            borderColor="#ffffff"
            borderOpacity={0.04}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 lg:px-20 text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[9px] font-black uppercase text-primary tracking-[0.3em] italic mb-6">
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" /> NEURAL_OPTICS_LIVE
          </div>
          <h2 className="text-4xl lg:text-7xl font-heading font-black italic tracking-tighter text-white uppercase leading-none outline-text text-transparent hover:text-white transition-all duration-700 mb-8">
            VISION_<span className="text-white">CORE</span>
          </h2>
          <p className="max-w-xl mx-auto text-xs font-bold opacity-30 uppercase tracking-[0.2em] leading-relaxed mb-12">
            Real-time biometric voxel reconstruction. Our computer vision engine maps physical motion into deterministic neural data pathways.
          </p>
          <button className="brutal-btn py-4 px-10 bg-white text-black font-black uppercase italic hover:bg-primary transition-all text-sm">
            INITIALIZE_HANDSHAKE
          </button>
        </div>
      </section>

      {/* HIGH-DENSITY INDUSTRIAL FOOTER */}
      <footer className="bg-black border-t-8 border-white/5 text-white pt-20 pb-12 px-6 lg:px-20 relative overflow-hidden">
        {/* INTERACTIVE BACKGROUND LAYER */}
        <BeamGridBackground
          gridSize={50}
          darkGridColor="rgba(255, 255, 255, 0.03)"
          darkBeamColor="#ccff00"
          beamSpeed={0.05}
          beamCount={5}
          glowIntensity={30}
          fadeIntensity={40}
        />

        {/* BG DECO BRAIN TEXT */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black opacity-[0.01] italic tracking-tighter select-none pointer-events-none">
          STU_X
        </div>

        <div className="container mx-auto relative z-10">
          <div className="mb-16 flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-white/10" />
              <div className="text-[10px] font-mono opacity-30 uppercase tracking-[0.8em] italic animate-pulse">
                {"// AUTH_PROTOCOL_INITIATED // SYS_NOMINAL"}
              </div>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-white/10" />
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent" />
          </div>

          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-12">
              <div className="flex flex-col gap-10">
                {/* PREMIUM BRAND VISUAL */}
                <div className="relative w-32 h-32 group cursor-crosshair">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse transition-opacity group-hover:opacity-100 opacity-40" />
                  <Image
                    src="/footer-core.png"
                    alt="Neural Core"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                <div className="space-y-6">
                  <div className="text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                    OMN_<span className="text-primary">STUDIO</span>
                  </div>
                  <p className="text-xs font-bold opacity-30 leading-relaxed uppercase tracking-[0.2em] max-w-sm">
                    The definitive operating floor for multi-agent orchestration. experimental by design, industrial by execution.
                  </p>
                </div>
              </div>

              <div className="flex gap-10 items-center pt-10 border-t border-white/5 w-fit">
                <div className="h-14 w-14 bg-white flex items-center justify-center group cursor-pointer hover:bg-primary transition-colors">
                  <Terminal className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 italic leading-loose">
                  {"// CORE_KERNEL_v4.0"}<br />
                  {"// BUILD_2026.01.26"}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16 lg:pl-20">
              <div className="space-y-8">
                <div className="text-[11px] font-black text-primary italic uppercase tracking-widest flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary" /> / PLATFORM
                </div>
                <div className="flex flex-col gap-5 text-xs font-bold opacity-40 uppercase tracking-widest font-body">
                  <Link href="/repository" className="hover:text-primary transition-all hover:translate-x-2">Repository</Link>
                  <Link href="/dashboard/analytics" className="hover:text-primary transition-all hover:translate-x-2">Analytics</Link>
                  <Link href="/agent" className="hover:text-primary transition-all hover:translate-x-2">Agents</Link>
                  <Link href="/docs" className="hover:text-primary transition-all hover:translate-x-2">Documentation</Link>
                </div>
              </div>

              <div className="space-y-8">
                <div className="text-[11px] font-black text-primary italic uppercase tracking-widest flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary" /> / RESOURCES
                </div>
                <div className="flex flex-col gap-5 text-xs font-bold opacity-40 uppercase tracking-widest font-body">
                  <Link href="/embed" className="hover:text-primary transition-all hover:translate-x-2">Embed SDK</Link>
                  <Link href="/dashboard" className="hover:text-primary transition-all hover:translate-x-2">Dashboard</Link>
                  <Link href="/dashboard/chat" className="hover:text-primary transition-all hover:translate-x-2">Chat Studio</Link>
                  <Link href="/dashboard/profile" className="hover:text-primary transition-all hover:translate-x-2">Profile</Link>
                </div>
              </div>

              <div className="space-y-8 col-span-2 md:col-span-1">
                <div className="text-[11px] font-black text-white/20 italic uppercase tracking-widest">/ LEGAL_OPS</div>
                <div className="flex flex-col gap-4 text-[10px] font-black opacity-20 uppercase italic">
                  <div>© 2026 OMNIAGENT_LABS</div>
                  <div className="mt-6 flex items-center gap-4 text-white/40">
                    <Lock className="w-3 h-3" /> NO_COMPROMISE
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 font-mono text-[9px] uppercase tracking-[0.5em]">
            <div className="flex items-center gap-6">
              <span>GEO: US.EAST.CLUSTER_7</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>FREQ: 12.4Ghz</span>
            </div>
            <div className="flex gap-10">
              <div>HASH: {mounted ? Math.random().toString(16).slice(2, 10).toUpperCase() : '--------'}</div>
              <div className="text-primary italic font-black">SYS_OPERATIONAL</div>
            </div>
          </div>
        </div>
      </footer>

      {/* SECTION: WAITLIST (BACKGROUND BEAMS) */}
      <section id="waitlist" className="py-32 relative flex flex-col items-center justify-center overflow-hidden border-b-8 border-black w-full bg-[#080808]">
        <BackgroundBeams />
        <div className="container mx-auto px-6 lg:px-20 relative z-10 flex flex-col items-center justify-center">
          <div className="max-w-4xl w-full text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-3 text-primary font-black italic uppercase text-[10px] tracking-[0.4em] mb-8">
              <Zap className="w-3 h-3" /> Phase_04: Controlled_Alpha
            </div>
            <h2 className="text-4xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 font-heading font-black italic tracking-tighter uppercase leading-none mb-8">
              INIT_<span className="acid-text">INGRESS</span>
            </h2>
            <p className="text-white/30 max-w-md mx-auto font-body font-bold uppercase tracking-widest leading-relaxed text-xs mb-12">
              SECURE YOUR ACCESS TO THE NEXT GENERATION OF LOGIC AGENTS.
              SYSTEM SLOTS ARE ALLOCATED BY PRIORITY PROTOCOL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
              <input
                type="text"
                placeholder="OPERATOR_EMAIL@PROT.X"
                className="flex-1 h-14 rounded-none border-2 border-white/10 bg-black/50 px-6 font-mono text-xs text-white placeholder:text-white/5 outline-none focus:border-primary transition-all uppercase"
              />
              <button className="brutal-btn h-14 px-8 bg-primary text-black font-black uppercase italic hover:scale-105 active:scale-95 transition-all text-xs">
                AUTH_REG
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .tracking-tightest { letter-spacing: -0.06em; }
        .outline-text {
          -webkit-text-stroke: 1px #fff;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        h1, h2 { user-select: none; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main >
  );
}
