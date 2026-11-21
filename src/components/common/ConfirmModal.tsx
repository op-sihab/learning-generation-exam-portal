"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle, X } from "lucide-react";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger" | "info";
  details?: Array<{ label: string; value: string | number }>;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel = "নিশ্চিত করুন",
  cancelLabel = "বাতিল",
  tone = "primary",
  details,
  onConfirm,
  onCancel
}) => {
  if (!open) return null;

  const Icon =
    tone === "danger"
      ? AlertTriangle
      : tone === "info"
      ? Info
      : CheckCircle;

  const iconTone =
    tone === "danger"
      ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
      : tone === "info"
      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
      : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400";

  const confirmBtnTone =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconTone}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3
              id="confirm-modal-title"
              className="text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="বন্ধ করুন"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>

        {details && details.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 p-3">
            {details.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-base font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {item.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${confirmBtnTone}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
