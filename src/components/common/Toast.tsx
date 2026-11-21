"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 shadow-2xl backdrop-blur-sm border border-slate-700 dark:border-slate-300 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
