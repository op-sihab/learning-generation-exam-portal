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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          সিস্টেম মেইনটেন্যান্স চলছে
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {maintenance.message || "আমাদের সার্ভার আপগ্রেড এবং প্রশ্নব্যাংক হালনাগাদ চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।"}
        </p>
        {maintenance.expectedTime && (
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>আনুমানিক পুনরায় চালু: <strong className="font-bold text-slate-900 dark:text-slate-100">{maintenance.expectedTime}</strong></span>
          </div>
        )}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onBypass}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>অ্যাডমিন বাইপাস দিয়ে প্রবেশ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
