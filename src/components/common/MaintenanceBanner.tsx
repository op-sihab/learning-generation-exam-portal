"use client";

import React from "react";
import { AlertTriangle, Clock, Unlock } from "lucide-react";
import { Maintenance } from "@/types";

interface MaintenanceBannerProps {
  maintenance: Maintenance;
  isBypassed: boolean;
  onBypass: () => void;
}

export const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({
  maintenance,
  isBypassed,
  onBypass
}) => {
  if (!maintenance.enabled) return null;

  if (isBypassed) {
    return (
      <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>সিস্টেম বর্তমানে মেইনটেন্যান্স মোডে আছে (অ্যাডমিন বাইপাস সক্রিয়)।</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0C0F16] border border-white/[0.10] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] p-8 text-center">
        <div className="w-14 h-14 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          সিস্টেম মেইনটেন্যান্স চলছে
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {maintenance.message || "আমাদের সার্ভার আপগ্রেড এবং প্রশ্নব্যাংক হালনাগাদ চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।"}
        </p>
        {maintenance.expectedTime && (
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#131824] border border-white/[0.08] text-slate-300 text-xs font-medium">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>আনুমানিক পুনরায় চালু: <strong className="font-bold text-white">{maintenance.expectedTime}</strong></span>
          </div>
        )}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onBypass}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>অ্যাডমিন বাইপাস দিয়ে প্রবেশ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
