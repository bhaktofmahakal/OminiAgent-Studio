"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
    return <HeroParallax products={products} />;
}
export const products = [
    {
        title: "RESEARCH_SYNAPSE_v4",
        link: "/agent/research-synapse",
        thumbnail: "/repository/neural_core.png",
    },
    {
        title: "CODE_ORCHESTRATOR_X",
        link: "/agent/code-orchestrator",
        thumbnail: "/repository/industrial_node.png",
    },
    {
        title: "DATA_MINER_BETA",
        link: "/agent/data-miner",
        thumbnail: "/repository/logic_lattice.png",
    },
    {
        title: "LOGIC_SENTRY_01",
        link: "/agent/logic-sentry",
        thumbnail: "/repository/cyber_sentinel.png",
    },
    {
        title: "NEURAL_VOICE_RELAY",
        link: "/agent/voice-relay",
        thumbnail: "/repository/data_helix.png",
    },
    {
        title: "PHANTOM_RECON",
        link: "/agent/phantom-recon",
        thumbnail: "/repository/holo_terminal.png",
    },
    {
        title: "ATOMIC_DEBUGGER",
        link: "/agent/atomic-debugger",
        thumbnail: "/repository/neural_core.png",
    },
    {
        title: "VECTOR_HUB_LITE",
        link: "/agent/vector-hub",
        thumbnail: "/repository/industrial_node.png",
    },
    {
        title: "PULSE_MONITOR_X9",
        link: "/agent/pulse-monitor",
        thumbnail: "/repository/logic_lattice.png",
    },
    {
        title: "DELTA_LLM_TUNER",
        link: "/agent/llm-tuner",
        thumbnail: "/repository/cyber_sentinel.png",
    },
    {
        title: "VOID_ENCRYPTION_BOT",
        link: "/agent/void-encryption",
        thumbnail: "/repository/data_helix.png",
    },
    {
        title: "ETHERS_TRADER_AI",
        link: "/agent/ethers-trader",
        thumbnail: "/repository/holo_terminal.png",
    },
    {
        title: "PULSE_GEN_v2",
        link: "/agent/pulse-gen",
        thumbnail: "/repository/neural_core.png",
    },
    {
        title: "TITAN_SENTINEL",
        link: "/agent/titan-sentinel",
        thumbnail: "/repository/industrial_node.png",
    },
    {
        title: "NEON_GATEKEEPER",
        link: "/agent/neon-gatekeeper",
        thumbnail: "/repository/logic_lattice.png",
    },
];
