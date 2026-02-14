"use client";

import React from "react";
import { Placeholder } from "@phosphor-icons/react";

interface HaloEmptyStateProps {
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Dashed border container with monospace label + icon.
 * Use for empty tables, missing data, placeholder states.
 */
export function HaloEmptyState({
  label = "No data",
  description,
  icon,
  children,
  className = "",
}: HaloEmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        py-12 px-6
        border border-dashed border-[var(--border)]
        rounded-[var(--radius)]
        text-center
        ${className}
      `}
    >
      <div className="text-[var(--muted-foreground)] opacity-60">
        {icon || <Placeholder weight="thin" className="w-8 h-8" />}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
        {label}
      </p>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
