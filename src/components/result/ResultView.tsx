"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  MinusCircle,
  Clock,
  RotateCcw,
  Trophy,
  Printer,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";
import { ExamResult, Exam } from "@/types";
import { MathText } from "@/components/math/MathText";
import { QuestionImages } from "@/components/exam/QuestionImages";
import {
  toBanglaNum,
  formatDateTimeBangla,
  formatDurationBangla,
  getOptionLetter
} from "@/utils/format";

export interface ResultViewProps {
  result: ExamResult;
  exam?: Exam;
  onRetake?: (examId: string) => void;
  onOpenLeaderboard?: (examId: string) => void;
  onBack?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  exam,
  onRetake,
  onOpenLeaderboard,
  onBack
}) => {
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");

  useEffect(() => {
    if (result.accuracy >= 70) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [result.accuracy]);

  const avgTimePerQuestion = useMemo(() => {
    const count = result.questions.length || 1;
    return Math.round(result.timeSpentSeconds / count);
  }, [result.questions.length, result.timeSpentSeconds]);

  const gradeInfo = useMemo(() => {
    if (result.accuracy >= 85) {
      return { grade: "A+", remark: "অসাধারণ পারফরম্যান্স! আপনি মেধার শীর্ষে।" };
    }
    if (result.accuracy >= 70) {
      return { grade: "A", remark: "খুব ভালো প্রস্তুতি, আরও একধাপ এগিয়ে যান।" };
    }
    if (result.accuracy >= 55) {
      return { grade: "B", remark: "ভালো চেষ্টা, ভুল উত্তরগুলো পুনরায় পর্যালোচনা করুন।" };
    }
    return { grade: "C", remark: "অধ্যায়টি পুনরায় পড়ে আবার মডেল টেস্ট অনুশীলন করুন।" };
  }, [result.accuracy]);

  const filteredQuestions = useMemo(() => {
    return result.questions
      .map((q, idx) => {
        const chosen = result.answers[idx];
        return {
          q,
          idx,
          chosen,
          status:
            chosen === undefined
              ? ("skipped" as const)
              : chosen === q.answer
              ? ("correct" as const)
              : ("wrong" as const)
        };
      })
      .filter((item) => (filter === "all" ? true : item.status === filter));
  }, [result.questions, result.answers, filter]);

  const strokeDasharray = 2 * Math.PI * 52;
  const strokeDashoffset =
    strokeDasharray -
    (strokeDasharray * Math.min(100, Math.max(0, result.accuracy))) / 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/exams"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              পরীক্ষার ফলাফল ও মূল্যায়ন
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{result.name}</span>
              <span aria-hidden="true">•</span>
              <span>{formatDateTimeBangla(result.dateISO)}</span>
              <span aria-hidden="true">•</span>
              <span>{result.mode === "live" ? "লাইভ মোড" : "প্র্যাকটিস মোড"}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট / সেভ PDF</span>
        </button>
      </div>

      {/* Main Score & Accuracy Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center">
          {/* Radial Accuracy Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={
                    result.accuracy >= 70
                      ? "text-emerald-500"
                      : result.accuracy >= 50
                      ? "text-blue-600"
                      : "text-amber-500"
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {toBanglaNum(result.accuracy)}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  সঠিকতা
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              গ্রেড {gradeInfo.grade}
            </div>
          </div>

          {/* Score & Sub-Stats */}
          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {toBanglaNum(result.score)}
                  <span className="text-lg font-medium text-slate-400 dark:text-slate-500">
                    {" "}
                    / {toBanglaNum(result.total)}
                  </span>
                </span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {gradeInfo.remark}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  <CircleCheck className="w-3.5 h-3.5" />
                  <span>সঠিক উত্তর</span>
                </div>
                <div className="text-xl font-extrabold font-mono tabular-nums text-emerald-900 dark:text-emerald-200 mt-1">
                  {toBanglaNum(result.correct)}
                </div>
              </div>

              <div className="rounded-2xl bg-red-50/70 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/60 p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-bold">
                  <CircleX className="w-3.5 h-3.5" />
                  <span>ভুল উত্তর</span>
                </div>
                <div className="text-xl font-extrabold font-mono tabular-nums text-red-900 dark:text-red-200 mt-1">
                  {toBanglaNum(result.wrong)}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>উত্তর দেননি</span>
                </div>
                <div className="text-xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
                  {toBanglaNum(result.skip)}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>মোট সময়</span>
                </div>
                <div className="text-sm sm:text-base font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-1">
                  {formatDurationBangla(result.timeSpentSeconds)}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                  গড় {toBanglaNum(avgTimePerQuestion)} সে./প্রশ্ন
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {exam && exam.retakeAllowed && (
                <button
                  type="button"
                  onClick={() => onRetake && onRetake(exam.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় পরীক্ষা দিন</span>
                </button>
              )}

              <Link
                href={`/leaderboard?examId=${result.examId}`}
                onClick={(e) => {
                  if (onOpenLeaderboard) {
                    e.preventDefault();
                    onOpenLeaderboard(result.examId);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>মেরিট লিডারবোর্ড দেখুন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Security Violations Log (if any) */}
      {result.violations && result.violations.length > 0 && (
        <div className="rounded-3xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/70 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>
              সিকিউর মোড ইন্টিগ্রিটি রিপোর্ট ({toBanglaNum(result.violations.length)}টি সতর্কতা)
            </span>
          </div>
          {result.autoSubmitted && (
            <p className="text-xs text-red-600 dark:text-red-300 mt-1 font-medium">
              সর্বোচ্চ সতর্কতা অতিক্রম করায় বা সময় শেষ হওয়ায় পরীক্ষাটি স্বয়ংক্রিয়ভাবে জমা হয়েছে।
            </p>
          )}
          <div className="mt-3 divide-y divide-red-200/70 dark:divide-red-900/50">
            {result.violations.map((v, i) => (
              <div key={i} className="py-2 flex items-center justify-between text-xs">
                <span className="font-medium text-red-800 dark:text-red-200">
                  {toBanglaNum(i + 1)}. {v.message}
                </span>
                <span className="font-mono text-red-600/80 dark:text-red-400/80 tabular-nums">
                  {new Date(v.timestamp).toLocaleTimeString("bn-BD")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              বিস্তারিত উত্তরপত্র ও ব্যাখ্যা
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              প্রতিটি প্রশ্নের সঠিক উত্তর, ব্যয়িত সময় ও সম্পূর্ণ ব্যাখ্যা পর্যালোচনা করুন
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            {[
              { id: "all", label: `সব (${toBanglaNum(result.questions.length)})` },
              { id: "correct", label: `সঠিক (${toBanglaNum(result.correct)})` },
              { id: "wrong", label: `ভুল (${toBanglaNum(result.wrong)})` },
              { id: "skipped", label: `বাকি (${toBanglaNum(result.skip)})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setFilter(tab.id as "all" | "correct" | "wrong" | "skipped")
                }
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions list */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              এই বিভাগে কোনো প্রশ্ন নেই।
            </div>
          ) : (
            filteredQuestions.map(({ q, idx, chosen, status }) => {
              const qSeconds = result.questionTimes?.[idx];

              return (
                <div key={`${q.id}_${idx}`} className="py-6 space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`font-bold ${
                          status === "correct"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : status === "wrong"
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {status === "correct"
                          ? "✓ সঠিক উত্তর"
                          : status === "wrong"
                          ? "✕ ভুল উত্তর"
                          : "— উত্তর দেওয়া হয়নি"}
                      </span>
                      {qSeconds !== undefined && (
                        <>
                          <span
                            aria-hidden="true"
                            className="text-slate-300 dark:text-slate-600"
                          >
                            •
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                            সময়: {toBanglaNum(qSeconds)} সে.
                          </span>
                        </>
                      )}
                      {q.topic && (
                        <>
                          <span
                            aria-hidden="true"
                            className="text-slate-300 dark:text-slate-600"
                          >
                            •
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {q.topic}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                      {toBanglaNum(idx + 1)}. <MathText text={q.text} />
                    </h3>
                  </div>

                  <QuestionImages images={q.questionImages} compact />

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.answer;
                      const isUserChoice = chosen === oIdx;

                      let optClass =
                        "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300";
                      if (isCorrect) {
                        optClass =
                          "border-emerald-400 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/40";
                      } else if (isUserChoice && !isCorrect) {
                        optClass =
                          "border-red-400 dark:border-red-800 bg-red-50/80 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-semibold ring-1 ring-red-500/40";
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`rounded-2xl border px-4 py-3 text-sm flex items-center justify-between gap-2.5 ${optClass}`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="font-bold mr-2">
                              {getOptionLetter(oIdx)}.
                            </span>
                            <MathText text={opt} />
                          </span>
                          {isCorrect && (
                            <CircleCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          {isUserChoice && !isCorrect && (
                            <CircleX className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation block */}
                  {q.explanation && (
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-slate-100">
                        ব্যাখ্যা:{" "}
                      </strong>
                      <MathText text={q.explanation} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
