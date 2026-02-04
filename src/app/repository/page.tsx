'use client'

import HeroParallaxDemo from "@/components/hero-parallax-demo";
import Link from "next/link";
import { MoveLeft, Shield, Cpu, Zap } from "lucide-react";

export default function RepositoryPage() {
    return (
        <main className="bg-[#080808] min-h-screen">
            {/* Back Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-20 flex justify-between items-center bg-[#080808]/80 backdrop-blur-xl border-b-2 border-white/5 h-20">
                <Link href="/" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors">
                    <MoveLeft className="w-4 h-4" /> [EXIT_RECON]
                </Link>

                <div className="flex gap-10 font-body text-[9px] font-black uppercase tracking-widest opacity-20 italic">
                    <div className="flex items-center gap-2"><Shield className="w-3 h-3 text-primary" /> SECURE_FEED</div>
                    <div className="flex items-center gap-2"><Cpu className="w-3 h-3 text-primary" /> CORE_LINK</div>
                </div>
            </nav>

            {/* Parallax Content */}
            <HeroParallaxDemo />

            {/* Bottom Technical Banner */}
            <div className="bg-black border-t-4 border-white/5 py-20 px-6">
                <div className="container mx-auto flex flex-col items-center text-center space-y-8">
                    <div className="h-16 w-[1px] bg-primary" />
                    <h3 className="text-2xl font-heading font-black italic text-white uppercase tracking-tighter">
                        READY_TO_DEPLOY_YOUR_OWN_UNIT?
                    </h3>
                    <p className="max-w-xl text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] italic mb-10">
                        ACCESS THE COMPILER AND INITIALIZE SYNAPTIC STRINGS IN UNDER 60 SECONDS.
                    </p>
                    <Link href="/dashboard" className="brutal-btn py-6 px-16 bg-white text-black font-black uppercase italic hover:bg-primary transition-all">
                        INITIALIZE_COMPILER
                    </Link>
                </div>
            </div>

            {/* Global CSS for parallax integration */}
            <style jsx global>{`
        .tracking-tightest { letter-spacing: -0.06em; }
        .outline-text {
          -webkit-text-stroke: 1px #fff;
        }
        h1, h2 { user-select: none; }
      `}</style>
        </main>
    );
}
