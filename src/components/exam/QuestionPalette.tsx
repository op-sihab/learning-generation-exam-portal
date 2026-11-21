"use client";

import React, { useState } from "react";
import { Bookmark, CheckCircle2, Circle } from "lucide-react";
import { Question } from "@/types";
import { toBanglaNum } from "@/utils/format";

export interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  marked: Record<number, boolean>;
  onSelectIndex: (index: number) => void;
  compact?: boolean;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  answers,
  marked,
  onSelectIndex,
  compact = false
}) => {
  const [filter, setFilter] = useState<"all" | "answered" | "unanswered" | "marked">("all");

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const filteredQuestions = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ idx }) => {
      if (filter === "answered") return answers[idx] !== undefined;
      if (filter === "unanswered") return answers[idx] === undefined;
      if (filter === "marked") return Boolean(marked[idx]);
      return true;
    });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-center">
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60">
          <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {toBanglaNum(answeredCount)}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            উত্তর
          </div>
        </div>

        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60">
          <div className="text-base font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {toBanglaNum(markedCount)}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            মার্ক
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="text-base font-bold text-slate-700 dark:text-slate-300 tabular-nums">
            {toBanglaNum(unansweredCount)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            বাকি
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 my-3 text-[11px] font-semibold">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`py-1 rounded-lg transition-all ${
            filter === "all"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          সব ({toBanglaNum(questions.length)})
        </button>
        <button
          type="button"
          onClick={() => setFilter("answered")}
          className={`py-1 rounded-lg transition-all ${
            filter === "answered"
              ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          উত্তর
        </button>
        <button
          type="button"
          onClick={() => setFilter("unanswered")}
          className={`py-1 rounded-lg transition-all ${
            filter === "unanswered"
              ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-xs"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          বাকি
        </button>
        <button
          type="button"
          onClick={() => setFilter("marked")}
          className={`py-1 rounded-lg transition-all ${
            filter === "marked"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          মার্ক
        </button>
      </div>

      {/* Question Grid */}
      <div className="flex-1 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] pr-1">
        <div className={`grid ${compact ? "grid-cols-5" : "grid-cols-5 sm:grid-cols-6"} gap-2`}>
          {filteredQuestions.map(({ idx }) => {
            const isAnswered = answers[idx] !== undefined;
            const isMarked = Boolean(marked[idx]);
            const isCurrent = idx === currentIndex;

            let btnTone =
              "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400";

            if (isAnswered && isMarked) {
              btnTone =
                "bg-amber-500 text-white border-amber-600 shadow-xs font-bold";
            } else if (isAnswered) {
              btnTone =
                "bg-emerald-600 text-white border-emerald-700 shadow-xs font-bold";
            } else if (isMarked) {
              btnTone =
                "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-700 font-bold";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`relative h-10 rounded-xl border text-xs font-bold flex items-center justify-center transition-all ${btnTone} ${
                  isCurrent ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10" : ""
                }`}
                title={`প্রশ্ন ${toBanglaNum(idx + 1)}${isAnswered ? " (উত্তর দেওয়া)" : ""}${
                  isMarked ? " (মার্ক করা)" : ""
                }`}
              >
                <span>{toBanglaNum(idx + 1)}</span>
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
