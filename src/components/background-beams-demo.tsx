"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function BackgroundBeamsDemo() {
    return (
        <div className="h-screen w-full bg-[#080808] relative flex flex-col items-center justify-center antialiased overflow-hidden">
            <div className="max-w-2xl mx-auto p-4 relative z-10">
                <h1 className="text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 text-center font-heading font-black italic tracking-tighter uppercase">
                    JOIN_THE_<span className="acid-text">WAITLIST</span>
                </h1>
                <p className="text-white/40 max-w-lg mx-auto my-6 text-xs md:text-sm text-center font-body font-bold uppercase tracking-widest leading-relaxed">
                    SECURE YOUR ACCESS TO THE NEXT GENERATION OF LOGIC AGENTS.
                    WE ARE CURRENTLY OPERATING IN PHASE_04: CONTROLLED_ALPHA.
                    INJECT YOUR CREDENTIALS BELOW TO BE NOTIFIED OF SYSTEM AVAILABILITY.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <input
                        type="text"
                        placeholder="OPERATOR_EMAIL@PROT.X"
                        className="flex-1 h-14 rounded-none border-2 border-white/20 bg-black/50 px-6 font-mono text-xs text-white placeholder:text-white/10 outline-none focus:border-primary transition-all uppercase"
                    />
                    <button className="brutal-btn h-14 px-10 bg-primary text-black font-black uppercase italic hover:scale-105 active:scale-95 transition-all">
                        AUTH_REGISTRATION
                    </button>
                </div>
                <div className="mt-20 font-mono text-[8px] text-center opacity-20 uppercase tracking-[0.6em] italic">
                    {"// CONNECTION_SECURE // ENCRYPTED_HANDSHAKE // PROTO_X99"}
                </div>
            </div>
            <BackgroundBeams />
        </div>
    );
}
