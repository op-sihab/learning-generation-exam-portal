"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Trophy,
  Play,
  ArrowRight
} from "lucide-react";
import { Exam, Course, ActiveAttempt } from "@/types";
import {
  getExamStatus,
  getCountdownParts,
  getExamTotalMarks,
  toBanglaNum
} from "@/utils/format";

export interface ExamCardProps {
  exam: Exam;
  course?: Course;
  activeAttempt?: ActiveAttempt | null;
  hasCompleted?: boolean;
  bestScore?: number;
  onOpenDetails?: (examId: string) => void;
  onViewResult?: (examId: string) => void;
  onOpenLeaderboard?: (examId: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  course,
  activeAttempt,
  hasCompleted,
  bestScore,
  onOpenDetails,
  onViewResult,
  onOpenLeaderboard
}) => {
  const status = getExamStatus(exam, activeAttempt || null);
  const [countdown, setCountdown] = useState(() =>
    status.status === "upcoming" && exam.startTime
      ? getCountdownParts(exam.startTime)
      : null
  );

  useEffect(() => {
    if (status.status !== "upcoming" || !exam.startTime) {
      setCountdown(null);
      return;
    }
    const id = window.setInterval(() => {
      setCountdown(getCountdownParts(exam.startTime));
    }, 1000);
    return () => window.clearInterval(id);
  }, [status.status, exam.startTime]);

  const totalQuestions = exam.questions.length;
  const totalMarks = getExamTotalMarks(exam);

  const statusTextColor =
    status.tone === "emerald"
      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
      : status.tone === "purple"
      ? "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60"
      : status.tone === "amber"
      ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60"
      : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";

  return (
    <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-400 dark:hover:border-blue-700/70 hover:shadow-xl transition-all">
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
              {course ? course.name : "কাস্টম পরীক্ষা"}
            </span>
            <span aria-hidden="true">•</span>
            <span className="truncate">{exam.subject}</span>
          </div>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 text-[11px] ${statusTextColor}`}
          >
            {status.label}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/exams/${exam.id}`}
          onClick={(e) => {
            if (onOpenDetails) {
              e.preventDefault();
              onOpenDetails(exam.id);
            }
          }}
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {exam.name}
          </h3>
        </Link>

        {/* Exam Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
              সময়
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {toBanglaNum(exam.minutes)} মিনিট
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
              প্রশ্ন
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {toBanglaNum(totalQuestions)}টি
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
              পূর্ণমান
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {toBanglaNum(totalMarks)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
              নেগেটিভ
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {exam.negative > 0 ? `−${toBanglaNum(exam.negative)}` : "নেই"}
            </span>
          </div>
        </div>

        {/* Upcoming Countdown */}
        {status.status === "upcoming" && countdown && (
          <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-amber-700 dark:text-amber-400 pt-1">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              শুরু হতে বাকি: {toBanglaNum(countdown.days)}দি {toBanglaNum(countdown.hours)}ঘ{" "}
              {toBanglaNum(countdown.minutes)}মি {toBanglaNum(countdown.seconds)}সে
            </span>
          </div>
        )}

        {/* Best Score Notice */}
        {hasCompleted && bestScore !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium pt-0.5 tabular-nums">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>
              আপনার সেরা স্কোর: <strong>{toBanglaNum(bestScore)}</strong> / {toBanglaNum(totalMarks)}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/leaderboard?examId=${exam.id}`}
          onClick={(e) => {
            if (onOpenLeaderboard) {
              e.preventDefault();
              onOpenLeaderboard(exam.id);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>মেরিট</span>
        </Link>

        <div className="flex items-center gap-2">
          {hasCompleted && (
            <Link
              href={`/results/${exam.id}`}
              onClick={(e) => {
                if (onViewResult) {
                  e.preventDefault();
                  onViewResult(exam.id);
                }
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              ফলাফল
            </Link>
          )}

          {status.status === "in_progress" ? (
            <Link
              href={`/exams/${exam.id}/cbt`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>চালিয়ে যান</span>
            </Link>
          ) : status.status === "upcoming" ? (
            <Link
              href={`/exams/${exam.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <span>বিস্তারিত</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : status.status === "ended" ? (
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed whitespace-nowrap shrink-0"
            >
              সমাপ্ত
            </button>
          ) : (
            <Link
              href={`/exams/${exam.id}`}
              onClick={(e) => {
                if (onOpenDetails) {
                  e.preventDefault();
                  onOpenDetails(exam.id);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <span>{hasCompleted ? "পুনরায় দিন" : "অংশগ্রহণ"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
