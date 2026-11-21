"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import biologyCover from "@/assets/images/course_cover_biology_1795250608387.jpg";
import chemistryCover from "@/assets/images/course_cover_chemistry_1795250608910.jpg";
import admissionCover from "@/assets/images/course_cover_admission_1795250608259.jpg";
import mathCover from "@/assets/images/course_cover_math_1795250609467.jpg";
import { SubjectIcon, SubjectDomain } from "@/components/common/SubjectIcon";

export interface CourseArtworkProps {
  variant: "biology" | "chemistry" | "admission" | "math";
  subtitle?: string;
  compact?: boolean;
  hero?: boolean;
  priority?: boolean;
}

const ARTWORK_MAP: Record<
  "biology" | "chemistry" | "admission" | "math",
  {
    image: StaticImageData;
    fallbackBg: string;
    label: string;
    domain: SubjectDomain;
    alt: string;
  }
> = {
  biology: {
    image: biologyCover,
    fallbackBg: "from-[#071A1E] via-[#0B1726] to-[#0C0F16]",
    label: "বিজ্ঞান · SSC",
    domain: "biology",
    alt: "বিজ্ঞান ও জীববিজ্ঞান কোর্স কভার"
  },
  chemistry: {
    image: chemistryCover,
    fallbackBg: "from-[#0A1328] via-[#0E182E] to-[#0C0F16]",
    label: "গুচ্ছ ভর্তি · GST",
    domain: "chemistry",
    alt: "রসায়ন ও গুচ্ছ ভর্তি কোর্স কভার"
  },
  admission: {
    image: admissionCover,
    fallbackBg: "from-[#17120A] via-[#121622] to-[#0C0F16]",
    label: "বিশ্ববিদ্যালয় ভর্তি",
    domain: "admission",
    alt: "বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি কোর্স কভার"
  },
  math: {
    image: mathCover,
    fallbackBg: "from-[#0E1026] via-[#121528] to-[#0C0F16]",
    label: "উচ্চতর গণিত",
    domain: "math",
    alt: "উচ্চতর গণিত কোর্স কভার"
  }
};

export const CourseArtwork: React.FC<CourseArtworkProps> = ({
  variant,
  subtitle,
  compact = false,
  hero = false,
  priority = false
}) => {
  const art = ARTWORK_MAP[variant] || ARTWORK_MAP.biology;

  const heightClass = hero
    ? "h-52 sm:h-64"
    : compact
    ? "h-28"
    : "aspect-[16/9]";

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${art.fallbackBg} ${heightClass} select-none`}
    >
      <Image
        src={art.image}
        alt={art.alt}
        fill
        sizes={
          hero
            ? "(max-width: 768px) 100vw, 1200px"
            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        referrerPolicy="no-referrer"
        priority={hero || priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Measured contrast scrim melting seamlessly into obsidian card surface */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0C0F16] via-[#0C0F16]/45 to-black/25 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top overlay: Framed domain icon + quiet category text */}
      <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between gap-2 z-10">
        <SubjectIcon
          domain={art.domain}
          size="sm"
          className="backdrop-blur-md bg-[#06070B]/70 border-white/[0.15]"
        />
        <span className="text-[11px] font-semibold text-slate-200/95 tracking-wide drop-shadow-xs">
          {art.label}
        </span>
      </div>

      {/* Bottom subtitle overlay */}
      {subtitle && (
        <div className="absolute inset-x-0 bottom-0 px-5 pb-3.5 z-10">
          <p className="text-xs font-medium text-slate-300 truncate">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};
