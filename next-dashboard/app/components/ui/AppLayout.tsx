"use client";

import React from "react";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout wrapper for authenticated pages.
 * Provides sidebar + scrollable main content area.
 */
export function AppLayout({ children, className = "" }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <AppSidebar />

      <main
        className={`
          flex-1 min-w-0
          px-6 md:px-10 py-8
          overflow-y-auto
          ${className}
        `}
      >
        {children}
      </main>
    </div>
  );
}
