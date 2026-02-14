"use client";

import React, { useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Reads theme preference from localStorage on mount and applies `.dark` class
 * to <html>. Prevents flash of incorrect theme on hydration.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("halo-theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  // Render children immediately — the class is set synchronously enough
  // that the first paint will usually be correct. ThemeToggle handles
  // the interactive toggle.
  return <>{children}</>;
}
