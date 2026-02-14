"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { HaloButton } from "./HaloButton";

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout for public pages (landing, onboarding).
 * Top header: HALO logo left, CONSOLE + ONBOARD buttons right, ThemeToggle.
 */
export function PublicLayout({ children, className = "" }: PublicLayoutProps) {
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-[var(--background)] ${className}`}>
      {/* Public header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="font-display text-2xl tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              HALO
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <HaloButton
              variant="ghost"
              size="sm"
              onClick={() => router.push("/demo/dashboard")}
            >
              Console
            </HaloButton>

            <HaloButton
              variant="cta"
              size="sm"
              onClick={() => router.push("/onboarding")}
            >
              Onboard
            </HaloButton>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
