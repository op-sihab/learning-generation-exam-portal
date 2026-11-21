"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ShieldAlert,
  Play,
  RotateCcw,
  Trophy,
  BookOpen
} from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { SubjectIcon } from "@/components/common/SubjectIcon";
import {
  toBanglaNum,
  formatDateBangla,
  getExamTotalMarks
} from "@/utils/format";

export default function ExamBriefingPage() {
  const params = useParams();
  const { exams, courses, activeAttempt, history } = usePortal();

  const examId = params?.examId as string;
  const exam = useMemo(
    () => exams.find((e) => e.id === examId),
    [exams, examId]
  );

  const course = useMemo(
    () => (exam ? courses.find((c) => c.id === exam.courseId) : undefined),
    [courses, exam]
  );

  const pastAttempts = useMemo(
    () => history.filter((h) => h.examId === examId),
    [history, examId]
  );

  const hasActiveAttempt = activeAttempt?.examId === examId;

  if (!exam) {
    return (
      <div className="py-16 text-center space-y-3">
        <FileText className="w-10 h-10 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">
          পরীক্ষাটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-400">
          অনুরোধকৃত পরীক্ষাটি অপসারিত হয়েছে অথবা লিংকটি ভুল।
        </p>
        <div className="pt-2">
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল পরীক্ষায় ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  const totalMarks = getExamTotalMarks(exam);
  const totalQuestions = exam.questions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/exams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল পরীক্ষায় ফিরুন</span>
        </Link>
      </div>

      {/* Main Briefing Container */}
      <section className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <SubjectIcon subject={exam.subject} size="lg" className="mt-0.5" />
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-blue-400">
                    {exam.subject}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span>{exam.type || "CBT Exam"}</span>
                  {course && (
                    <>
                      <span aria-hidden="true" className="text-slate-600">
                        ·
                      </span>
                      <span>{course.name}</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 leading-snug">
                  {exam.name}
                </h1>

                {exam.chapter && (
                  <p className="text-sm text-slate-400">
                    সিলেবাস: {exam.chapter}
                  </p>
                )}
              </div>
            </div>

            <Link
              href={`/leaderboard?examId=${exam.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-[#131824] text-slate-200 text-xs font-semibold hover:bg-[#181F2E] transition-colors shrink-0 self-start whitespace-nowrap"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>মেরিট লিস্ট</span>
            </Link>
          </div>

          {/* Hairline-Divided Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.07] rounded-xl overflow-hidden border border-white/[0.07]">
            <div className="bg-[#111622] p-4">
              <div className="text-xs text-slate-400">সময়কাল</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-50 mt-0.5">
                {toBanglaNum(exam.minutes)} মিনিট
              </div>
            </div>

            <div className="bg-[#111622] p-4">
              <div className="text-xs text-slate-400">মোট প্রশ্ন</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-50 mt-0.5">
                {toBanglaNum(totalQuestions)}টি
              </div>
            </div>

            <div className="bg-[#111622] p-4">
              <div className="text-xs text-slate-400">পূর্ণমান</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-50 mt-0.5">
                {toBanglaNum(totalMarks)} নম্বর
              </div>
            </div>

            <div className="bg-[#111622] p-4">
              <div className="text-xs text-slate-400">নেগেটিভ মার্ক</div>
              <div className="text-lg font-bold font-mono tabular-nums text-rose-400 mt-0.5">
                {exam.negative ? `-${toBanglaNum(exam.negative)}` : "নেই"}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-xl bg-[#111622] border border-white/[0.07] p-5 space-y-2.5">
            <div className="flex items-center gap-2 font-semibold text-sm text-slate-100">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>পরীক্ষার নিয়মাবলী ও শর্টকাট</span>
            </div>
            <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">
              <li>
                লাইভ CBT মোডে পরীক্ষা চলাকালীন ট্যাব পরিবর্তন বা কপি-পেস্ট করা নিষিদ্ধ।
              </li>
              <li>
                সর্বোচ্চ ৩ বার নিয়ম ভঙ্গ করলে উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে।
              </li>
              <li>
                কীবোর্ড শর্টকাট:{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-200 font-mono text-xs">
                  1–4
                </kbd>{" "}
                অপশন নির্বাচন,{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-200 font-mono text-xs">
                  ←/→
                </kbd>{" "}
                প্রশ্ন পরিবর্তন এবং{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-200 font-mono text-xs">
                  M
                </kbd>{" "}
                রিভিউ মার্ক।
              </li>
              <li>
                প্র্যাকটিস মোডে সময়সীমা নেই; প্রতিটি উত্তরের সাথে সাথে সঠিক ব্যাখ্যা দেখা যাবে।
              </li>
            </ul>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {hasActiveAttempt ? (
              <Link
                href={`/exams/${exam.id}/cbt`}
                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm text-center inline-flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>অসমাপ্ত পরীক্ষা চালিয়ে যান</span>
              </Link>
            ) : (
              <Link
                href={`/exams/${exam.id}/cbt`}
                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm text-center inline-flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>লাইভ CBT পরীক্ষা শুরু করুন</span>
              </Link>
            )}

            <Link
              href={`/exams/${exam.id}/practice`}
              className="flex-1 py-3 px-5 rounded-xl border border-white/[0.12] bg-[#131824] text-slate-100 hover:bg-[#181F2E] font-semibold text-sm text-center inline-flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>প্র্যাকটিস মোড (ব্যাখ্যাসহ)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Past Attempts */}
      {pastAttempts.length > 0 && (
        <section className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] divide-y divide-white/[0.07]">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              পূর্ববর্তী অংশগ্রহণ ({toBanglaNum(pastAttempts.length)})
            </h2>
          </div>

          {pastAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                  স্কোর: {toBanglaNum(attempt.score)}/{toBanglaNum(attempt.total)} · সঠিকতা:{" "}
                  <span className="text-emerald-400">
                    {toBanglaNum(attempt.accuracy)}%
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {formatDateBangla(attempt.dateISO)} ·{" "}
                  {attempt.mode === "live" ? "লাইভ CBT" : "প্র্যাকটিস"}
                </div>
              </div>
              <Link
                href={`/results/${attempt.id}`}
                className="px-3 py-1.5 rounded-lg border border-white/[0.1] bg-[#131824] text-xs font-semibold text-blue-400 hover:bg-[#181F2E] transition-colors whitespace-nowrap shrink-0"
              >
                ফলাফল দেখুন →
              </Link>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
