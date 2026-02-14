"use client";

import React from "react";

export function DitherWave() {
  return (
    <div className="w-full relative overflow-hidden bg-cyber-cream" aria-hidden="true">
      <svg
        viewBox="0 0 1440 160"
        className="w-full h-auto block min-w-[1000px] text-black"
        preserveAspectRatio="none"
        style={{ display: 'block', marginBottom: -1 }} 
      >
        <defs>
          <pattern id="dither-pattern-light" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="1" fill="currentColor" opacity="0.1" />
            <rect x="2" y="2" width="1" height="1" fill="currentColor" opacity="0.1" />
          </pattern>
          <pattern id="dither-pattern-medium" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
             <rect x="0" y="0" width="1" height="1" fill="currentColor" opacity="0.3" />
            <rect x="2" y="2" width="1" height="1" fill="currentColor" opacity="0.3" />
            <rect x="0" y="2" width="1" height="1" fill="currentColor" opacity="0.3" />
          </pattern>
          <pattern id="dither-pattern-heavy" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="2" height="2" fill="currentColor" opacity="0.8" />
            <rect x="2" y="2" width="2" height="2" fill="currentColor" opacity="0.8" />
             <rect x="2" y="0" width="1" height="1" fill="currentColor" opacity="0.8" />
             <rect x="0" y="2" width="1" height="1" fill="currentColor" opacity="0.8" />
          </pattern>
        </defs>
        
        {/* Top Fade */}
        <path fill="url(#dither-pattern-light)" d="M0,0 C320,100 420,0 720,80 C1020,160 1120,40 1440,80 V160 H0 V0 Z" transform="translate(0, -30)" />

        {/* Mid Fade */}
        <path fill="url(#dither-pattern-medium)" d="M0,30 C320,120 420,30 720,100 C1020,170 1120,60 1440,110 V160 H0 V30 Z" transform="translate(0, -10)"/>

        {/* Bottom Fade (Heaviest) */}
        <path fill="url(#dither-pattern-heavy)" d="M0,60 C320,140 420,60 720,120 C1020,180 1120,90 1440,140 V160 H0 V60 Z" />
        
        {/* Solid Black Bottom to merge with footer */}
        <path fill="currentColor" d="M0,100 C320,160 420,100 720,140 C1020,190 1120,110 1440,150 V160 H0 V100 Z" />
      </svg>
    </div>
  );
}
