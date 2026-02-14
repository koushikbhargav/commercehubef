"use client";

import React from "react";
import { CornerMarkers } from "./CornerMarkers";

interface HaloCardProps {
  children: React.ReactNode;
  className?: string;
  /** Show decorative L-bracket corners */
  corners?: boolean;
  /** Click handler — adds hover cursor */
  onClick?: () => void;
  as?: React.ElementType;
}

/**
 * Flat card — 1px border, uses --radius (2px light / 10px dark).
 * Border-based separation with no box-shadow in light mode.
 */
export function HaloCard({
  children,
  className = "",
  corners = false,
  onClick,
  as: Tag = "div",
}: HaloCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-[var(--card)] text-[var(--card-foreground)]
        border border-[var(--border)]
        rounded-[var(--radius)]
        shadow-[var(--shadow-sm)]
        transition-colors duration-200
        ${onClick ? "cursor-pointer hover:border-[var(--accent)]" : ""}
        ${className}
      `}
    >
      {corners && <CornerMarkers />}
      {children}
    </Tag>
  );
}
