"use client";

import React, { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

/**
 * "AGENTIC" pill toggle — switches between light/dark mode.
 * Adds/removes `.dark` class on <html>. Stores preference in localStorage.
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("halo-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("halo-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("halo-theme", "light");
    }
  };

  // Prevent flash of wrong state on SSR
  if (!mounted) {
    return (
      <button
        className={`
          relative flex items-center
          h-7 w-[88px]
          rounded-full border border-[var(--border)]
          bg-[var(--muted)]
          font-mono text-[7px] uppercase tracking-[0.25em]
          cursor-pointer select-none
          ${className}
        `}
        aria-label="Toggle theme"
      >
        <span className="flex-1 text-center text-[var(--muted-foreground)]">
          Light
        </span>
        <span className="flex-1 text-center text-[var(--muted-foreground)]">
          Dark
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`
        relative flex items-center
        h-7 w-[88px]
        rounded-full border border-[var(--border)]
        bg-[var(--muted)]
        font-mono text-[7px] uppercase tracking-[0.25em]
        cursor-pointer select-none
        transition-colors duration-300
        ${className}
      `}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      {/* Sliding pill indicator */}
      <span
        className={`
          absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)]
          rounded-full
          bg-[var(--foreground)]
          transition-transform duration-300 ease-out
          ${dark ? "translate-x-[calc(100%+4px)]" : "translate-x-0.5"}
        `}
      />

      <span
        className={`
          relative z-10 flex-1 text-center transition-colors duration-300
          ${!dark ? "text-[var(--background)]" : "text-[var(--muted-foreground)]"}
        `}
      >
        Light
      </span>
      <span
        className={`
          relative z-10 flex-1 text-center transition-colors duration-300
          ${dark ? "text-[var(--background)]" : "text-[var(--muted-foreground)]"}
        `}
      >
        Dark
      </span>
    </button>
  );
}
