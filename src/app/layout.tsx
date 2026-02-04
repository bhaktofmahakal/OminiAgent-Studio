import type { Metadata, Viewport } from "next";
import { Syne, Chivo_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import "./globals.css";
import { Suspense } from 'react';

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700", "800"],
});

const chivo = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "OmniAgent Studio - Build, Chat, and Deploy Multi-Model AI Agents",
  description: "A unified workspace for creating, testing, and deploying AI agents across multiple models. Powered by OpenAI, Anthropic, Google, and Groq.",
  keywords: ["AI", "agents", "chatbot", "GPT", "Claude", "Gemini", "machine learning"],
  authors: [{ name: "OmniAgent Studio" }],
  openGraph: {
    title: "OmniAgent Studio",
    description: "Build, Chat, and Deploy Multi-Model AI Agents",
    type: "website",
    url: "https://omniagent.studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniAgent Studio",
    description: "Build, Chat, and Deploy Multi-Model AI Agents",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

import { Toaster } from "@/components/ui/sonner"

import { MouseGlow } from "@/components/mouse-glow"
import { SmoothCursor } from "@/components/ui/smooth-cursor"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      signInForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL}
      signUpForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL}
    >
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${syne.variable} ${chivo.variable} font-body antialiased bg-[#080808] text-white selection:bg-[#ccff00] selection:text-black`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SmoothCursor
              color="#ccff00"
              size={20}
              glowEffect={true}
              rotateOnMove={true}
              scaleOnClick={true}
            />
            {children}
            <Toaster position="bottom-right" richColors />
            <MouseGlow />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}