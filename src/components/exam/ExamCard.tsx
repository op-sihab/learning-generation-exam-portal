"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Trophy,
  Play,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  CalendarClock,
  Lock
} from "lucide-react";
import { Exam, Course, ActiveAttempt } from "@/types";
import { SubjectIcon } from "@/components/common/SubjectIcon";
import {
  getExamStatus,
  getCountdownParts,
  getExamTotalMarks,
  toBanglaNum,
  type CountdownParts
} from "@/utils/format";

export interface ExamCardProps {
  exam: Exam;
  course?: Course;
  activeAttempt?: ActiveAttempt | null;
  hasCompleted?: boolean;
  bestScore?: number;
  latestResultId?: string;
  onOpenDetails?: (examId: string) => void;
  onViewResult?: (resultId: string) => void;
  onOpenLeaderboard?: (examId: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  course,
  activeAttempt,
  hasCompleted,
  bestScore,
  latestResultId,
  onOpenDetails,
  onViewResult,
  onOpenLeaderboard
}) => {
  const status = getExamStatus(exam, activeAttempt || null);
  const isUpcoming = status.status === "upcoming" && Boolean(exam.startTime);
  const [countdown, setCountdown] = useState<CountdownParts | null>(null);

  useEffect(() => {
    if (!isUpcoming || !exam.startTime) return;
    const initTimer = window.setTimeout(() => {
      setCountdown(getCountdownParts(exam.startTime));
    }, 0);
    const id = window.setInterval(() => {
      setCountdown(getCountdownParts(exam.startTime));
    }, 1000);
    return () => {
      window.clearTimeout(initTimer);
      window.clearInterval(id);
    };
  }, [isUpcoming, exam.startTime]);

  const totalQuestions = exam.questions.length;
  const totalMarks = getExamTotalMarks(exam);
  const bestPct =
    bestScore !== undefined && totalMarks > 0
      ? Math.min(100, Math.round((bestScore / totalMarks) * 100))
      : 0;

  const statusMeta =
    status.status === "in_progress"
      ? {
          icon: Clock,
          cls: "text-blue-400"
        }
      : status.status === "upcoming"
      ? {
          icon: CalendarClock,
          cls: "text-amber-400"
        }
      : status.status === "ended"
      ? {
          icon: Lock,
          cls: "text-slate-500"
        }
      : {
          icon: CircleDot,
          cls: "text-emerald-400"
        };

  const StatusIcon = statusMeta.icon;

  return (
    <article className="group rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-5 flex flex-col justify-between gap-4 hover:border-blue-500/45 hover:bg-[#0E121B] transition-all duration-200">
      <div className="space-y-4">
        {/* Top Row: Framed Subject Icon + Unboxed Meta + Dual-Coded Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <SubjectIcon subject={exam.subject} size="md" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {exam.subject}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {course ? course.name : exam.type || "Model Test"}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 pt-0.5 ${statusMeta.cls}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{status.label}</span>
          </span>
        </div>

        {/* Title & Chapter */}
        <div className="space-y-1">
          <Link
            href={`/exams/${exam.id}`}
            onClick={(e) => {
              if (onOpenDetails) {
                e.preventDefault();
                onOpenDetails(exam.id);
              }
            }}
            className="block"
          >
            <h3 className="text-[15px] sm:text-base font-bold text-slate-50 leading-snug group-hover:text-blue-400 transition-colors">
              {exam.name}
            </h3>
          </Link>
          {exam.chapter && (
            <p className="text-xs text-slate-400 truncate">{exam.chapter}</p>
          )}
        </div>

        {/* Sleek Obsidian Hairline Metric Strip */}
        <div className="grid grid-cols-4 gap-px rounded-xl overflow-hidden bg-white/[0.06] border border-white/[0.06] text-xs">
          <div className="bg-[#111622] px-2.5 py-2">
            <span className="text-[10px] text-slate-400 block">সময়</span>
            <span className="font-semibold font-mono text-slate-100 tabular-nums mt-0.5 block">
              {toBanglaNum(exam.minutes)} মি.
            </span>
          </div>

          <div className="bg-[#111622] px-2.5 py-2">
            <span className="text-[10px] text-slate-400 block">প্রশ্ন</span>
            <span className="font-semibold font-mono text-slate-100 tabular-nums mt-0.5 block">
              {toBanglaNum(totalQuestions)}টি
            </span>
          </div>

          <div className="bg-[#111622] px-2.5 py-2">
            <span className="text-[10px] text-slate-400 block">পূর্ণমান</span>
            <span className="font-semibold font-mono text-slate-100 tabular-nums mt-0.5 block">
              {toBanglaNum(totalMarks)}
            </span>
          </div>

          <div className="bg-[#111622] px-2.5 py-2">
            <span className="text-[10px] text-slate-400 block">নেগেটিভ</span>
            <span
              className={`font-semibold font-mono tabular-nums mt-0.5 block ${
                exam.negative > 0 ? "text-rose-400" : "text-slate-400"
              }`}
            >
              {exam.negative > 0 ? `-${toBanglaNum(exam.negative)}` : "নেই"}
            </span>
          </div>
        </div>

        {/* Upcoming Countdown */}
        {isUpcoming && countdown && (
          <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-amber-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              শুরু: {toBanglaNum(countdown.days)}দি {toBanglaNum(countdown.hours)}ঘ{" "}
              {toBanglaNum(countdown.minutes)}মি {toBanglaNum(countdown.seconds)}সে
            </span>
          </div>
        )}

        {/* Best Score Progress Indicator */}
        {hasCompleted && bestScore !== undefined && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>সেরা স্কোর</span>
              </span>
              <span className="font-mono font-semibold text-slate-200">
                {toBanglaNum(bestScore)} / {toBanglaNum(totalMarks)}
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${bestPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/leaderboard?examId=${exam.id}`}
            onClick={(e) => {
              if (onOpenLeaderboard) {
                e.preventDefault();
                onOpenLeaderboard(exam.id);
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.09] bg-[#131824] text-xs font-medium text-slate-300 hover:bg-[#181F2E] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>মেরিট</span>
          </Link>

          {hasCompleted && latestResultId && (
            <Link
              href={`/results/${latestResultId}`}
              onClick={(e) => {
                if (onViewResult) {
                  e.preventDefault();
                  onViewResult(latestResultId);
                }
              }}
              className="px-2.5 py-1.5 rounded-lg border border-white/[0.09] bg-[#131824] text-xs font-medium text-slate-300 hover:bg-[#181F2E] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              ফলাফল
            </Link>
          )}
        </div>

        {status.status === "in_progress" ? (
          <Link
            href={`/exams/${exam.id}/cbt`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>চালিয়ে যান</span>
          </Link>
        ) : status.status === "upcoming" ? (
          <Link
            href={`/exams/${exam.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-[#131824] hover:bg-[#181F2E] text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>বিস্তারিত</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : status.status === "ended" ? (
          <button
            type="button"
            disabled
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] text-slate-500 text-xs font-medium cursor-not-allowed whitespace-nowrap shrink-0"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>{hasCompleted ? "পুনরায় দিন" : "অংশগ্রহণ"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </article>
  );
};
