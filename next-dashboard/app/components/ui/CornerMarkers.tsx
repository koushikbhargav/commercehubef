"use client";

import React from "react";

interface CornerMarkersProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Decorative L-bracket corners — positioned absolutely within a relative parent.
 * Wrap content in a `relative` container, then place <CornerMarkers /> inside.
 */
export function CornerMarkers({
  className = "",
  size = 12,
  color,
}: CornerMarkersProps) {
  const borderColor = color || "var(--foreground)";
  const s = `${size}px`;

  const base: React.CSSProperties = {
    position: "absolute",
    width: s,
    height: s,
    pointerEvents: "none",
    zIndex: 1,
  };

  return (
    <span className={className} aria-hidden="true">
      {/* Top-left */}
      <span
        style={{
          ...base,
          top: -1,
          left: -1,
          borderTop: `1px solid ${borderColor}`,
          borderLeft: `1px solid ${borderColor}`,
        }}
      />
      {/* Top-right */}
      <span
        style={{
          ...base,
          top: -1,
          right: -1,
          borderTop: `1px solid ${borderColor}`,
          borderRight: `1px solid ${borderColor}`,
        }}
      />
      {/* Bottom-left */}
      <span
        style={{
          ...base,
          bottom: -1,
          left: -1,
          borderBottom: `1px solid ${borderColor}`,
          borderLeft: `1px solid ${borderColor}`,
        }}
      />
      {/* Bottom-right */}
      <span
        style={{
          ...base,
          bottom: -1,
          right: -1,
          borderBottom: `1px solid ${borderColor}`,
          borderRight: `1px solid ${borderColor}`,
        }}
      />
    </span>
  );
}
