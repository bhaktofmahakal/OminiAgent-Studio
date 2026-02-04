import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";

export default function WebcamPixelGridDemo() {
    return (
        <div className="relative h-screen w-full bg-[#080808] overflow-hidden">
            {/* Webcam pixel grid background */}
            <div className="absolute inset-0">
                <WebcamPixelGrid
                    gridCols={60}
                    gridRows={40}
                    maxElevation={50}
                    motionSensitivity={0.25}
                    elevationSmoothing={0.2}
                    colorMode="webcam"
                    backgroundColor="#080808"
                    mirror={true}
                    gapRatio={0.05}
                    invertColors={false}
                    darken={0.6}
                    borderColor="#ffffff"
                    borderOpacity={0.06}
                    className="w-full h-full"
                    onWebcamReady={() => console.log("Webcam ready!")}
                    onWebcamError={(err) => console.error("Webcam error:", err)}
                />
            </div>

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

            {/* Hero content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                <div className="max-w-4xl text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[9px] font-black uppercase text-primary tracking-[0.3em] italic">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse" /> SYSTEM_VISUAL_FEED_ACTIVE
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-8xl font-heading font-black italic tracking-tighter text-white leading-none uppercase">
                        NEURAL_<span className="acid-text text-primary">OPTICS</span>
                    </h1>

                    {/* Description */}
                    <p className="mx-auto max-w-2xl text-xs md:text-sm font-body font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                        EXPERIENCE DYNAMIC MOTION-BASED VOXEL RECONSTRUCTION.
                        OUR COMPUTER VISION CORE PROCESSES REAL-TIME FEEDS INTO DETERMINISTIC DATA PATHWAYS.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row pt-6">
                        <button className="brutal-btn h-14 px-12 bg-white text-black font-black uppercase italic hover:bg-primary transition-all">
                            INITIALIZE_FEED
                        </button>
                        <button className="brutal-btn h-14 px-12 border-2 border-white text-white font-black uppercase italic hover:bg-white hover:text-black transition-all">
                            SYS_DOCUMENTATION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
