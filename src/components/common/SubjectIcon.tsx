"use client";

import React from "react";
import {
  Dna,
  FlaskConical,
  Atom,
  Sigma,
  Languages,
  GraduationCap,
  BookOpen
} from "lucide-react";

export type SubjectDomain =
  | "biology"
  | "chemistry"
  | "physics"
  | "math"
  | "english"
  | "admission"
  | "general";

export function resolveSubjectDomain(label?: string): SubjectDomain {
  const s = (label || "").toLowerCase();
  if (s.includes("জীব") || s.includes("bio")) return "biology";
  if (s.includes("রসায়ন") || s.includes("chem")) return "chemistry";
  if (s.includes("পদার্থ") || s.includes("phy")) return "physics";
  if (s.includes("গণিত") || s.includes("math")) return "math";
  if (s.includes("ইংরেজি") || s.includes("eng")) return "english";
  if (s.includes("admission") || s.includes("ভর্তি") || s.includes("gst"))
    return "admission";
  return "general";
}

interface SubjectIconProps {
  subject?: string;
  domain?: SubjectDomain;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DOMAIN_CONFIG: Record<
  SubjectDomain,
  {
    Icon: React.ComponentType<{ className?: string }>;
    frame: string;
    iconColor: string;
  }
> = {
  biology: {
    Icon: Dna,
    frame: "bg-emerald-500/[0.11] border-emerald-500/25",
    iconColor: "text-emerald-400"
  },
  chemistry: {
    Icon: FlaskConical,
    frame: "bg-sky-500/[0.11] border-sky-500/25",
    iconColor: "text-sky-400"
  },
  physics: {
    Icon: Atom,
    frame: "bg-blue-500/[0.11] border-blue-500/25",
    iconColor: "text-blue-400"
  },
  math: {
    Icon: Sigma,
    frame: "bg-indigo-500/[0.12] border-indigo-500/25",
    iconColor: "text-indigo-400"
  },
  english: {
    Icon: Languages,
    frame: "bg-amber-500/[0.11] border-amber-500/25",
    iconColor: "text-amber-400"
  },
  admission: {
    Icon: GraduationCap,
    frame: "bg-amber-500/[0.11] border-amber-500/25",
    iconColor: "text-amber-400"
  },
  general: {
    Icon: BookOpen,
    frame: "bg-white/[0.06] border-white/[0.12]",
    iconColor: "text-slate-300"
  }
};

export const SubjectIcon: React.FC<SubjectIconProps> = ({
  subject,
  domain,
  size = "md",
  className = ""
}) => {
  const key = domain || resolveSubjectDomain(subject);
  const { Icon, frame, iconColor } = DOMAIN_CONFIG[key];

  const boxSize =
    size === "sm"
      ? "w-8 h-8 rounded-lg"
      : size === "lg"
      ? "w-11 h-11 rounded-xl"
      : "w-9 h-9 rounded-xl";

  const glyphSize =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-[18px] h-[18px]";

  return (
    <span
      className={`inline-flex items-center justify-center border shrink-0 ${boxSize} ${frame} ${className}`}
      aria-hidden="true"
    >
      <Icon className={`${glyphSize} ${iconColor}`} />
    </span>
  );
};
