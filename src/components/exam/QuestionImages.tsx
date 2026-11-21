"use client";

import React, { useState } from "react";
import { ZoomIn, X } from "lucide-react";

export interface QuestionImagesProps {
  images?: string[];
  compact?: boolean;
}

export const QuestionImages: React.FC<QuestionImagesProps> = ({
  images,
  compact = false
}) => {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className={`flex flex-wrap gap-3 ${compact ? "my-2.5" : "mb-5"}`}>
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setZoomSrc(src)}
            className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/70 p-2 overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-left"
            title="বড় করে দেখুন"
          >
            <img
              src={src}
              alt={`প্রশ্নের চিত্র ${idx + 1}`}
              referrerPolicy="no-referrer"
              className={`${
                compact ? "max-h-40" : "max-h-64"
              } max-w-full w-auto object-contain rounded-lg`}
            />
            <span className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/75 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5" />
            </span>
          </button>
        ))}
      </div>

      {zoomSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomSrc(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomSrc(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              aria-label="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={zoomSrc}
              alt="প্রশ্নের বর্ধিত চিত্র"
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-full object-contain rounded-xl bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
};
