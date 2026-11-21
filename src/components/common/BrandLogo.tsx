"use client";

import React from "react";

interface BrandLogoProps {
  size?: number;
  className?: string;
}

/**
 * Bespoke geometric monogram for Learning Generation:
 * Obsidian beveled emblem with precision interlocking 'L' + ascending 'G' arc.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 34,
  className = ""
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="lg-emblem-bg"
          x1="4"
          y1="2"
          x2="36"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient
          id="lg-emblem-rim"
          x1="20"
          y1="1"
          x2="20"
          y2="39"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#lg-emblem-bg)" />
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        stroke="url(#lg-emblem-rim)"
        strokeWidth="1.2"
      />

      {/* Precision L Spine */}
      <path
        d="M11.5 11.5V26.3C11.5 27.5 12.4 28.5 13.7 28.5H20.8"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ascending G Horizon & Bar */}
      <path
        d="M28.5 15.1C27.2 12.8 24.8 11.4 22 11.4C18.3 11.4 15.6 14.2 15.6 18.1C15.6 22 18.3 24.7 22.1 24.7C25.8 24.7 28.5 22.2 28.5 18.6H22.7"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Luminous Apex Node */}
      <circle cx="28.4" cy="27.2" r="2.2" fill="#BAE6FD" />
    </svg>
  );
};
