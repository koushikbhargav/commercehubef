"use client";

import React from "react";

interface HaloInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  wrapperClassName?: string;
}

/**
 * 1px border input with proper focus ring (olive).
 * Monospace placeholder, sharp radius.
 */
export const HaloInput = React.forwardRef<HTMLInputElement, HaloInputProps>(
  ({ label, error, className = "", wrapperClassName = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2.5
            bg-transparent
            text-[var(--foreground)] text-sm
            border border-[var(--input)]
            rounded-[var(--radius)]
            placeholder:font-mono placeholder:text-[var(--muted-foreground)] placeholder:text-xs placeholder:uppercase placeholder:tracking-wider
            focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)]
            transition-colors duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-[var(--destructive)] focus:ring-[var(--destructive)]" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--destructive)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

HaloInput.displayName = "HaloInput";
