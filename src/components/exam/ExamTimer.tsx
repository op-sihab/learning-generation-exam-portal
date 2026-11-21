"use client";

import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { formatTimer, toBanglaNum } from "@/utils/format";

export interface ExamTimerProps {
  timeRemaining: number;
  totalDurationSeconds: number;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  timeRemaining,
  totalDurationSeconds
}) => {
  const isUrgent = timeRemaining <= 60 && timeRemaining > 0;
  const isCritical = timeRemaining <= 30 && timeRemaining > 0;
  const pct = Math.max(
    0,
    Math.min(100, Math.round((timeRemaining / Math.max(1, totalDurationSeconds)) * 100))
  );

  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border transition-all ${
        isCritical
          ? "bg-red-500 text-white border-red-600 animate-pulse shadow-md shadow-red-500/30"
          : isUrgent
          ? "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-bold"
          : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 shrink-0" />
      )}
      <div className="flex flex-col">
        <span className="font-mono text-sm sm:text-base font-bold tabular-nums tracking-wider">
          {toBanglaNum(formatTimer(timeRemaining))}
        </span>
      </div>
      <div className="hidden sm:block w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ml-1">
        <div
          className={`h-full transition-all duration-1000 ${
            isCritical
              ? "bg-white"
              : isUrgent
              ? "bg-red-500"
              : "bg-blue-600 dark:bg-blue-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
