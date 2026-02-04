"use client";
import React from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const HeroParallax = ({
    products,
}: {
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
}) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1000]),
        springConfig
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
        springConfig
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
        springConfig
    );
    return (
        <div
            ref={ref}
            className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-[#080808]"
        >
            <Header />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className=""
            >
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                    {firstRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row mb-20 space-x-20 ">
                    {secondRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateXReverse}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
                    {thirdRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const Header = () => {
    return (
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[10px] font-black uppercase text-primary tracking-[0.4em] italic mb-8">
                <div className="w-1.5 h-1.5 bg-primary animate-pulse" /> [MODULE: AGENT_RECON]
            </div>
            <h1 className="text-4xl md:text-8xl font-heading font-black italic tracking-tightest text-white leading-none uppercase">
                THE_AGENT_<br />
                <span className="acid-text outline-text text-transparent hover:text-white transition-all duration-700">REPOSITORY</span>
            </h1>
            <p className="max-w-2xl text-xs md:text-sm font-body font-bold text-white/40 mt-12 uppercase tracking-[0.2em] leading-relaxed border-l-2 border-primary pl-8">
                Discover the next generation of autonomous units built on the OmniAgent SDK.
                Battle-tested architectures for mission-critical logic orchestration.
            </p>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        link: string;
        thumbnail: string;
    };
    translate: MotionValue<number>;
}) => {
    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
            key={product.title}
            className="group/product h-96 w-[30rem] relative shrink-0 border-4 border-white/5 hover:border-primary transition-colors"
        >
            <Link
                href={product.link}
                className="block group-hover/product:shadow-2xl h-full w-full relative"
            >
                <Image
                    src={product.thumbnail}
                    fill
                    className="object-cover object-left-top absolute h-full w-full inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                    alt={product.title}
                    unoptimized
                />
            </Link>
            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity"></div>
            <div className="absolute bottom-6 left-6 opacity-0 group-hover/product:opacity-100 transition-opacity">
                <h2 className="text-2xl font-heading font-black italic text-primary uppercase">
                    {product.title}
                </h2>
                <div className="text-[10px] font-mono text-white/60 mt-1 uppercase tracking-widest italic">
                    {"// [STATUS: DEPLOYED]"}
                </div>
            </div>
        </motion.div>
    );
};
