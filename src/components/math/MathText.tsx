"use client";

import React, { useMemo, Fragment } from "react";
import { tokenizeMathText, renderLatex } from "@/utils/math";

interface MathTextProps {
  text?: string;
  className?: string;
}

/**
 * Safely renders mixed Bengali/English prose with inline ($...$, \(...\))
 * and display ($$...$$, \[...\]) KaTeX/mhchem formulas.
 * Plain text is rendered as React text nodes (XSS-safe); only isolated
 * math tokens pass through KaTeX with trust: false.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const segments = useMemo(() => tokenizeMathText(text || ""), [text]);

  if (!text) return null;

  return (
    <span className={`math-text-root break-words ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === "text") {
          return <Fragment key={idx}>{seg.value}</Fragment>;
        }

        const rendered = renderLatex(seg.latex, seg.displayMode);

        if (seg.displayMode) {
          return (
            <span
              key={idx}
              className="math-block-wrap my-1.5 text-center"
              aria-label={seg.latex}
              dangerouslySetInnerHTML={{ __html: rendered.html }}
            />
          );
        }

        return (
          <span
            key={idx}
            className="math-inline-wrap px-0.5"
            aria-label={seg.latex}
            dangerouslySetInnerHTML={{ __html: rendered.html }}
          />
        );
      })}
    </span>
  );
};
