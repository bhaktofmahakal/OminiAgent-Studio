import tailwindAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    blocklist: [
        '[-:|]',
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    hover: "hsl(var(--primary-hover))",
                    active: "hsl(var(--primary-active))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    hover: "hsl(var(--secondary-hover))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                    hover: "hsl(var(--accent-hover))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Model-specific colors
                model: {
                    gpt: "hsl(var(--gpt))",
                    claude: "hsl(var(--claude))",
                    gemini: "hsl(var(--gemini))",
                    groq: "hsl(var(--groq))",
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                "fade-out": "fade-out 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "slide-in": "slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "slide-out": "slide-out 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "shimmer": "shimmer 2s ease-in-out infinite",
                "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "gradient-shift": "gradient-shift 4s ease infinite",
                "bounce-subtle": "bounce-subtle 1s ease-in-out",
                "glow": "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                "pulse": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-out": {
                    "0%": { opacity: "1", transform: "translateY(0)" },
                    "100%": { opacity: "0", transform: "translateY(-8px)" },
                },
                "slide-in": {
                    "0%": { opacity: "0", transform: "translateX(-16px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "slide-out": {
                    "0%": { opacity: "1", transform: "translateX(0)" },
                    "100%": { opacity: "0", transform: "translateX(16px)" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale(0.9)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                "shimmer": {
                    "0%": { "background-position": "-200% 0" },
                    "100%": { "background-position": "200% 0" },
                },
                "gradient-shift": {
                    "0%, 100%": { "background-position": "0% 50%" },
                    "50%": { "background-position": "100% 50%" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-4px)" },
                },
                "glow": {
                    "0%": { "box-shadow": "0 0 20px rgba(139, 92, 246, 0.3)" },
                    "100%": { "box-shadow": "0 0 40px rgba(139, 92, 246, 0.6)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "hero-gradient": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
                "card-gradient": "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)",
                "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                "dark-gradient": "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Consolas", "monospace"],
            },
            boxShadow: {
                "soft": "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
                "medium": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
                "strong": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                "glow": "0 0 32px rgba(139, 92, 246, 0.35)",
                "glow-sm": "0 0 16px rgba(139, 92, 246, 0.25)",
                "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            },
            spacing: {
                "18": "4.5rem",
                "88": "22rem",
                "128": "32rem",
            },
            backdropBlur: {
                xs: "2px",
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: "hsl(var(--foreground))",
                        maxWidth: "none",
                        '--tw-prose-body': "hsl(var(--foreground))",
                        '--tw-prose-headings': "hsl(var(--foreground))",
                        '--tw-prose-lead': "hsl(var(--muted-foreground))",
                        '--tw-prose-links': "hsl(var(--primary))",
                        '--tw-prose-bold': "hsl(var(--foreground))",
                        '--tw-prose-counters': "hsl(var(--muted-foreground))",
                        '--tw-prose-bullets': "hsl(var(--muted-foreground))",
                        '--tw-prose-hr': "hsl(var(--border))",
                        '--tw-prose-quotes': "hsl(var(--foreground))",
                        '--tw-prose-quote-borders': "hsl(var(--border))",
                        '--tw-prose-captions': "hsl(var(--muted-foreground))",
                        '--tw-prose-code': "hsl(var(--foreground))",
                        '--tw-prose-pre-code': "hsl(var(--muted-foreground))",
                        '--tw-prose-pre-bg': "hsl(var(--muted))",
                        '--tw-prose-th-borders': "hsl(var(--border))",
                        '--tw-prose-td-borders': "hsl(var(--border))",
                    },
                },
            },
        },
    },
    plugins: [
        tailwindAnimate,
        tailwindTypography,
    ],
};
