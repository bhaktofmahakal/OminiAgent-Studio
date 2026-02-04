"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MaskContainer = ({
    children,
    revealText,
    size = 10,
    revealSize = 600,
    className,
}: {
    children?: string | React.ReactNode;
    revealText?: string | React.ReactNode;
    size?: number;
    revealSize?: number;
    className?: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState<any>({ x: null, y: null });
    const containerRef = useRef<any>(null);
    const updateMousePosition = (e: any) => {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", updateMousePosition);
        }
        return () => {
            if (container) {
                container.removeEventListener("mousemove", updateMousePosition);
            }
        };
    }, []);
    const maskSize = isHovered ? revealSize : size;

    return (
        <motion.div
            ref={containerRef}
            className={cn("relative h-screen overflow-hidden", className)}
            animate={{
                backgroundColor: isHovered ? "#0f172a" : "#ffffff",
            }}
            transition={{
                backgroundColor: { duration: 0.3 },
            }}
        >
            <motion.div
                className="absolute flex h-full w-full items-center justify-center bg-[#080808] text-6xl [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:40px]"
                animate={{
                    maskPosition: `${mousePosition.x - maskSize / 2}px ${mousePosition.y - maskSize / 2
                        }px`,
                    maskSize: `${maskSize}px`,
                }}
                transition={{
                    maskSize: { duration: 0.3, ease: "easeInOut" },
                    maskPosition: { duration: 0.15, ease: "linear" },
                }}
            >
                <div className="absolute inset-0 z-0 h-full w-full bg-black opacity-90" />
                <div
                    onMouseEnter={() => {
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                    }}
                    className="relative z-20 mx-auto max-w-6xl text-center text-4xl md:text-7xl font-heading font-black italic tracking-tighter uppercase px-6"
                >
                    {children}
                </div>
            </motion.div>

            <div className="flex h-full w-full items-center justify-center bg-white">
                <div className="mx-auto max-w-6xl text-center text-4xl md:text-7xl font-heading font-black italic tracking-tighter uppercase text-black px-6">
                    {revealText}
                </div>
            </div>
        </motion.div>
    );
};
