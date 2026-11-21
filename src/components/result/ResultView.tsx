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
import { getGradeInfo } from "@/utils/portalHelpers";

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
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "skipped">(
    "all"
  );

  useEffect(() => {
    if (result.accuracy >= 70) {
      confetti({
        particleCount: 55,
        spread: 58,
        origin: { y: 0.62 }
      });
    }
  }, [result.accuracy]);

  const avgTimePerQuestion = useMemo(() => {
    const count = result.questions.length || 1;
    return Math.round(result.timeSpentSeconds / count);
  }, [result.questions.length, result.timeSpentSeconds]);

  const gradeInfo = useMemo(
    () => getGradeInfo(result.accuracy),
    [result.accuracy]
  );

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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-xl border border-white/[0.1] bg-[#0C0F16] text-slate-200 hover:bg-[#131824] transition-colors shrink-0"
              aria-label="ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/exams"
              className="p-2.5 rounded-xl border border-white/[0.1] bg-[#0C0F16] text-slate-200 hover:bg-[#131824] transition-colors shrink-0"
              aria-label="ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-50">
              পরীক্ষার ফলাফল ও মূল্যায়ন
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 mt-0.5">
              <span className="font-medium text-slate-200">{result.name}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDateTimeBangla(result.dateISO)}</span>
              <span aria-hidden="true">·</span>
              <span>
                {result.mode === "live" ? "লাইভ মোড" : "প্র্যাকটিস মোড"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/[0.1] bg-[#0C0F16] text-xs sm:text-sm font-semibold text-slate-200 hover:bg-[#131824] transition-colors whitespace-nowrap shrink-0 print:hidden"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট / সেভ PDF</span>
        </button>
      </div>

      {/* Main Score & Accuracy Card */}
      <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[190px_1fr] gap-8 items-center">
          {/* Radial Accuracy Ring */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="9"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={
                    result.accuracy >= 70
                      ? "text-emerald-400"
                      : result.accuracy >= 50
                      ? "text-blue-400"
                      : "text-amber-400"
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-50">
                  {toBanglaNum(result.accuracy)}%
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  সঠিকতা
                </span>
              </div>
            </div>
            <div className="mt-2.5 text-xs font-mono font-bold text-blue-400">
              গ্রেড {gradeInfo.grade}
            </div>
          </div>

          {/* Score & Hairline Summary Strip */}
          <div className="space-y-5 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-slate-50">
                {toBanglaNum(result.score)}
                <span className="text-lg font-medium text-slate-500">
                  {" "}
                  / {toBanglaNum(result.total)}
                </span>
              </span>
              <span className="text-sm font-medium text-slate-300">
                {gradeInfo.remark}
              </span>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.07] grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden">
              <div className="p-3.5 bg-[#111622]">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CircleCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>সঠিক উত্তর</span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-50 mt-1">
                  {toBanglaNum(result.correct)}
                </div>
              </div>

              <div className="p-3.5 bg-[#111622]">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                  <CircleX className="w-3.5 h-3.5 shrink-0" />
                  <span>ভুল উত্তর</span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-50 mt-1">
                  {toBanglaNum(result.wrong)}
                </div>
              </div>

              <div className="p-3.5 bg-[#111622]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <MinusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>উত্তর দেননি</span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-50 mt-1">
                  {toBanglaNum(result.skip)}
                </div>
              </div>

              <div className="p-3.5 bg-[#111622]">
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>মোট সময়</span>
                </div>
                <div className="text-sm font-bold tabular-nums text-slate-50 mt-1">
                  {formatDurationBangla(result.timeSpentSeconds)}
                </div>
                <div className="text-[11px] text-slate-400 tabular-nums mt-0.5">
                  গড় {toBanglaNum(avgTimePerQuestion)} সে./প্রশ্ন
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 print:hidden">
              {exam && exam.retakeAllowed && (
                <button
                  type="button"
                  onClick={() => onRetake && onRetake(exam.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.1] bg-[#131824] text-slate-200 hover:bg-[#181F2E] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>মেরিট লিডারবোর্ড দেখুন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Security Violations Log */}
      {result.violations && result.violations.length > 0 && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/25 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              সিকিউর মোড ইন্টিগ্রিটি রিপোর্ট (
              {toBanglaNum(result.violations.length)}টি সতর্কতা)
            </span>
          </div>
          {result.autoSubmitted && (
            <p className="text-xs text-rose-300 mt-1 font-medium">
              সর্বোচ্চ সতর্কতা অতিক্রম করায় বা সময় শেষ হওয়ায় পরীক্ষাটি স্বয়ংক্রিয়ভাবে জমা হয়েছে।
            </p>
          )}
          <div className="mt-3 divide-y divide-rose-500/20">
            {result.violations.map((v, i) => (
              <div
                key={i}
                className="py-2 flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-medium text-rose-200">
                  {toBanglaNum(i + 1)}. {v.message}
                </span>
                <span className="font-mono text-rose-400/80 tabular-nums shrink-0">
                  {new Date(v.timestamp).toLocaleTimeString("bn-BD")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
          <div>
            <h2 className="text-lg font-bold text-slate-50">
              বিস্তারিত উত্তরপত্র ও ব্যাখ্যা
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রতিটি প্রশ্নের সঠিক উত্তর, ব্যয়িত সময় ও সম্পূর্ণ ব্যাখ্যা পর্যালোচনা করুন
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131824] border border-white/[0.06] text-xs font-medium overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: "all", label: `সব (${toBanglaNum(result.questions.length)})` },
              {
                id: "correct",
                label: `সঠিক (${toBanglaNum(result.correct)})`
              },
              { id: "wrong", label: `ভুল (${toBanglaNum(result.wrong)})` },
              { id: "skipped", label: `বাকি (${toBanglaNum(result.skip)})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setFilter(tab.id as "all" | "correct" | "wrong" | "skipped")
                }
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? "bg-[#1C2436] text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/[0.07]">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              এই বিভাগে কোনো প্রশ্ন নেই।
            </div>
          ) : (
            filteredQuestions.map(({ q, idx, chosen, status }) => {
              const qSeconds = result.questionTimes?.[idx];

              return (
                <div key={`${q.id}_${idx}`} className="py-6 space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          status === "correct"
                            ? "text-emerald-400"
                            : status === "wrong"
                            ? "text-rose-400"
                            : "text-slate-400"
                        }`}
                      >
                        {status === "correct" ? (
                          <CircleCheck className="w-3.5 h-3.5" />
                        ) : status === "wrong" ? (
                          <CircleX className="w-3.5 h-3.5" />
                        ) : (
                          <MinusCircle className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {status === "correct"
                            ? "সঠিক উত্তর"
                            : status === "wrong"
                            ? "ভুল উত্তর"
                            : "উত্তর দেওয়া হয়নি"}
                        </span>
                      </span>
                      {qSeconds !== undefined && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">
                            ·
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            সময়: {toBanglaNum(qSeconds)} সে.
                          </span>
                        </>
                      )}
                      {q.topic && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">
                            ·
                          </span>
                          <span className="text-slate-400">{q.topic}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-slate-100 leading-relaxed">
                      <span className="font-mono text-blue-400 mr-1.5 tabular-nums">
                        {toBanglaNum(idx + 1)}.
                      </span>
                      <MathText text={q.text} />
                    </h3>
                  </div>

                  <QuestionImages images={q.questionImages} compact />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.answer;
                      const isUserChoice = chosen === oIdx;

                      let optClass =
                        "border-white/[0.07] bg-[#111622] text-slate-300";
                      if (isCorrect) {
                        optClass =
                          "border-emerald-500/55 bg-emerald-500/12 text-emerald-200 font-semibold";
                      } else if (isUserChoice && !isCorrect) {
                        optClass =
                          "border-rose-500/55 bg-rose-500/12 text-rose-200 font-semibold";
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-2.5 ${optClass}`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="font-bold mr-2">
                              {getOptionLetter(oIdx)}.
                            </span>
                            <MathText text={opt} />
                          </span>
                          {isCorrect && (
                            <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isUserChoice && !isCorrect && (
                            <CircleX className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="rounded-xl bg-[#111622] border border-white/[0.07] px-4 py-3 text-sm text-slate-300 leading-relaxed">
                      <strong className="text-slate-100 font-semibold">
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
