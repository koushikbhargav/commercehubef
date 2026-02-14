"use client";

import React from "react";
import { ArrowRight } from "@phosphor-icons/react";

type ButtonVariant = "cta" | "primary" | "outline" | "ghost" | "technical";
type ButtonSize = "sm" | "md" | "lg";

interface HaloButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  /** Show arrow icon (default on `cta` variant) */
  arrow?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[9px] gap-1.5",
  md: "px-5 py-2.5 text-[10px] gap-2",
  lg: "px-7 py-3 text-[11px] gap-2.5",
};

const variantStyles: Record<ButtonVariant, string> = {
  cta: `
    bg-[var(--brand)] text-[var(--brand-foreground)]
    border border-[var(--brand)]
    hover:opacity-90
  `,
  primary: `
    bg-[var(--brand)] text-[var(--brand-foreground)]
    border border-[var(--brand)]
    hover:opacity-90
  `,
  outline: `
    bg-transparent text-[var(--foreground)]
    border border-[var(--border)]
    hover:bg-[var(--brand)] hover:text-[var(--brand-foreground)]
    hover:border-[var(--brand)]
  `,
  ghost: `
    bg-transparent text-[var(--foreground)]
    border border-transparent
    hover:bg-[var(--muted)]
  `,
  technical: `
    bg-transparent text-[var(--foreground)]
    border border-[var(--border)]
    font-mono
    hover:bg-[var(--brand)] hover:text-[var(--brand-foreground)]
    hover:border-[var(--brand)]
  `,
};

/**
 * HALO Design System button.
 * All variants: uppercase, tracked, sharp radius, smooth transitions.
 */
export function HaloButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  arrow,
  disabled,
  ...props
}: HaloButtonProps) {
  const showArrow = arrow ?? variant === "cta";

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        uppercase tracking-[0.25em] font-normal
        rounded-[var(--radius)]
        transition-all duration-200 ease-out
        cursor-pointer select-none
        disabled:opacity-40 disabled:pointer-events-none
        ${sizeClasses[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight weight="bold" className="w-3.5 h-3.5" />}
    </button>
  );
}
