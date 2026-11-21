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
    <div className="bg-[#0A0E17] text-slate-200 border-b border-white/[0.06] px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Megaphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-semibold text-slate-100 shrink-0">
            {notice.title}:
          </span>
          <span className="truncate text-slate-400">{notice.message}</span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.07] transition-colors shrink-0"
          title="নোটিশ বন্ধ করুন"
          aria-label="নোটিশ বন্ধ করুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
