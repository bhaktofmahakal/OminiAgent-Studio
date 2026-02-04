"use client";
import { cn } from "@/lib/utils";
import { Menu, X, Terminal, ArrowRight } from "lucide-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import React, { useRef, useState } from "react";
import Link from "next/link";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const [visible, setVisible] = useState<boolean>(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            className={cn("fixed inset-x-0 top-0 z-[100] w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                width: visible ? "max-content" : "100%",
                gap: visible ? "4rem" : "0rem",
                y: visible ? 20 : 0,
                backgroundColor: visible ? "rgba(8, 8, 8, 0.9)" : "rgba(8, 8, 8, 0)",
                padding: visible ? "0.5rem 2.5rem" : "0 5rem",
                borderRadius: visible ? "100px" : "0px",
                borderWidth: visible ? "1px" : "0px",
                height: visible ? "54px" : "72px",
            }}
            transition={{
                type: "spring",
                stiffness: 250,
                damping: 30,
            }}
            className={cn(
                "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between border-white/10 backdrop-blur-md lg:flex",
                !visible && "border-b border-white/5",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick, visible }: NavItemsProps & { visible?: boolean }) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div
            animate={{
                gap: visible ? "1.5rem" : "2.5rem",
                opacity: 1
            }}
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "flex flex-row items-center justify-center font-body text-[10px] font-black uppercase tracking-[0.2em] italic",
                className,
            )}
        >
            {items.map((item, idx) => (
                <Link
                    key={`link-${idx}`}
                    href={item.link}
                    onMouseEnter={() => setHovered(idx)}
                    onClick={onItemClick}
                    className="relative px-3 py-1 group transition-colors hover:text-primary"
                >
                    <AnimatePresence>
                        {hovered === idx && (
                            <motion.div
                                layoutId="hovered"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 h-full w-full rounded-full bg-white/5 -z-10"
                            />
                        )}
                    </AnimatePresence>
                    <span className="relative z-20">/ {item.name}</span>
                </Link>
            ))}
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                width: visible ? "90%" : "100%",
                y: visible ? 20 : 0,
                height: "60px",
                borderRadius: visible ? "12px" : "0px",
                backgroundColor: visible ? "rgba(8, 8, 8, 0.95)" : "rgba(8, 8, 8, 1)",
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full flex-col items-center justify-center px-6 lg:hidden border-b border-white/5 overflow-visible",
                visible && "border border-white/10 shadow-2xl",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={cn(
                        "absolute inset-x-0 top-[70px] z-50 flex w-full flex-col items-start justify-start gap-6 rounded-2xl bg-[#080808]/95 p-8 border border-white/10 backdrop-blur-xl shadow-2xl",
                        className,
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return (
        <button onClick={onClick} className="p-2 text-white">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
    );
};

export const NavbarLogo = () => {
    return (
        <Link href="/" className="flex flex-col group shrink-0">
            <span className="text-xl font-heading font-extrabold tracking-tighter text-white group-hover:text-primary transition-colors">
                OMN_STUDIO
            </span>
            <span className="text-[8px] font-body font-bold opacity-30 tracking-[0.5em] -mt-1 text-white uppercase italic">
                v4.0_CORE
            </span>
        </Link>
    );
};

export const NavbarButton = ({
    href,
    onClick,
    children,
    className,
    variant = "primary",
}: {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
}) => {
    const content = (
        <span className={cn(
            "px-5 py-2 font-body text-[10px] font-black uppercase italic transition-all flex items-center gap-2",
            variant === "primary" ? "bg-white text-black hover:bg-primary" : "border border-white/20 text-white hover:border-white",
            className
        )}>
            {children}
        </span>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return <button onClick={onClick}>{content}</button>;
};
