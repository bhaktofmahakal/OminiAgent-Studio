'use client'

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, SignUpButton } from '@clerk/nextjs';

export default function CTAButtons() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <div className="w-32 h-10 bg-muted/20 rounded animate-pulse"></div>
        <div className="w-40 h-10 bg-muted/20 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      {isSignedIn ? (
        <Button size="lg" asChild className="group">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      ) : (
        <SignUpButton mode="modal">
          <Button size="lg" className="group">
            Start Building
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </SignUpButton>
      )}

      {isSignedIn ? (
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/chat">Try Multi-Model Chat</Link>
        </Button>
      ) : (
        <Button variant="outline" size="lg" disabled className="cursor-not-allowed">
          Try Multi-Model Chat (Login Required)
        </Button>
      )}
    </div>
  );
}