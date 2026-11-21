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
      ? "bg-rose-500/15 border-rose-500/25 text-rose-400"
      : tone === "info"
      ? "bg-amber-500/15 border-amber-500/25 text-amber-400"
      : "bg-blue-500/15 border-blue-500/25 text-blue-400";

  const confirmBtnTone =
    tone === "danger"
      ? "bg-rose-600 hover:bg-rose-500 text-white"
      : "bg-blue-600 hover:bg-blue-500 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#0C0F16] border border-white/[0.1] p-6 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconTone}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3
              id="confirm-modal-title"
              className="text-base font-bold text-slate-50"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="বন্ধ করুন"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {description}
        </p>

        {details && details.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-px bg-white/[0.07] rounded-xl overflow-hidden border border-white/[0.08]">
            {details.map((item) => (
              <div key={item.label} className="text-center px-2 py-3 bg-[#131824]">
                <div className="text-base font-bold font-mono tabular-nums text-slate-50">
                  {item.value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
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
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-white/[0.1] bg-[#131824] text-slate-200 hover:bg-[#181F2E] transition-colors whitespace-nowrap shrink-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${confirmBtnTone}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
