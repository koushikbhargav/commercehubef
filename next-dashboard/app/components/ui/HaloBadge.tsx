"use client";

import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface HaloBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Show colored dot indicator */
  dot?: boolean;
  className?: string;
}

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--muted-foreground)]",
  success: "bg-olive",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  success: "bg-olive/15 text-olive",
  warning: "bg-amber-500/15 text-amber-600",
  error: "bg-red-500/15 text-red-600",
  info: "bg-blue-500/15 text-blue-600",
};

/**
 * Monospace uppercase badge with optional colored dot.
 */
export function HaloBadge({
  children,
  variant = "default",
  dot = false,
  className = "",
}: HaloBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1
        font-mono text-[9px] uppercase tracking-[0.2em] leading-none
        rounded-[var(--radius)]
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
