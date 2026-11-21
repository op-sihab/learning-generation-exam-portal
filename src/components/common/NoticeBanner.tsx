"use client";

import React, { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { Notice } from "@/types";

interface NoticeBannerProps {
  notice: Notice;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ notice }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !notice || !notice.message) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 truncate">
          <span className="p-1 rounded-md bg-white/20 text-white shrink-0">
            <Megaphone className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold underline decoration-white/40 decoration-1 underline-offset-2 shrink-0">
            {notice.title}:
          </span>
          <span className="truncate text-white/90">{notice.message}</span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-white/20 transition-colors text-white/80 hover:text-white shrink-0"
          title="নোটিশ বন্ধ করুন"
          aria-label="নোটিশ বন্ধ করুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
