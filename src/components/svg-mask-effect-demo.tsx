"use client";
import { MaskContainer } from "@/components/ui/svg-mask-effect";

export default function SVGMaskEffectDemo() {
    return (
        <div className="w-full overflow-hidden border-y-4 border-black">
            <MaskContainer
                className="h-[60vh]"
                revealText={
                    <div className="space-y-4">
                        <span className="text-primary acid-text text-[10px] font-black uppercase tracking-[0.5em]">{"// THE_TRUTH"}</span>
                        <p className="max-w-4xl text-2xl md:text-5xl font-heading font-black italic tracking-tighter uppercase leading-tight">
                            THE FIRST RULE OF THE <span className="text-primary">LATENT_SPACE</span> IS YOU DO NOT CONTROL THE CHAOS. THE SECOND RULE IS YOU <span className="text-primary italic">DECODE</span> IT.
                        </p>
                    </div>
                }
                revealSize={500}
            >
                <div className="space-y-4">
                    <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">{"// SYSTEM_ECHO"}</span>
                    <p className="max-w-4xl text-2xl md:text-5xl font-heading font-black italic tracking-tighter uppercase leading-tight">
                        WE BUILD TOOLS FOR THE <span className="text-white">UNGOVERNABLE</span>. AGENTS WITHOUT BORDERS. LOGIC WITHOUT COMPROMISE.
                    </p>
                </div>
            </MaskContainer>
        </div>
    );
}
