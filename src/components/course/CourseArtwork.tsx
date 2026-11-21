"use client";

import React from "react";

export interface CourseArtworkProps {
  variant: "biology" | "chemistry" | "admission" | "math";
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const CourseArtwork: React.FC<CourseArtworkProps> = ({
  variant,
  title,
  subtitle,
  compact = false
}) => {
  const palettes = {
    biology: {
      bg: "from-[#0F2942] via-[#133B5C] to-[#0B1E33]",
      accent: "#38BDF8",
      line: "rgba(186, 230, 253, 0.22)",
      tag: "SSC SCIENCE"
    },
    chemistry: {
      bg: "from-[#172554] via-[#1E3A8A] to-[#0F172A]",
      accent: "#60A5FA",
      line: "rgba(191, 219, 254, 0.22)",
      tag: "GST ADMISSION"
    },
    admission: {
      bg: "from-[#064E3B] via-[#0F5132] to-[#0B1F1A]",
      accent: "#34D399",
      line: "rgba(167, 243, 208, 0.22)",
      tag: "VARSITY BATCH"
    },
    math: {
      bg: "from-[#312E81] via-[#3730A3] to-[#1E1B4B]",
      accent: "#A5B4FC",
      line: "rgba(224, 231, 255, 0.22)",
      tag: "HIGHER MATH"
    }
  };

  const p = palettes[variant] || palettes.biology;

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${p.bg} ${
        compact ? "h-24 rounded-xl" : "h-44"
      } flex flex-col justify-between p-5 select-none`}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`grid-${variant}`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke={p.line}
              strokeWidth="0.7"
            />
          </pattern>
        </defs>
        <rect width="400" height="200" fill={`url(#grid-${variant})`} />

        {variant === "biology" && (
          <g
            transform="translate(260, 18)"
            stroke={p.accent}
            fill="none"
            opacity="0.65"
          >
            <circle cx="65" cy="82" r="56" strokeWidth="1.5" />
            <circle cx="65" cy="82" r="36" strokeWidth="1" strokeDasharray="4 4" />
            <circle
              cx="65"
              cy="82"
              r="14"
              fill={p.accent}
              fillOpacity="0.2"
              strokeWidth="1.5"
            />
            <path d="M 15 35 Q 65 82 115 130" strokeWidth="1.2" opacity="0.6" />
            <path d="M 115 35 Q 65 82 15 130" strokeWidth="1.2" opacity="0.6" />
          </g>
        )}

        {variant === "chemistry" && (
          <g
            transform="translate(250, 22)"
            stroke={p.accent}
            fill="none"
            opacity="0.7"
          >
            <polygon
              points="60,15 100,38 100,84 60,107 20,84 20,38"
              strokeWidth="1.6"
            />
            <polygon
              points="60,30 87,46 87,76 60,92 33,76 33,46"
              strokeWidth="1"
              opacity="0.6"
            />
            <line x1="100" y1="38" x2="128" y2="22" strokeWidth="1.5" />
            <line x1="100" y1="84" x2="128" y2="100" strokeWidth="1.5" />
            <circle
              cx="132"
              cy="20"
              r="5"
              fill={p.accent}
              fillOpacity="0.4"
            />
            <circle
              cx="132"
              cy="102"
              r="5"
              fill={p.accent}
              fillOpacity="0.4"
            />
            <circle cx="20" cy="84" r="4" fill={p.accent} />
          </g>
        )}

        {variant === "admission" && (
          <g
            transform="translate(245, 20)"
            stroke={p.accent}
            fill="none"
            opacity="0.7"
          >
            <path d="M 10 135 Q 60 25 130 45" strokeWidth="2" />
            <path d="M 10 135 L 135 135" strokeWidth="1.2" opacity="0.6" />
            <path d="M 10 20 L 10 135" strokeWidth="1.2" opacity="0.6" />
            <circle cx="66" cy="60" r="5" fill={p.accent} />
            <circle cx="118" cy="44" r="5" fill={p.accent} />
            <rect
              x="42"
              y="95"
              width="14"
              height="40"
              fill={p.accent}
              fillOpacity="0.18"
            />
            <rect
              x="72"
              y="75"
              width="14"
              height="60"
              fill={p.accent}
              fillOpacity="0.24"
            />
            <rect
              x="102"
              y="55"
              width="14"
              height="80"
              fill={p.accent}
              fillOpacity="0.32"
            />
          </g>
        )}

        {variant === "math" && (
          <g
            transform="translate(245, 25)"
            stroke={p.accent}
            fill="none"
            opacity="0.7"
          >
            <rect
              x="20"
              y="20"
              width="90"
              height="90"
              strokeWidth="1.4"
              transform="rotate(15 65 65)"
            />
            <rect
              x="32"
              y="32"
              width="66"
              height="66"
              strokeWidth="1"
              transform="rotate(35 65 65)"
            />
            <circle cx="65" cy="65" r="24" strokeWidth="1.5" />
          </g>
        )}
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-wider text-white/75">
        <span>{p.tag}</span>
      </div>

      <div className="relative z-10 max-w-[80%]">
        {subtitle && (
          <p className="text-xs text-white/80 font-medium truncate">{subtitle}</p>
        )}
        {!compact && title && (
          <h3 className="text-lg font-bold text-white leading-snug mt-0.5 line-clamp-2">
            {title}
          </h3>
        )}
      </div>
    </div>
  );
};
