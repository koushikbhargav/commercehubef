"use client";

import React from "react";

interface DitherImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Overlay color — defaults to forest green */
  overlayColor?: string;
  /** Contrast level for the dither effect */
  contrast?: number;
  width?: number;
  height?: number;
}

/**
 * CSS duotone dither effect — grayscale + high contrast + color overlay.
 * Makes any image look like HALO dithered art.
 */
export function DitherImage({
  src,
  alt,
  className = "",
  overlayColor = "var(--brand, #274029)",
  contrast = 1.8,
  width,
  height,
}: DitherImageProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }}
    >
      {/* Base image — grayscale + high contrast */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          filter: `grayscale(100%) contrast(${contrast})`,
        }}
        loading="lazy"
      />
      {/* Color overlay — mix-blend-mode: multiply */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: overlayColor,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
